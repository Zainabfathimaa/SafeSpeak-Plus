import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('\n🔍 Email Configuration Check:\n');
console.log('SMTP_SERVICE:', process.env.SMTP_SERVICE);
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✓ Set' : '✗ NOT SET');

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

console.log('\n⏳ Testing connection...\n');

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email Connection Failed:');
    console.log('Error:', error.message);
    console.log('\nFix: Check your Gmail credentials in .env');
    process.exit(1);
  } else {
    console.log('✅ Email Connection Successful!');
    console.log('\n🎉 Anyone can now register and get verification emails!\n');
    process.exit(0);
  }
});
