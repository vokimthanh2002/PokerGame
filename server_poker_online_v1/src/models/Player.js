// models/player.js
const mysql = require('mysql2/promise');
const config = {
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'poker_online_vs1',
};

class Player {
  constructor() {
    // Initialize the Player object
  }

  static async create(email, hashedPassword) {
    const connection = await mysql.createConnection(config);

    try {
      await connection.execute('INSERT INTO Players (email, password) VALUES (?, ?)', [email, hashedPassword]);
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async getById(playerId) {
    const connection = await mysql.createConnection(config);

    try {
      const [rows, fields] = await connection.execute('SELECT * FROM Players WHERE player_id = ?', [playerId]);
      return rows[0];
    } catch (error) {
      console.error('Error getting player by ID:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async getByEmail(email) {
    const connection = await mysql.createConnection(config);

    try {
      const [rows, fields] = await connection.execute('SELECT * FROM Players WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      console.error('Error getting player by email:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }

  // Other methods for the Player model
}

module.exports = Player;
