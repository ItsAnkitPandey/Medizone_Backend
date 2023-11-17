import express from 'express';
import { Medicine } from '../models/medicineModel.js'

const router = express.Router();

//Route:1 for create a medicine
router.post('/create', async (req, res) => {
    try {
        if (
            !req.body.name ||
            !req.body.imgUrl ||
            !req.body.price
        ) {
            return res.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            })
        }
        const newMedicine = {
            name: req.body.name,
            imgUrl: req.body.imgUrl,
            price: req.body.price,
            description: req.body.description,
            inStocks: req.body.inStocks
        }

        const medicine = await Medicine.create(newMedicine);

        return res.status(200).send(medicine);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: error.message })
    }
});

//Route:2 for edit a medicine
router.put('/edit/:id', async (req, res) => {
    try {
        if (
            !req.body.name ||
            !req.body.imgUrl ||
            !req.body.price
        ) {
            return res.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            })
        }

        const { id } = req.params;
        const result = await Medicine.findByIdAndUpdate(id, req.body);

        if (!result) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        return res.status(200).send({ message: 'Medicine Updated Successfully' })
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ message: error.message })
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
        return res.status(200).json({ message: 'Book Deleted Successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
})

//Route:4 for get all medicines
router.get('/', async (req, res) => {
    try {
        const medicines = await Medicine.find({});
        return res.status(200).json({
            totalMedicines: medicines.length,
            data: medicines
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
})

//route:5 for get the details og medicine by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id);
        return res.status(200).json(medicine);
    } catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }
})

export default router;