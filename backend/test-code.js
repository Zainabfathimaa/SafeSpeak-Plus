import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function getCode() {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ role: 'admin' });
    if (user) console.log('ADMIN:', user.email);
    process.exit(0);
}
getCode();
