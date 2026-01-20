import mongoose, { Schema } from "mongoose";

// Sub-schema for items in the order to ensure data consistency
const orderItemSchema = new Schema({
    medicine: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: { // Price of the item at the time of order
        type: Number,
        required: true
    }
}, { _id: false }); // _id is not needed for subdocuments in an array

const OrderModel = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true // Indexing user field is good for query performance
    },
    // Renamed from 'item' to 'items' for clarity
    items: {
        type: [orderItemSchema],
        required: true
    },
    // Changed from a Mixed type to a structured object for data integrity.
    // This stores a snapshot of the address used for the order.
    shippingAddress: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        phoneNumber: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true }
    },
    status: {
        type: String,
        enum: ['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMode: {
        type: String,
        enum: ['COD', 'UPI', 'CARD'],
        required: true
    },
    totalAmount: { // Renamed from 'total' for clarity
        type: Number,
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
}, {
    timestamps: true, // Replaces manual createdAt and adds updatedAt
    versionKey: false
});

export const Order = mongoose.model('Order', OrderModel);