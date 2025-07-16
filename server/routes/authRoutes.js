const express = require('express');
const { registerUser, loginUser, logoutUser, getUserProfile,uploadProfileImage,} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.post('/upload', protect, upload.single('image'), uploadProfileImage);




module.exports = router;
