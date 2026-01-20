# Database Seeding Instructions

## How to Populate MongoDB with Medicine Data

### Prerequisites
- MongoDB must be running
- Backend dependencies installed (`npm install`)
- `.env` file configured with `MONGO_URI`

### Steps to Seed Database

1. **Navigate to backend directory:**
   ```bash
   cd MedizoneBackend/medizone_backend
   ```

2. **Run the seed script:**
   ```bash
   node seedData.js
   ```

### What the Script Does

The seed script will:
- ✅ Connect to your MongoDB database
- ✅ Clear existing medicines and categories (to avoid duplicates)
- ✅ Insert 8 medicine categories
- ✅ Insert 28 medicines with proper stock quantities and pricing
- ✅ Display a summary of inserted data

### Expected Output

```
✅ MongoDB Connected Successfully
🗑️  Clearing existing data...
✅ Existing data cleared

📝 Inserting categories...
✅ 8 categories inserted

💊 Inserting medicines...
✅ 28 medicines inserted

📊 Seeding Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Categories: 8
✓ Medicines: 28
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Database seeding completed successfully!
```

### Categories Inserted

1. Headache & Pain
2. Cold & Flu
3. Acidity & Digestion
4. Cough & Throat
5. Allergy
6. Skin Care
7. Liver Care
8. General Medicine

### After Seeding

Once seeding is complete:
1. Start the backend server: `npm run start`
2. Start the frontend: `npm start` (in medizone folder)
3. Navigate to `/allmedicines` to see medicines loaded from database

### Troubleshooting

**Connection Error:**
- Check if MongoDB is running
- Verify `MONGO_URI` in `.env` file

**Duplicate Key Error:**
- Run the script again (it clears existing data first)

**Image Paths:**
- Images are referenced as `/images/filename.ext`
- Ensure images are in `medizone/public/images/` folder
- Or update `imgUrl` paths in `seedData.js` to match your setup

### Re-running the Script

You can safely run the script multiple times. It will:
- Clear all existing medicines and categories
- Re-insert fresh data
- Maintain data consistency

### Notes

- All medicines have stock quantities (30-300 units)
- Prices range from ₹6 to ₹200
- Some medicines have discount percentages (0-20%)
- All medicines are linked to appropriate categories
