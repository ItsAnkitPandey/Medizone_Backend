import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true
    },
    otp:{
        type:String,
        required:true,
        trim: true
    },
    // This field will be used for a TTL index.
    // MongoDB will automatically delete documents after 5 minutes (300 seconds).
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5 minutes in seconds
    },
}, {
    versionKey: false
});

export const OTP = mongoose.model('OTP', otpSchema);