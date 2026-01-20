import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    medicine: {
        type: Schema.Types.ObjectId,
        ref: "Medicine",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: [1, 'Quantity must be at least 1.']
    }
}, {
    timestamps: true,
    versionKey: false
});

// Create a compound index to ensure a user can only have one cart entry per medicine.
// This prevents creating multiple documents for the same user and medicine.
cartSchema.index({ user: 1, medicine: 1 }, { unique: true });

export const Cart = mongoose.model('Cart', cartSchema);