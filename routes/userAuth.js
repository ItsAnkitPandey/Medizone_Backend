import express from 'express'
import { User } from '../models/userModel.js'
import { body, validationResult } from 'express-validator'
import fetchUser from '../middleware/fetchuser.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Route for creating a new user
router.post('/signup', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'Password must atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    // if there are errors, return Bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let success = false;
        //check whether the user with same email is already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Sorry user already exists." })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create a new user
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: secPass
        }
        user = await User.create(newUser);

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET, {expiresIn: '1h'});
        success = true;
        return res.status(201).send({
            success, 
            token: authtoken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error.messge);
        return res.status(500).send({ message: error.message })
    }
})

//Route for login an user
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            success = false;
            return res.status(404).json({success, message: 'User not found'});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false;
            return res.status(401).json({success, message: 'Wrong Password! Access Denied'})
        }
        const data = {
            user: {
               id: user.id
            }
         }
         const authtoken = jwt.sign(data, JWT_SECRET, {expiresIn: '1h'});
         success = true;
         // Return token and user data as expected by frontend
         return res.status(200).send({
             success, 
             token: authtoken,
             user: {
                 id: user._id,
                 name: user.name,
                 email: user.email,
                 isAdmin: user.isAdmin
             }
         });
         
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
    }
})


 router.post('/getUser', fetchUser, async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.error);
        res.status(500).send('Internal server error');
    }
 })

// ROUTE: Get user profile - GET "/user/profile". Login required.
router.get('/profile', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ROUTE: Update user profile - PUT "/user/profile". Login required.
router.put('/profile', fetchUser, [
    body('name').optional().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('email').optional().isEmail().withMessage('Enter a valid email')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        const updateData = {};

        if (req.body.name) updateData.name = req.body.name;
        if (req.body.email) {
            // Check if email already exists for another user
            const existingUser = await User.findOne({ email: req.body.email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            updateData.email = req.body.email;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ROUTE: Change password - PUT "/user/change-password". Login required.
router.put('/change-password', fetchUser, [
    body('currentPassword').exists().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 5 }).withMessage('New password must be at least 5 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ROUTE: Verify token - GET "/user/verify-token". Login required.
router.get('/verify-token', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ valid: false, message: 'User not found' });
        }
        res.json({ 
            valid: true, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
});

// ROUTE: Forgot password - POST "/user/forgot-password". Public.
router.post('/forgot-password', [
    body('email', 'Enter a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Forward to password reset route
    try {
        // This is a stub - actual implementation should be in passwordReset.js
        res.status(200).json({ 
            message: 'Password reset link sent to your email',
            note: 'Please check password reset route implementation'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ROUTE: Google OAuth Login/Signup - POST "/user/google-auth". Public.
router.post('/google-auth', async (req, res) => {
    try {
        const { credential } = req.body;

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log(payload);
        const { email, name, picture, sub: googleId } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user with Google data
            user = await User.create({
                name,
                email,
                password: await bcrypt.hash(googleId, 10), // Use Google ID as password hash
                profileImage: picture,
                googleId
            });
        } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = googleId;
            user.profileImage = picture || user.profileImage;
            await user.save();
        }

        // Generate JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            token: authtoken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Google authentication failed' 
        });
    }
});


export default router;