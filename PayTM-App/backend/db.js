import mongoose from 'mongoose';
const { Schema } = mongoose;

mongoose.connect('mongodb+srv://admin:mrtiyunjay@cluster0.bkylxm6.mongodb.net/');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    }, 
    last_name: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: String
    }, 
    amount: {
        type: Number
    }
})