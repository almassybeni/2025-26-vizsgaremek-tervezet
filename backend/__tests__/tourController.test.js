const { getAllTours, getTourById, createTour, updateTour, deleteTour, getTourBySlug } = require('../controllers/tourController');
const db = require('../config/db');

jest.mock('../config/db', () => ({
  query: jest.fn()
}));

describe('Tour Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getAllTours', () => {
    it('vissza kell adnia az összes túrát és tömbbé kell alakítania a JSON mezőket', async () => {
      const mockTours = [
        { 
          id: 1, 
          title: 'Teszt Túra', 
          highlights: '["Kóstoló", "Séta"]', 
          included: '["Ebéd"]',
          not_included: '["Ital"]'
        }
      ];
      db.query.mockResolvedValue([mockTours]);

      await getAllTours(req, res);

      expect(res.json).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 1,
          highlights: ["Kóstoló", "Séta"],
          included: ["Ebéd"],
          not_included: ["Ital"]
        })
      ]);
    });

    it('500-as hibát kell dobnia adatbázis hiba esetén', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      db.query.mockRejectedValue(new Error('Adatbázis hiba'));
      
      await getAllTours(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Szerver hiba' });
      consoleSpy.mockRestore();
    });

    it('szűrnie kell régió alapján, ha a query paraméter meg van adva', async () => {
      req.query.region = 'budapest';
      db.query.mockResolvedValue([[]]);
      await getAllTours(req, res);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('AND (t.region = ? OR t.city = ?)'), expect.arrayContaining(['budapest']));
    });
  });

  describe('getTourById', () => {
    it('vissza kell adnia egy túrát azonosító alapján a dátumokkal együtt', async () => {
      req.params.id = '1';
      const mockTour = { id: 1, title: 'Teszt Túra', highlights: '[]' };
      const mockDates = [{ id: 10, start_date: '2024-06-15' }];

      db.query
        .mockResolvedValueOnce([[mockTour]]) // Első hívás: túra adatok
        .mockResolvedValueOnce([mockDates]);  // Második hívás: időpontok

      await getTourById(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        dates: mockDates
      }));
    });

    it('404-es hibát kell adnia, ha nem létezik a túra', async () => {
      req.params.id = '999';
      db.query.mockResolvedValueOnce([[]]);

      await getTourById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Túra nem található' });
    });
  });

  describe('createTour', () => {
    it('sikeresen létre kell hoznia egy új túrát', async () => {
      req.body = {
        title: 'Új Kaland',
        price: 5000,
        status: 'active',
        highlights: ['Pont 1'],
        dates: [{ start_date: '2024-07-01' }]
      };

      db.query.mockResolvedValueOnce([{ insertId: 50 }]); // Túra mentése
      db.query.mockResolvedValueOnce([]); // Dátumok mentése (loop)

      await createTour(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Túra sikeresen létrehozva', id: 50 });
    });
  });

  describe('getTourBySlug', () => {
    it('vissza kell adnia a túrát a cím (slug) alapján', async () => {
      req.params.slug = 'budapesti-seta';
      db.query.mockResolvedValueOnce([[{ id: 5, title: 'Budapesti Seta', highlights: '[]' }]])
              .mockResolvedValueOnce([[]]); // Dátumok

      await getTourBySlug(req, res);
      expect(res.json).toHaveBeenCalled();
    });

    it('404-et kell adnia, ha nem található a slug', async () => {
      req.params.slug = 'nem-letezo';
      db.query.mockResolvedValueOnce([[]]);
      await getTourBySlug(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateTour', () => {
    it('sikeresen frissítenie kell a túra adatait', async () => {
      req.params.id = '1';
      req.body = { title: 'Modosított', highlights: [] };
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await updateTour(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Túra frissítve' });
    });
  });

  describe('deleteTour', () => {
    it('inaktívvá kell tennie a túrát (soft delete)', async () => {
      req.params.id = '1';
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await deleteTour(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Túra törölve' });
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE tours SET is_active = 0'), ['1']);
    });

    it('500-at kell adnia törlési hiba esetén', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      db.query.mockRejectedValue(new Error('Delete error'));
      await deleteTour(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });
});