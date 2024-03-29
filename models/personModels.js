import mongoose, { Schema } from "mongoose";

const personSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
    }
},
    { timestamps: true }
)

export const Person = mongoose.model('Person', personSchema);