import mongoose, { Schema } from "mongoose";

const medicineModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: [0, 'Discount percentage cannot be negative'],
        max: [100, 'Discount percentage cannot be more than 100']
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: [0, 'Stock quantity cannot be negative'],
        default: 0
    },
    imgUrl: {
        type: String,
        required: true
    },
},
    { timestamps: true, versionKey: false });

export const Medicine = mongoose.model('Medicine', medicineModel);