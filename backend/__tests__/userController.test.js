const { getAllUsers, updateUser, requestPasswordChange, changePasswordWithToken } = require('../controllers/userController');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

jest.mock('../config/db', () => ({
  query: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password')
}));

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1, role: 'admin' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('vissza kell adnia az összes felhasználót', async () => {
      const mockUsers = [{ id: 1, name: 'Admin' }, { id: 2, name: 'Kovács' }];
      db.query.mockResolvedValue([mockUsers]);

      await getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('500-as hibát kell adnia adatbázis hiba esetén', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      db.query.mockRejectedValue(new Error('DB Error'));
      
      await getAllUsers(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });

    it('üres tömböt kell adnia, ha nincsenek felhasználók', async () => {
      db.query.mockResolvedValue([[]]);
      await getAllUsers(req, res);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('updateUser', () => {
    it('adminnak engedélyeznie kell a szerepkör módosítását', async () => {
      req.params.id = '2';
      req.body = { name: 'Módosított', role: 'admin', is_active: 1 };
      const mockUpdatedUser = [{ id: 2, name: 'Módosított', role: 'admin' }];

      db.query.mockResolvedValueOnce([]); // UPDATE hívás
      db.query.mockResolvedValueOnce([mockUpdatedUser]); // SELECT hívás

      await updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Felhasználó frissítve',
        user: mockUpdatedUser[0]
      }));
    });

    it('403-as hibát kell adnia, ha nem admin próbál szerepkört váltani', async () => {
      req.user.role = 'client';
      req.params.id = '1';
      req.body = { role: 'admin' };

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nincs jogosultságod' });
    });

    it('500-as hibát kell adnia, ha az adatbázis frissítés sikertelen', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      req.params.id = '1';
      db.query.mockRejectedValue(new Error('Update failed'));
      await updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });

  describe('requestPasswordChange', () => {
    it('létre kell hoznia egy jelszó-visszaállítási tokent', async () => {
      req.body = { user_id: 2 };
      db.query.mockResolvedValue([]);

      await requestPasswordChange(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Jelszóváltoztatási kérelem elküldve',
        token: expect.any(String)
      }));
    });

    it('500-as hibát kell adnia token generálási hiba esetén', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      db.query.mockRejectedValue(new Error('Insert error'));
      await requestPasswordChange(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });

  describe('changePasswordWithToken', () => {
    it('sikeresen meg kell változtatnia a jelszót érvényes tokennel', async () => {
      req.body = { token: 'valid_token', new_password: 'new_password123' };
      const mockReset = [{ id: 1, user_id: 2 }];

      db.query.mockResolvedValueOnce([mockReset]); // Token ellenőrzés
      db.query.mockResolvedValueOnce([]); // Jelszó frissítés
      db.query.mockResolvedValueOnce([]); // Token elhasználása

      await changePasswordWithToken(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Jelszó sikeresen módosítva' });
      expect(bcrypt.hash).toHaveBeenCalledWith('new_password123', 10);
    });

    it('400-as hibát kell adnia érvénytelen tokennél', async () => {
      req.body = { token: 'invalid', new_password: '...' };
      db.query.mockResolvedValueOnce([[]]);

      await changePasswordWithToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Érvénytelen vagy lejárt token' });
    });

    it('500-as hibát kell adnia, ha a jelszó hashelés sikertelen', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      db.query.mockResolvedValueOnce([[{ user_id: 1 }]]);
      bcrypt.hash.mockRejectedValue(new Error('Hash error'));
      await changePasswordWithToken(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      consoleSpy.mockRestore();
    });
  });
});