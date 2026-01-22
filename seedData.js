/**
 * Database Seeding Script
 * Run this script to populate MongoDB with initial medicine and category data
 * Usage: node seedData.js
 */

import mongoose from 'mongoose';
import { Medicine } from './models/medicineModel.js';
import { Category } from './models/categoryModel.js';
import { MongoDbUrl } from './config.js';

// Database connection
const connectDB = async () => {
    try {
        const mongoURI = MongoDbUrl;
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Categories data
const categories = [
    { name: 'Headache & Pain', imgUrl: '/images/PersonalCare.jpg' },
    { name: 'Cold & Flu', imgUrl: '/images/CovidEssentials.jpg' },
    { name: 'Acidity & Digestion', imgUrl: '/images/Devices.jpg' },
    { name: 'Cough & Throat', imgUrl: '/images/BabyCare.jpeg' },
    { name: 'Allergy', imgUrl: '/images/PersonalCare.jpg' },
    { name: 'Skin Care', imgUrl: '/images/PersonalCare.jpg' },
    { name: 'Liver Care', imgUrl: '/images/Devices.jpg' },
    { name: 'General Medicine', imgUrl: '/images/Prescription.jpg' }
];

// Medicines data (mapped from frontend Products.js)
const getMedicinesData = (categoryMap) => [
    {
        title: 'Crocine',
        description: 'Effective relief for headache and fever. Contains paracetamol for quick pain relief.',
        price: 30,
        stockQuantity: 100,
        imgUrl: '/images/crocine.webp',
        category: categoryMap['Headache & Pain'],
        discountPercentage: 0
    },
    {
        title: 'Aciloc',
        description: 'Treatment for acidity and heartburn. Provides long-lasting relief from gastric issues.',
        price: 40,
        stockQuantity: 80,
        imgUrl: '/images/aciloc.webp',
        category: categoryMap['Acidity & Digestion'],
        discountPercentage: 5
    },
    {
        title: 'Calpol',
        description: 'Trusted medicine for headache and body pain relief. Safe and effective.',
        price: 13,
        stockQuantity: 150,
        imgUrl: '/images/calpol.jpg',
        category: categoryMap['Headache & Pain'],
        discountPercentage: 0
    },
    {
        title: 'Vicks Action 500',
        description: 'Fast relief from cold and cough symptoms. Complete cold care solution.',
        price: 59,
        stockQuantity: 90,
        imgUrl: '/images/vicks.jpg',
        category: categoryMap['Cold & Flu'],
        discountPercentage: 10
    },
    {
        title: 'Disprin',
        description: 'Quick dissolving pain reliever for headaches and body aches.',
        price: 14,
        stockQuantity: 120,
        imgUrl: '/images/disprin.jpg',
        category: categoryMap['Headache & Pain'],
        discountPercentage: 0
    },
    {
        title: 'Metrogyl',
        description: 'Effective treatment for loose motion and intestinal infections.',
        price: 21,
        stockQuantity: 70,
        imgUrl: '/images/metrogyl.jpg',
        category: categoryMap['Acidity & Digestion'],
        discountPercentage: 0
    },
    {
        title: 'Omee',
        description: 'Advanced acidity treatment for long-lasting relief from gastric problems.',
        price: 55,
        stockQuantity: 60,
        imgUrl: '/images/omee.webp',
        category: categoryMap['Acidity & Digestion'],
        discountPercentage: 8
    },
    {
        title: 'Liv 52',
        description: 'Ayurvedic liver care supplement for maintaining healthy liver function.',
        price: 120,
        stockQuantity: 50,
        imgUrl: '/images/liv52.webp',
        category: categoryMap['Liver Care'],
        discountPercentage: 12
    },
    {
        title: 'Pentop DSR',
        description: 'Comprehensive relief from gas and acidity problems.',
        price: 119,
        stockQuantity: 45,
        imgUrl: '/images/pentop.jpg',
        category: categoryMap['Acidity & Digestion'],
        discountPercentage: 15
    },
    {
        title: 'Corex Syrup',
        description: 'Effective cough syrup for dry and wet cough relief.',
        price: 121,
        stockQuantity: 55,
        imgUrl: '/images/corex.jpg',
        category: categoryMap['Cough & Throat'],
        discountPercentage: 10
    },
    {
        title: 'Cetirizine',
        description: 'Antihistamine for allergy relief. Effective for seasonal allergies.',
        price: 18,
        stockQuantity: 200,
        imgUrl: '/images/cetirizine.webp',
        category: categoryMap['Allergy'],
        discountPercentage: 0
    },
    {
        title: 'Paracetamol',
        description: 'General purpose pain reliever for body pain and fever.',
        price: 6,
        stockQuantity: 300,
        imgUrl: '/images/paracetamol.webp',
        category: categoryMap['Headache & Pain'],
        discountPercentage: 0
    },
    {
        title: 'Tylenol',
        description: 'Premium cold and flu relief medicine with multiple benefits.',
        price: 200,
        stockQuantity: 40,
        imgUrl: '/images/tylenol.jpg',
        category: categoryMap['Cold & Flu'],
        discountPercentage: 20
    },
    {
        title: 'Panadol',
        description: 'Trusted brand for flu and cold symptom relief.',
        price: 58,
        stockQuantity: 75,
        imgUrl: '/images/Panadol.png',
        category: categoryMap['Cold & Flu'],
        discountPercentage: 5
    },
    {
        title: 'Codral',
        description: 'Multi-symptom cold and flu relief medication.',
        price: 32,
        stockQuantity: 85,
        imgUrl: '/images/codral.jpg',
        category: categoryMap['Cold & Flu'],
        discountPercentage: 0
    },
    {
        title: 'Zeerodol',
        description: 'Strong pain relief medication for acute pain conditions.',
        price: 49,
        stockQuantity: 65,
        imgUrl: '/images/zeerodol.jpg',
        category: categoryMap['Headache & Pain'],
        discountPercentage: 5
    },
    {
        title: 'Aldigesic',
        description: 'Fast-acting pain relief for various types of pain.',
        price: 63,
        stockQuantity: 55,
        imgUrl: '/images/aldigesic.jpg',
        category: categoryMap['Headache & Pain'],
        discountPercentage: 8
    },
    {
        title: 'Combiflam',
        description: 'Combination medicine for effective pain and fever relief.',
        price: 39,
        stockQuantity: 95,
        imgUrl: '/images/combiflam.webp',
        category: categoryMap['Headache & Pain'],
        discountPercentage: 0
    },
    {
        title: 'Acnezox Gel',
        description: 'Topical gel for treating pimples and acne.',
        price: 15,
        stockQuantity: 110,
        imgUrl: '/images/acnezox.jpg',
        category: categoryMap['Skin Care'],
        discountPercentage: 0
    },
    {
        title: 'Persol Gel',
        description: 'Advanced acne treatment gel for clear skin.',
        price: 106,
        stockQuantity: 40,
        imgUrl: '/images/persol.jpg',
        category: categoryMap['Skin Care'],
        discountPercentage: 12
    },
    {
        title: 'NeoClean',
        description: 'Premium face wash for pimple-prone skin.',
        price: 135,
        stockQuantity: 35,
        imgUrl: '/images/neoclean.webp',
        category: categoryMap['Skin Care'],
        discountPercentage: 15
    },
    {
        title: 'Sidpiles',
        description: 'Ayurvedic medicine for piles treatment.',
        price: 165,
        stockQuantity: 30,
        imgUrl: '/images/sidpiles.jpg',
        category: categoryMap['General Medicine'],
        discountPercentage: 10
    },
    {
        title: 'Pilex',
        description: 'Herbal remedy for hemorrhoids and piles.',
        price: 160,
        stockQuantity: 32,
        imgUrl: '/images/pilex.jpg',
        category: categoryMap['General Medicine'],
        discountPercentage: 8
    },
    {
        title: 'Arsh Kalp',
        description: 'Natural treatment for piles and related conditions.',
        price: 108,
        stockQuantity: 45,
        imgUrl: '/images/arshkalp.jpg',
        category: categoryMap['General Medicine'],
        discountPercentage: 5
    },
    {
        title: 'Solvin Cough Syrup',
        description: 'Effective cough syrup for all types of cough.',
        price: 73,
        stockQuantity: 60,
        imgUrl: '/images/solvin.jpg',
        category: categoryMap['Cough & Throat'],
        discountPercentage: 7
    },
    {
        title: 'Benadryl Cough Syrup',
        description: 'Trusted cough syrup for quick relief from cough.',
        price: 120,
        stockQuantity: 50,
        imgUrl: '/images/benadryl.webp',
        category: categoryMap['Cough & Throat'],
        discountPercentage: 10
    },
    {
        title: 'Ashthakind Syrup',
        description: 'Ayurvedic cough syrup for natural relief.',
        price: 70.40,
        stockQuantity: 55,
        imgUrl: '/images/asthakind.jpg',
        category: categoryMap['Cough & Throat'],
        discountPercentage: 5
    },
    {
        title: 'Torex Syrup',
        description: 'Herbal cough syrup for dry and productive cough.',
        price: 78,
        stockQuantity: 65,
        imgUrl: '/images/torex.png',
        category: categoryMap['Cough & Throat'],
        discountPercentage: 8
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Medicine.deleteMany({});
        await Category.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Insert categories
        console.log('📝 Inserting categories...');
        const insertedCategories = await Category.insertMany(categories);
        console.log(`✅ ${insertedCategories.length} categories inserted\n`);

        // Create category map for easy lookup
        const categoryMap = {};
        insertedCategories.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Insert medicines
        console.log('💊 Inserting medicines...');
        const medicinesData = getMedicinesData(categoryMap);
        const insertedMedicines = await Medicine.insertMany(medicinesData);
        console.log(`✅ ${insertedMedicines.length} medicines inserted\n`);

        // Display summary
        console.log('📊 Seeding Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✓ Categories: ${insertedCategories.length}`);
        console.log(`✓ Medicines: ${insertedMedicines.length}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        console.log('✨ Database seeding completed successfully!\n');
        
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
};

// Run the seed function
connectDB()
    .then(() => seedDatabase())
    .catch((error) => {
        console.error('Fatal Error:', error);
        process.exit(1);
    });
