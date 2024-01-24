// src/models/Table.js
const mysql = require('mysql2/promise');

class Table {
  static async create(tableName, maxPlayers = 6, stake = 100, status = 'waiting') {
    const connection = await mysql.createConnection(/* MySQL connection configuration */);

    try {
      const [result] = await connection.execute(`
        INSERT INTO Tables (table_name, max_players, stake, status)
        VALUES (?, ?, ?, ?)
      `, [tableName, maxPlayers, stake, status]);

      return result;
    } catch (error) {
      console.error('Error creating table:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  static async getById(tableId) {
    const connection = await mysql.createConnection(/* MySQL connection configuration */);

    try {
      const [rows] = await connection.execute('SELECT * FROM Tables WHERE table_id = ?', [tableId]);

      return rows[0];
    } catch (error) {
      console.error('Error getting table by ID:', error.message);
      throw error;
    } finally {
      await connection.end();
    }
  }

  // Other methods for the Table model
}

module.exports = Table;
