import express from 'express';
import { Medicine } from '../models/medicineModel.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

//Route:1 for create a medicine
router.post('/create', [
    body('name', 'Name is required').not().isEmpty(),
    body('imgUrl', 'Image URL is required').not().isEmpty(),
    body('price', 'Price is required and must be a number').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newMedicine = {
            name: req.body.name,
            imgUrl: req.body.imgUrl,
            price: req.body.price,
            description: req.body.description,
            inStocks: req.body.inStocks
        };

        const medicine = await Medicine.create(newMedicine);

        return res.status(201).send(medicine);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
});

//Route:2 for edit a medicine
router.put('/edit/:id', [
    body('name', 'Name is required').not().isEmpty(),
    body('imgUrl', 'Image URL is required').not().isEmpty(),
    body('price', 'Price is required and must be a number').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const result = await Medicine.findByIdAndUpdate(id, req.body);

        if (!result) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        return res.status(200).send({ message: 'Medicine Updated Successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})
//Route:3 for delete a medicine
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Medicine.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Medicine Not Found' });
        }
        return res.status(200).json({ message: 'Medicine Deleted Successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
})

//Route:4 for get all medicines
router.get('/', async (req, res) => {
    try {
        const { category, search, limit, page = 1 } = req.query;
        
        // Build query
        let query = {};
        
        if (category) {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Pagination
        const pageSize = limit ? parseInt(limit) : 0;
        const skip = (parseInt(page) - 1) * pageSize;
        
        const medicines = await Medicine.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(skip);
            
        const total = await Medicine.countDocuments(query);
        
        return res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            totalPages: pageSize ? Math.ceil(total / pageSize) : 1,
            medicines
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ 
            success: false,
            message: 'Internal Server Error' 
        });
    }
})

//route:5 for get the details og medicine by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine Not Found' });
        }
        return res.status(200).json(medicine);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
})

export default router;