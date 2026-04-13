const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const User = require('../models/user');
const { saveFCMToken } = require('../controllers/authController');
const authRouter = express.Router();


authRouter.post('/register', register);
authRouter.post('/login', login);


authRouter.get('/getMe', isAuthenticated, getMe);
authRouter.post('/logout', isAuthenticated, logout);


authRouter.post(
    '/upload/profile-picture',
    isAuthenticated,
    upload.single('profilePicture'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            
            const imagePath = `/uploads/profiles/${req.file.filename}`;

            const user = await User.findByIdAndUpdate(
                req.userId,
                { profilePicture: imagePath },
                { new: true }
            ).select('-password');

            res.status(200).json({
                success: true,
                message: 'Profile picture uploaded successfully',
                user
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error uploading profile picture',
                error: error.message
            });
        }
    }
);

authRouter.post("/save-token", isAuthenticated, saveFCMToken);

module.exports = authRouter;