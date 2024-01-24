
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Player = require('../models/Player');
const nodemailer = require('nodemailer');

// Biến toàn cục để lưu trữ OTP tạm thời
const otpMemoryStorage = {};

const checkEmailExits = async (req, res) => {
  const { email } = req.body;

  try {
    const existingPlayer = await Player.getByEmail(email);

    if (existingPlayer) {
      res.json({ exists: true, message: 'Email already exists' });
    } else {
      res.json({ exists: false, message: 'Email available' });
    }
  } catch (error) {
    console.error('Error checking email:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Hàm kiểm tra định dạng email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOTP = async (email, otp) => {
  // Lưu OTP vào biến toàn cục
  otpMemoryStorage[email] = otp;
};

const removeStoredOTP = async (email) => {
  // Xóa OTP từ biến toàn cục
  delete otpMemoryStorage[email];
};

const getStoredOTP = async (email) => {
  // Lấy OTP từ biến toàn cục
  return otpMemoryStorage[email];
};

const markEmailAsVerified = async (email) => {
  // Cập nhật trạng thái xác nhận email trong cơ sở dữ liệu
  // Ví dụ: update trong bảng Players
};

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vothanh6081@gmail.com',  // Địa chỉ email của bạn
      pass: 'ezvz lpmi wcki ymmy',   // Mật khẩu email của bạn
    },
  });

  const mailOptions = {
    from: 'vothanh6081@gmail.com',    // Địa chỉ email của bạn
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for registration is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

const registerPlayer = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  try {
    const existingPlayer = await Player.getByEmail(email);

    if (existingPlayer) {
      return res.status(400).json({ success: false, message: 'Email is already taken' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Lưu OTP vào biến toàn cục
    saveOTP(email, otp);

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: 'Send mail successful. Please check your email for OTP verification.' });
  } catch (error) {
    console.error('Error registering player:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    // Lấy OTP từ biến toàn cục
    const storedOTP = await getStoredOTP(email);

    // Kiểm tra OTP nhập vào với OTP lưu trữ
    const isOTPValid = otp === storedOTP;

    if (!isOTPValid) {
      return res.status(400).json({ success: false, message: 'OTP không hợp lệ' });
    }

    // Xác nhận email (ví dụ: cập nhật trạng thái trong bảng Players)
    await markEmailAsVerified(email);

    // Lưu người chơi vào cơ sở dữ liệu
    const hashedPassword = await bcrypt.hash(password, 10);
    await Player.create(email, hashedPassword);

    // Xóa OTP từ biến toàn cục
    await removeStoredOTP(email);

    res.json({ success: true, message: 'Xác nhận OTP và lưu người chơi thành công' });
  } catch (error) {
    console.error('Lỗi khi xác nhận OTP và lưu người chơi:', error.message);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
  }
};

const loginPlayer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kiểm tra xem người chơi có tồn tại và mật khẩu đúng không
    const player = await Player.getByEmail(email);

    if (!player) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, player.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Tạo JWT token để gửi về client
    const token = jwt.sign({ playerId: player.player_id, email: player.email }, 'your_secret_key');

    res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error logging in player:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  registerPlayer,
  loginPlayer,
  checkEmailExits,
  verifyOTP,
};
