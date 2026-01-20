# Quick Start Guide - Medizone Backend

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd MedizoneBackend/medizone_backend
npm install
```

### Step 2: Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:5555`

### Step 3: Test It!
Open your browser or API client and visit:
```
http://localhost:5555
```
You should see: "Medizone Backend is running."

---

## 📋 What's Working Now

✅ **User Authentication**
- Signup new users
- Login existing users  
- Profile management
- Password reset via email

✅ **Order Management**
- Create orders from cart
- View order history
- Cancel orders
- Track order status

✅ **Security**
- JWT token authentication
- Password hashing
- Protected routes
- CORS configuration

---

## 🔧 Optional: Environment Variables

For production or to customize settings, create a `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

Then install dotenv:
```bash
npm install dotenv
```

And add to `index.js` (top of file):
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

---

## 🧪 Test the API

### Test Login
```bash
curl -X POST http://localhost:5555/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test with Frontend
1. Start backend: `npm run dev` (port 5555)
2. Start frontend: `cd medizone && npm start` (port 3000)
3. Open browser: `http://localhost:3000`
4. Try logging in or creating an account

---

## 📚 More Information

- **Full API Documentation**: See `API_DOCUMENTATION.md`
- **Changes Made**: See `BACKEND_CHANGES.md`
- **Environment Setup**: See `.env.example`

---

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5555
lsof -ti:5555 | xargs kill -9

# Or change port in config.js
export const PORT = 5556;
```

### Database Connection Error
- Check your internet connection
- Verify MONGODB_URI in config.js
- Ensure MongoDB cluster is accessible

### CORS Error from Frontend
- Make sure backend is running on port 5555
- Check frontend is on port 3000 or update CORS in index.js
- Clear browser cache

### Email Not Sending (Password Reset)
- Set EMAIL_USER and EMAIL_PASS in .env
- Use Gmail App Password, not regular password
- Enable "Less secure app access" or use App Passwords

---

## 🎯 Next Steps

1. ✅ Backend is ready to use with the frontend
2. 📱 Test all features: signup, login, add to cart, checkout
3. 🔐 For production: Set up environment variables
4. 📧 Configure email for password reset
5. 🚀 Deploy to Render, Heroku, or your preferred platform

---

**Need Help?** Check the documentation files or test the API endpoints using Postman/Thunder Client.
