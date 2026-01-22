import mongoose from "mongoose";

const CategoryModel = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    imgUrl:{
        type: String,
        default: '/images/Prescription.jpg'
    }
}, {
    timestamps: true
});

export const Category = mongoose.model('Category', CategoryModel);