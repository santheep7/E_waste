const User = require('../model/Usermodel');
const jwt = require('jsonwebtoken');

// Temporary in-memory OTP store
let otpStore = {};

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// === Registration OTP ===
const requestOtp = async (req, res) => {
  try {
    const { name, email, password, place, address, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists", status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore[email] = {
      otp,
      userData: { name, email, password, place, address, phone },
      expiresAt
    };

    console.log(`OTP for registration (${email}): ${otp}`);

    return res.status(200).json({ msg: "OTP sent successfully", status: 200, userId: email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error generating OTP", status: 500 });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const entry = otpStore[userId];
    if (!entry) {
      return res.status(400).json({ msg: "OTP not found or expired", status: 400 });
    }
    if (entry.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP", status: 400 });
    }
    if (Date.now() > entry.expiresAt) {
      delete otpStore[userId];
      return res.status(400).json({ msg: "OTP expired", status: 400 });
    }

    const user = new User(entry.userData);
    await user.save();
    delete otpStore[userId];

    return res.status(200).json({ msg: "User registration successful!", status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "OTP verification failed", status: 500 });
  }
};

// === Password Login ===
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loguser = await User.findOne({ email });
    if (!loguser) {
      return res.status(400).json({ msg: "User not found", status: 400 });
    }
    if (loguser.password !== password) {
      return res.status(400).json({ msg: "Invalid credentials", status: 400 });
    }

    const token = jwt.sign(
      { id: loguser._id },
      process.env.jwt_secret_key,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      msg: "User login success",
      status: 200,
      token,
      name: loguser.name,
      id: loguser._id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Login error", status: 500 });
  }
};

// === OTP Login ===
const requestOtpLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found", status: 400 });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore[email] = { otp, expiresAt };

    console.log(`OTP for login (${email}): ${otp}`);

    return res.status(200).json({ msg: "OTP sent successfully", status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error generating OTP", status: 500 });
  }
};

const verifyOtpLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const entry = otpStore[email];
    if (!entry) {
      return res.status(400).json({ msg: "OTP not found or expired", status: 400 });
    }
    if (entry.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP", status: 400 });
    }
    if (Date.now() > entry.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ msg: "OTP expired", status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found", status: 400 });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.jwt_secret_key,
      { expiresIn: "1h" }
    );

    delete otpStore[email];

    return res.status(200).json({
      msg: "User login success via OTP",
      status: 200,
      token,
      name: user.name,
      id: user._id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "OTP verification failed", status: 500 });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
  Login,
  requestOtpLogin,
  verifyOtpLogin
};
