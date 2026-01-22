import express from 'express';
import { Category } from '../models/categoryModel.js';
import { Medicine } from '../models/medicineModel.js';

const router = express.Router();

// ROUTE 1: Get all categories - GET "/api/categories"
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        
        // Get medicine count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const count = await Medicine.countDocuments({ category: category._id });
                return {
                    _id: category._id,
                    name: category.name,
                    imgUrl: category.imgUrl,
                    medicineCount: count,
                    createdAt: category.createdAt
                };
            })
        );

        res.json({
            success: true,
            total: categoriesWithCount.length,
            categories: categoriesWithCount
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
});

// ROUTE 2: Get category by ID - GET "/api/categories/:id"
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }

        // Get medicine count
        const medicineCount = await Medicine.countDocuments({ category: id });

        res.json({
            success: true,
            category: {
                ...category.toObject(),
                medicineCount
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
});

// ROUTE 3: Get medicines by category - GET "/api/categories/:id/medicines"
router.get('/:id/medicines', async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        // Check if category exists
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            });
        }

        const pageSize = parseInt(limit);
        const skip = (parseInt(page) - 1) * pageSize;

        const medicines = await Medicine.find({ category: id })
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(skip);

        const total = await Medicine.countDocuments({ category: id });

        res.json({
            success: true,
            category: category.name,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / pageSize),
            medicines
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
});

export default router;
