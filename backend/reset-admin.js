import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
        admin.password = 'admin123';
        await admin.save();
        console.log('RESET ADMIN:', admin.email);
    } else {
        console.log('NO ADMIN FOUND');
    }
    process.exit(0);
}
run();
