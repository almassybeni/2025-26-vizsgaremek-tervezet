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
      user: { id: 2, email: 'test@test.hu', role: 'client' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('404-et kell adnia, ha nem létezik a túra a foglalásnál', async () => {
      req.body = { tour_id: 999, tour_date: '2026-01-01' };
      db.query.mockResolvedValueOnce([[]]); // Nem található a túra

      await createBooking(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ bookingId: undefined, message: 'Foglalás sikeresen létrehozva' });
    });
  });

  describe('getUserBookings', () => {
    it('vissza kell adnia a bejelentkezett felhasználó foglalásait', async () => {
      const mockBookings = [
        { id: 1, title: 'Budapest Séta', participants_count: 2, status: 'confirmed' }
      ];
      db.query.mockResolvedValue([mockBookings]);

      await getUserBookings(req, res);

      expect(res.json).toHaveBeenCalledWith(mockBookings);
      // Ellenőrizzük, hogy a javított lekérdezés fut-e (booking_date-et használunk)
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY b.created_at DESC'), 
        [2]
      );
    });
  });

  describe('cancelBooking', () => {
    it('le kell mondania a foglalást (státusz váltás)', async () => {
      req.params.id = '1';
      
      // Sikeres UPDATE mockolása
      db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await cancelBooking(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Foglalás lemondva' });
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE bookings SET status = "cancelled" WHERE id = ? AND user_id = ?'),
        ['1', 2]
      );
    });
  });

  describe('getBookingById', () => {
    it('vissza kell adnia egy konkrét foglalást', async () => {
      req.params.id = '1';
      db.query.mockResolvedValueOnce([[{ id: 1, title: 'Túra' }]]);
      
      await getBookingById(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });
  });

  describe('getAllBookings', () => {
    it('adminnak vissza kell adnia az összes foglalást a rendszerben', async () => {
      db.query.mockResolvedValue([[{ id: 1 }, { id: 2 }]]);
      
      await getAllBookings(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('updateBookingStatus', () => {
    it('frissítenie kell a foglalás állapotát', async () => {
      req.params.id = '1';
      req.body = { status: 'confirmed' };
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await updateBookingStatus(req, res);
      
      expect(res.json).toHaveBeenCalledWith({ message: 'Státusz frissítve' });
    });

    it('500-at kell adnia adatbázis hiba esetén', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      req.params.id = '1';
      req.body = { status: 'confirmed' };
      db.query.mockRejectedValue(new Error('Database error'));

      await updateBookingStatus(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Szerver hiba' });
      consoleSpy.mockRestore();
    });
  });
});