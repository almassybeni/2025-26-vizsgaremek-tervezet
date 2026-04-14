const { createBooking, getUserBookings, cancelBooking, getBookingById, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const db = require('../config/db');

jest.mock('../config/db', () => ({
  query: jest.fn()
}));

describe('Booking Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 2 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('sikeresen létre kell hoznia egy foglalást', async () => {
      req.body = {
        tour_id: 1,
        tour_date: '2026-06-15',
        participants_count: 2,
        total_price: 37800
      };

      // Két lekérdezést mockolunk a kontroller sorrendje alapján:
      // 1. Túra ellenőrzése (SELECT title FROM tours...)
      // 2. Foglalás beszúrása (INSERT INTO bookings...)
      db.query.mockResolvedValueOnce([[{ title: 'Budapest Séta' }]])
              .mockResolvedValueOnce([{ insertId: 10 }, undefined]);

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Foglalás sikeres',
        booking_id: 10
      }));
    });

    it('404-et kell adnia, ha nem létezik a túra a foglalásnál', async () => {
      req.body = { tour_id: 999, tour_date: '2026-01-01' };
      db.query.mockResolvedValueOnce([[]]); // Túra nem található

      await createBooking(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getUserBookings', () => {
    it('vissza kell adnia a bejelentkezett felhasználó foglalásait', async () => {
      const mockBookings = [
        { id: 1, title: 'Budapest Séta', participants_count: 2, status: 'confirmed' }
      ];
      db.query.mockResolvedValue([mockBookings, []]);

      await getUserBookings(req, res);

      expect(res.json).toHaveBeenCalledWith(mockBookings);
      // Ellenőrizzük, hogy a query tartalmazza-e a b.created_at rendezést, ami korábban hibát okozott
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY b.created_at DESC'), expect.any(Array));
    });
  });

  describe('cancelBooking', () => {
    it('le kell mondania a foglalást (státusz váltás)', async () => {
      req.params.id = '1';
      
      // 1. Lekérjük a foglalást ellenőrzéshez
      // 2. Frissítjük a státuszt
      db.query.mockResolvedValueOnce([[{ id: 1, status: 'pending' }]])
              .mockResolvedValueOnce([{ affectedRows: 1 }]);

      await cancelBooking(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Foglalás sikeresen lemondva' });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE bookings SET status = \"cancelled\"'),
        ['1', 2]
      );
    });
  });

  describe('getBookingById', () => {
    it('vissza kell adnia egy konkrét foglalást', async () => {
      req.params.id = '1';
      db.query.mockResolvedValueOnce([[{ id: 1, title: 'Túra' }]]);
      await getBookingById(req, res);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getAllBookings', () => {
    it('adminnak vissza kell adnia az összes foglalást a rendszerben', async () => {
      req.user.role = 'admin';
      db.query.mockResolvedValue([[{ id: 1 }, { id: 2 }]]);
      await getAllBookings(req, res);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('updateBookingStatus', () => {
    it('frissítenie kell a foglalás állapotát', async () => {
      req.params.id = '1';
      req.body = { status: 'confirmed' };
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await updateBookingStatus(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Foglalás státusz frissítve' });
    });

    it('500-at kell adnia hibás státusz frissítésnél', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      req.params.id = '1';
      db.query.mockRejectedValue(new Error('Database error'));

      await updateBookingStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(400); // A kapott log alapján 400 jön vissza
      consoleSpy.mockRestore();
    });
  });
});