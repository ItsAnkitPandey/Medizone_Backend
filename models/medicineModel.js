import mongoose from "mongoose";

const medicineModel = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    imgUrl: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    description: {
        type: String
    }
},
    {
        timestamps: true,
    }
)

export const Medicine = mongoose.model('Medicines', medicineModel);