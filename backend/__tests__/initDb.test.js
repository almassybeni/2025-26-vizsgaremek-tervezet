const initDatabase = require('../config/initDb');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

jest.mock('mysql2/promise');
jest.mock('bcryptjs');

describe('Database Initialization Config', () => {
  let mockConnection;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn().mockResolvedValue([]),
      end: jest.fn().mockResolvedValue([]),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
    bcrypt.hash.mockResolvedValue('hashed_password');
    
    // Konzolos kimenetek elnyomása a teszt alatt
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('le kell futtatnia a teljes inicializálási folyamatot hiba nélkül', async () => {
    await initDatabase();

    // Ellenőrizzük a fontosabb SQL utasításokat
    expect(mysql.createConnection).toHaveBeenCalled();
    
    // Megnézzük, hogy hívtak-e tábla törlést
    expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('DROP TABLE IF EXISTS'));
    
    // Megnézzük, hogy hívtak-e felhasználó beszúrást
    expect(mockConnection.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.any(Array)
    );

    expect(mockConnection.end).toHaveBeenCalled();
  });

  it('le kell zárnia a kapcsolatot hiba esetén is', async () => {
    mockConnection.query.mockRejectedValueOnce(new Error('SQL Syntax Error'));

    await expect(initDatabase()).rejects.toThrow('SQL Syntax Error');
    expect(mockConnection.end).toHaveBeenCalled();
  });
});