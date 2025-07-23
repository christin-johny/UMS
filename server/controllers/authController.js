const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name:username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.log('Error during registration:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.isAdmin) {
      return res.status(401).json({ message: 'Enter correct user details'});
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const { _id, name, email, isAdmin, profileImage } = req.user;

  res.status(200).json({
    _id,
    name,
    email,
    isAdmin,
    profileImage,
  });
};

exports.uploadProfileImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    req.user.profileImage = `/uploads/${req.file.filename}`;
    await req.user.save();

    res.status(200).json({
      message: 'Profile image updated',
      profileImage: req.user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};