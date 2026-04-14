const { login, register, getProfile } = require('../controllers/authController');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../config/db', () => ({
  query: jest.fn()
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('sikeres bejelentkezésnél tokent kell adnia', async () => {
      req.body = { email: 'kovacsvok@gmail.com', password: 'user123' };
      const mockUser = [{ id: 2, email: 'kovacsvok@gmail.com', password_hash: 'hashed', role: 'client' }];
      
      db.query.mockResolvedValueOnce([mockUser]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake_jwt_token');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        token: 'fake_jwt_token',
        user: expect.objectContaining({ email: 'kovacsvok@gmail.com' })
      }));
    });

    it('401-et kell adnia hibás jelszó esetén', async () => {
      req.body = { email: 'test@test.hu', password: 'wrong' };
      db.query.mockResolvedValueOnce([[{ password_hash: '...' }]]);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('401-et kell adnia, ha nem létezik a felhasználó', async () => {
      req.body = { email: 'nincs@ilyen.hu' };
      db.query.mockResolvedValueOnce([[]]);
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('register', () => {
    it('400-at kell adnia, ha már létezik az email', async () => {
      req.body = { email: 'letezo@email.hu' };
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('sikeres regisztrációt kell végeznie', async () => {
      req.body = { email: 'uj@email.hu', password: 'pw', name: 'Új' };
      db.query.mockResolvedValueOnce([[]]) // Email check
              .mockResolvedValueOnce([{ insertId: 10 }]); // Insert
      bcrypt.hash.mockResolvedValue('hashed');

      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getProfile', () => {
    it('vissza kell adnia a bejelentkezett profil adatait', async () => {
      req.user = { id: 2 };
      const mockUser = { id: 2, email: 'kovacsvok@gmail.com' };
      db.query.mockResolvedValueOnce([[mockUser]]);

      await getProfile(req, res);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('404-et kell adnia, ha a profil már nem létezik', async () => {
      req.user = { id: 99 };
      db.query.mockResolvedValueOnce([[]]);
      await getProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});