const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Cấu hình kết nối MySQL
const config = {
  user: 'root',
  password: '12345',
  host: 'localhost',
  database: 'poker_online_vs1',
};

// Tạo pool kết nối MySQL
const pool = mysql.createPool(config);

// Kết nối đến MySQL bằng pool
const poolConnect = pool.getConnection()
  .then((connection) => {
    console.log('Connected to MySQL Server');
    connection.release();
  })
  .catch((err) => {
    console.error('Error connecting to MySQL Server:', err);
  });

// Đảm bảo kết nối MySQL thành công trước khi khởi động server
Promise.all([poolConnect]).then(() => {
  // Routes
  const authRoutes = require('./routes/authRoutes');

  // Đăng ký routes auth
  app.use('/auth', authRoutes);

  // Bạn có thể đăng ký các routes khác ở đây (gameRoutes, tableRoutes, v.v.)

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
});
