const User = require('../models/user');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = require('../utils/config');
const sendPushNotification = require("../utils/pushNotification");

const saveFCMToken = async (req, res) => {
    try {
        const userId = req.userId; 
        const { token } = req.body;

        await User.findByIdAndUpdate(userId, {
            fcmToken: token
        });

        res.json({ success: true });

    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: error.message });
    }
};


const authController = {
    register: async (req, res) => {
        try {
            // get the details from the request body
            const { name, email, password } = req.body;

            // check if the user exists already
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // encrypt the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // create a new user
            const newUser = new User({ name, email, password: hashedPassword });

            // save the user to the database
            await newUser.save();

            // send an email to the user
             await sendEmail(email, 'Welcome to our app', 'Thank you for registering!');

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // find the user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'Email does not exist' });
            }

            // compare the password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            // generate a JWT token
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '3h' });

            // set the token as a cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            })

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                
                }
            });    
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    },
    getMe: async (req, res) => {
        try {
            // get the user ID
            const userId = req.userId;

            // find the user by ID
            // const user = await User.findById(userId).select('-password').populate('assignedCompany', 'name');
            const user = await User.findById(userId).select('-password');

            // if the user does not exist, return an error
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // return the user details
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user details', error: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token', {
                secure: NODE_ENV === 'production',
                sameSite: NODE_ENV === 'production' ? 'none' : 'lax'
            });

            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error logging out', error: error.message });
        }
    }
};

module.exports = { saveFCMToken, ...authController };