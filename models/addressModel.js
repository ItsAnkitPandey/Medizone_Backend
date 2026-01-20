import mongoose, { Schema } from "mongoose";

const addressSchema =  new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true
      },
      street: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      state: {
        type: String,
        required: true,
        trim: true
      },
      phoneNumber:{
        type:String,
        required:true,
        trim: true
      },
      postalCode: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        required: true,
        enum: ['Home', 'Work'],
        default: 'Home'
      },
}, {
    timestamps: true,
    versionKey: false
});

export const Address = mongoose.model('Address', addressSchema);