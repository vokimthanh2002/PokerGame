// src/models/GameDetail.js
const mysql = require('mysql2/promise');

class GameDetail {
  static async create(gameId, playerId, actionTime, actionType, amount) {
    const connection = await mysql.createConnection(/* MySQL connection configuration */);

    try {
      const [result] = await connection.execute(`
        INSERT INTO GameDetails (game_id, player_id, action_time, action_type, amount)
        VALUES (?, ?, ?, ?, ?)
      `, [gameId, playerId, actionTime, actionType, amount]);

      return result;
    } catch (error) {
      console.error('Error creating game detail:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async getById(detailId) {
    const connection = await mysql.createConnection(/* MySQL connection configuration */);

    try {
      const [rows] = await connection.execute('SELECT * FROM GameDetails WHERE detail_id = ?', [detailId]);

      return rows[0];
    } catch (error) {
      console.error('Error getting game detail by ID:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  // Other methods for the GameDetail model
}

module.exports = GameDetail;
