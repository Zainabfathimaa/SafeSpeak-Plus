/**
 * SEED SCRIPT - Create test users with different roles
 * 
 * RUN THIS ONCE:
 * node seed-roles.js
 * 
 * This creates test accounts you can login with
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';
import crypto from 'crypto';

// Generate anonymous code in format ABC-123-DEF
function generateAnonymousCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    if (i < 2) code += '-';
  }
  return code;
}

const testUsers = [
  {
    email: 'admin@safespeak.com',
    password: 'Admin@12345',
    fullName: 'Admin User',
    role: 'admin',
    isEmailVerified: true,
    anonymousCode: generateAnonymousCode()
  },
  {
    email: 'user@safespeak.com',
    password: 'User@12345',
    fullName: 'Regular User',
    role: 'user',
    isEmailVerified: true,
    anonymousCode: generateAnonymousCode()
  }
];

async function seedRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Delete existing test users
    const emails = testUsers.map(u => u.email);
    await User.deleteMany({ email: { $in: emails } });
    console.log('✓ Cleared existing test users');

    // Create new test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✓ Created ${userData.role.toUpperCase()} user: ${userData.email}`);
    }

    console.log('\n✅ Test users created successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('          LOGIN CREDENTIALS FOR TESTING');
    console.log('═══════════════════════════════════════════════════════\n');

    // Print email/password login
    console.log('EMAIL & PASSWORD LOGIN:');
    console.log('─────────────────────────');
    testUsers.forEach(u => {
      console.log(`${u.role.toUpperCase().padEnd(19)}: ${u.email.padEnd(30)} / ${u.password}`);
    });

    // Print anonymous code login
    console.log('\n\nANONYMOUS CODE LOGIN:');
    console.log('────────────────────');
    testUsers.forEach(u => {
      console.log(`${u.role.toUpperCase().padEnd(19)}: ${u.anonymousCode}`);
    });

    console.log('\n═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedRoles();
