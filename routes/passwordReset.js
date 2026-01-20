import express from 'express';
import { User } from '../models/userModel.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { JWT_SECRET, EMAIL_USER, EMAIL_PASS, FRONTEND_URL } from '../config.js';

const router = express.Router();

// ROUTE 1: Request a password reset link.
// @route   POST /password/request-password-reset
// @desc    Send a password reset link to the user's email
// @access  Public
router.post('/request-password-reset', [
    body('email', 'Please enter a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // To prevent user enumeration attacks, we send a generic success message
            // whether the user exists or not. This is a security best practice.
            return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
        }

        // Create a one-time link that is valid for 15 minutes.
        // The secret includes the user's current password hash, so the link is invalidated if the password changes.
        const resetSecret = JWT_SECRET + user.password;
        const payload = {
            email: user.email,
            id: user._id
        };
        const token = jwt.sign(payload, resetSecret, { expiresIn: '15m' });

        // The link will contain both the user ID and the token for verification.
        const resetLink = `${FRONTEND_URL}/reset-password/${user._id}/${token}`;

       
        const transporter = nodemailer.createTransport({
            
            service: 'gmail',  //we can edit it like gmail, yahoo or hotmail.
            auth: {
                user: EMAIL_USER || process.env.EMAIL_USER, 
                pass: EMAIL_PASS || process.env.EMAIL_PASS  
            }
        });

        const mailOptions = {
            from: `Medizone <${EMAIL_USER || process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request for Medizone',
            html: `<p>Hi ${user.name},</p>
                   <p>You requested a password reset. Click the link below to reset your password. This link is valid for 15 minutes.</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>If you did not request this, please ignore this email.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });

    } catch (error) {
        console.error("Error in /request-password-reset:", error.message);
        // Avoid sending detailed error messages to the client in production
        res.status(500).send('Internal Server Error');
    }
});

// ROUTE 2: Reset the password using the link.
// @route   POST /password/reset-password/:userId/:token
// @desc    Reset the user's password
// @access  Public
router.post('/reset-password/:userId/:token', [
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid link or user does not exist." });
        }

        // We use the same user-specific secret to verify the token.
        const resetSecret = JWT_SECRET + user.password;

        try {
            // Verify the token. If it's invalid or expired, it will throw an error.
            jwt.verify(token, resetSecret);

            // If verification is successful, hash the new password
            const salt = await bcrypt.genSalt(10);
            const newSecPass = await bcrypt.hash(password, salt);

            // Update user's password in the database
            user.password = newSecPass;
            await user.save();

            res.status(200).json({ message: "Password has been reset successfully." });

        } catch (error) {
            // This will catch JWT errors like 'TokenExpiredError' or 'JsonWebTokenError'
            console.error("Error verifying reset token:", error.message);
            return res.status(400).json({ message: "Invalid or expired password reset link." });
        }

    } catch (error) {
        console.error("Error in /reset-password:", error.message);
        res.status(500).send('Internal Server Error');
    }
});

export default router;