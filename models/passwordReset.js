import mongoose, { Schema } from "mongoose";

const passwordResetTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // MongoDB will automatically delete this document after 15 minutes
        expires: '15m'
    }
}, { versionKey: false });

export const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);