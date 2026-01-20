# Medizone Backend API

Backend API for the Medizone e-commerce platform for medicines and healthcare products.

## Recent Updates

The backend has been updated to fully support the frontend application with the following improvements:

### Authentication & User Management
- ✅ **Login** - Returns both `token` and `user` object (id, name, email, isAdmin)
- ✅ **Signup** - Returns token and user data
- ✅ **Get Profile** - `GET /user/profile` - Get user profile details
- ✅ **Update Profile** - `PUT /user/profile` - Update user name/email
- ✅ **Change Password** - `PUT /user/change-password` - Change user password
- ✅ **Verify Token** - `GET /user/verify-token` - Verify JWT token validity
- ✅ **Forgot Password** - Password reset via email with secure token

### Order Management
- ✅ **Create Order** - `POST /orders` or `POST /order/create` - Create new order
- ✅ **Get Orders** - `GET /orders` or `GET /order/history` - Get user's order history
- ✅ **Get Order by ID** - `GET /orders/:id` - Get specific order details
- ✅ **Cancel Order** - `PUT /orders/:id/cancel` - Cancel a pending order

### Security & Configuration
- ✅ **CORS** - Configured for frontend domains (localhost & netlify)
- ✅ **Environment Variables** - Support for .env configuration
- ✅ **Error Handling** - Improved error responses
- ✅ **Token Expiration** - 1-hour JWT token expiration

## API Endpoints

### Authentication Routes (`/user`)

#### Signup
```
POST /user/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "token": "jwt-token",
  "user": { "id", "name", "email" }
}
```

#### Login
```
POST /user/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "token": "jwt-token",
  "user": { "id", "name", "email", "isAdmin" }
}
```

#### Get Profile
```
GET /user/profile
Headers: Authorization: Bearer <token>
Response: {
  "id", "name", "email", "isAdmin", "isVerified", "createdAt"
}
```

#### Update Profile
```
PUT /user/profile
Headers: Authorization: Bearer <token>
Body: {
  "name": "New Name",
  "email": "newemail@example.com"
}
```

#### Change Password
```
PUT /user/change-password
Headers: Authorization: Bearer <token>
Body: {
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

#### Verify Token
```
GET /user/verify-token
Headers: Authorization: Bearer <token>
Response: {
  "valid": true,
  "user": { "id", "name", "email", "isAdmin" }
}
```

### Order Routes (`/order` or `/orders`)

#### Create Order
```
POST /orders
Headers: Authorization: Bearer <token>
Body: {
  "items": [
    {
      "id": "medicine-id",
      "name": "Medicine Name",
      "price": 100,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India",
    "phoneNumber": "+91-9876543210"
  },
  "paymentMode": "COD",
  "totalAmount": 236
}
Response: {
  "success": true,
  "message": "Order created successfully",
  "order": { order details }
}
```

#### Get Order History
```
GET /orders
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "count": 5,
  "orders": [ array of orders ]
}
```

#### Get Order by ID
```
GET /orders/:id
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "order": { order details }
}
```

#### Cancel Order
```
PUT /orders/:id/cancel
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "message": "Order cancelled successfully"
}
```

### Password Reset Routes (`/password`)

#### Request Password Reset
```
POST /password/request-password-reset
Body: {
  "email": "user@example.com"
}
```

#### Reset Password
```
POST /password/reset-password/:userId/:token
Body: {
  "password": "newpassword"
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd MedizoneBackend/medizone_backend
npm install
```

### 2. Environment Variables (Optional but Recommended)

Install dotenv:
```bash
npm install dotenv
```

Create `.env` file (use `.env.example` as template):
```env
PORT=5555
NODE_ENV=development
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=https://medzon.netlify.app
```

Add to top of `index.js`:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

### 3. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Database Models

### User Model
- name, email, password
- isAdmin, isVerified
- timestamps

### Order Model
- user (reference to User)
- items[] (medicine, quantity, price)
- shippingAddress (street, city, state, postalCode, country, phoneNumber)
- status (Pending, Dispatched, Out for delivery, Delivered, Cancelled)
- paymentMode (COD, UPI, CARD)
- totalAmount
- timestamps

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Token expiration (1 hour)
- Secure password reset with time-limited tokens
- CORS protection
- Input validation with express-validator
- User-specific data access control

## Frontend Integration

The backend is configured to work with:
- Local development: `http://localhost:3000`
- Production: `https://medzon.netlify.app`, `https://medizone.netlify.app`

## Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "errors": [ array of validation errors ]
}
```

Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Testing

Test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands

Example curl:
```bash
# Login
curl -X POST http://localhost:5555/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile
curl -X GET http://localhost:5555/user/profile \
  -H "Authorization: Bearer your-token-here"
```

## Notes

- Orders require authentication (JWT token in Authorization header)
- Medicine IDs in orders should reference valid medicine documents
- Cart functionality is client-side only; orders are server-side
- Payment processing integration is pending (currently supports COD only)
