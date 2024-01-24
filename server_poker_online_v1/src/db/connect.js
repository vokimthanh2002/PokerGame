// createTables.js
const mysql = require('mysql2/promise');
const Player = require('../models/Player');

// Thay thế các thông tin cấu hình của bạn
const config = {
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'poker_online_vs1',
};
// Kết nối đến MySQL và tạo bảng
async function createTables() {
  const connection = await mysql.createConnection(config);

  try {
    // Tạo bảng Players
    await connection.execute(`
    CREATE TABLE Players (
      player_id INT AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      points INT DEFAULT 0,
      level INT DEFAULT 1,
      PRIMARY KEY (player_id)
    ) AUTO_INCREMENT=100000000;
    `);

    // Tạo bảng Tables
    await connection.execute(`
      CREATE TABLE Tables (
        table_id INT PRIMARY KEY AUTO_INCREMENT,
        table_name VARCHAR(255) NOT NULL,
        max_players INT DEFAULT 6,
        stake INT DEFAULT 100,
        status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting'
        -- Thêm các trường khác nếu cần
      )
    `);

    // Tạo bảng Games
    await connection.execute(`
      CREATE TABLE Games (
        game_id INT PRIMARY KEY AUTO_INCREMENT,
        table_id INT,
        start_time DATETIME,
        end_time DATETIME,
        winner_id INT,
        FOREIGN KEY (table_id) REFERENCES Tables(table_id),
        FOREIGN KEY (winner_id) REFERENCES Players(player_id)
      )
    `);

    // Tạo bảng GameDetails
    await connection.execute(`
      CREATE TABLE GameDetails (
        detail_id INT PRIMARY KEY AUTO_INCREMENT,
        game_id INT,
        player_id INT,
        action_time DATETIME,
        action_type ENUM('bet', 'fold', 'check', 'call', 'raise', 'all-in'),
        amount INT,
        FOREIGN KEY (game_id) REFERENCES Games(game_id),
        FOREIGN KEY (player_id) REFERENCES Players(player_id)
      )
    `);

    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error.message);
  } finally {
    // Đóng kết nối sau khi hoàn thành công việc
    await connection.end();
  }
}

// Gọi hàm để tạo bảng
createTables();