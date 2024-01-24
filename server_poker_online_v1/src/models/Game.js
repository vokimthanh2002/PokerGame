// src/models/Game.js
const mysql = require('mysql2/promise');

class Game {
  static async create(tableId, startTime, endTime, winnerId = null) {
    const connection = await mysql.createConnection(/* MySQL connection configuration */);

    try {
      const [result] = await connection.execute(`
        INSERT INTO Games (table_id, start_time, end_time, winner_id)
        VALUES (?, ?, ?, ?)
      `, [tableId, startTime, endTime, winnerId]);

      return result;
    } catch (error) {
      console.error('Error creating game:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async getById(gameId) {
    const connection = await mysql.createConnection(/* MySQL connection configuration */);

    try {
      const [rows] = await connection.execute('SELECT * FROM Games WHERE game_id = ?', [gameId]);

      return rows[0];
    } catch (error) {
      console.error('Error getting game by ID:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  // Other methods for the Game model
}

module.exports = Game;
