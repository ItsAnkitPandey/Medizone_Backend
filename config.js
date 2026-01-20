// Load environment variables if dotenv is configured
// To use: npm install dotenv, then add: import dotenv from 'dotenv'; dotenv.config();

export const PORT = process.env.PORT || 5555;
export const MongoDbUrl = process.env.MONGODB_URI || 'mongodb+srv://medizoneadmin:Medi%40123@medizone.nago4u4.mongodb.net/Medizone?retryWrites=true&w=majority';

// It's highly recommended to use environment variables for secrets.
export const JWT_SECRET = process.env.JWT_SECRET || "medi$zone";

// Email configuration
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

// Frontend URL for password reset links
export const FRONTEND_URL = process.env.FRONTEND_URL || 'https://medzon.netlify.app';