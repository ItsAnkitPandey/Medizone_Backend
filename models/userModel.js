import mongoose from 'mongoose';

const UserModel = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
},
    {
        timestamps: true,
    }
);

export const User = mongoose.model('Users', UserModel);