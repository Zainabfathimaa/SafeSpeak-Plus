/**
 * ===================================
 * USER MODEL (models/User.js)
 * ===================================
 * 
 * PURPOSE:
 * Defines the structure of a User in the database
 * Like a blueprint for every user document
 * 
 * ANALOGY:
 * Schema = Instructions for building a house
 * Model = The actual builder/contractor
 * Document = The completed house
 * 
 * WHAT THIS FILE DOES:
 * 1. Imports mongoose
 * 2. Defines what fields a user must have
 * 3. Adds validation rules
 * 4. Creates database model
 * 5. Exports model for use in routes
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

/**
 * User Schema Definition
 * 
 * This defines the structure of each user document in MongoDB
 * 
 * FIELD EXPLANATIONS:
 * - email: User's email address (must be unique)
 * - password: Encrypted password (NEVER store plain text!)
 * - anonymousCode: Special code like 'A7X-992-B4Q' for anonymous login
 * - fullName: User's real name (optional)
 * - department: College/work department (optional)
 * - phone: Phone number (optional)
 * - role: User role ('user' or 'admin')
 * - isEmailVerified: Has user verified their email?
 * - lastLogin: When did they last login?
 * - createdAt: Automatic timestamp when created
 * - updatedAt: Automatic timestamp when last updated
 */

const userSchema = new mongoose.Schema({
  
  // EMAIL FIELD
  email: {
    type: String,
    required: [true, 'Please provide an email'],           // Must provide email
    unique: true,                                           // No duplicate emails
    lowercase: true,                                        // Convert to lowercase
    trim: true,                                             // Remove whitespace
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,                        // Simple email validation
      'Please provide a valid email address'
    ]
  },

  // PASSWORD FIELD
  password: {
    type: String,
    required: [true, 'Please provide a password'],          // Must provide password
    minlength: [6, 'Password must be at least 6 characters'], // Minimum 6 characters
    select: false                                           // Don't return password by default in queries
  },

  // ANONYMOUS CODE FIELD
  anonymousCode: {
    type: String,
    unique: true,                                           // Each code is unique
    sparse: true,                                           // Allow multiple null values
    uppercase: true,                                        // Convert to uppercase
    default: null
    // Format will be: ABC-123-DEF (generated in controller)
  },

  // FULL NAME FIELD (Optional)
  fullName: {
    type: String,
    trim: true,
    default: null
  },

  // DEPARTMENT FIELD (Optional)
  // Examples: "Engineering", "Sales", "HR", "First Year"
  department: {
    type: String,
    trim: true,
    default: null
  },

  // PHONE NUMBER FIELD (Optional)
  phone: {
    type: String,
    default: null,
    match: [
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please provide a valid phone number'
    ]
  },

  // USER ROLE FIELD
  // Allows different permission levels
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],                 // Only these values allowed
    default: 'user'
  },

  // EMAIL VERIFICATION STATUS
  isEmailVerified: {
    type: Boolean,
    default: false
    // Set to true when user clicks verification link
  },

  // VERIFICATION TOKEN (for email verification)
  // Sent to user's email, they click link with this token
  verificationToken: {
    type: String,
    default: null,
    select: false                                          // Don't return by default
  },

  // VERIFICATION TOKEN EXPIRY (expires in 24 hours)
  verificationTokenExpiry: {
    type: Date,
    default: null,
    select: false
    // Token valid for 24 hours from creation
  },

  // GMAIL CREDENTIALS (for sending verification email)
  gmailAddress: {
    type: String,
    default: null,
    select: false                                          // Don't return by default
  },

  gmailPassword: {
    type: String,
    default: null,
    select: false                                          // Don't return by default
  },

  lastLogin: {
    type: Date,
    default: null
  },

  // ACCOUNT STATUS
  isActive: {
    type: Boolean,
    default: true
    // Can be set to false to deactivate accounts
  }

}, { 
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true 
});

/**
 * ===================================
 * MONGOOSE MIDDLEWARE (HOOKS)
 * ===================================
 * 
 * These are functions that run at specific times
 * 
 * 'pre' hook: Runs BEFORE the action
 * 'post' hook: Runs AFTER the action
 * 
 * Common hooks: 'save', 'findByIdAndUpdate', 'remove'
 */

/**
 * PRE-SAVE HOOK: Encrypt password before saving to database
 * 
 * WHEN: Before saving user to database
 * WHAT: Encrypts plain password to hash
 * WHY: Never store plain passwords! Security best practice
 * 
 * FLOW:
 * User clicks "Register" with password "MyPassword123"
 * → Password sent to backend
 * → This hook runs
 * → Password encrypted to: $2b$10$encrypted_hash_here
 * → Encrypted password saved to database
 * → Original password never stored
 * 
 * BCRYPT EXPLANATION:
 * - One-way encryption (can't decrypt)
 * - Each encryption is different (has random salt)
 * - Slow on purpose (slows down attackers)
 * - Industry standard for password hashing
 */
userSchema.pre('save', async function(next) {
  // Skip if password hasn't been modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt (random data to mix with password)
    // 10 rounds = good balance between security and speed
    const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPT_ROUNDS || 10));
    
    // Hash the password with the salt
    // this.password = the new password user entered
    // salt = random string to mix with password
    this.password = await bcryptjs.hash(this.password, salt);
    
    // Continue to next middleware
    next();

  } catch (error) {
    next(error);
  }
});

/**
 * METHOD: comparePassword
 * 
 * Compares a plain password with encrypted password in database
 * 
 * USAGE: Used during login to verify password is correct
 * 
 * EXAMPLE:
 * user = await User.findOne({ email: 'test@college.edu' });
 * const isMatch = await user.comparePassword('PasswordUserEntered');
 * if (isMatch) {
 *   // Passwords match! User can login
 * }
 * 
 * HOW BCRYPT COMPARE WORKS:
 * 1. Takes plain password: "MyPassword123"
 * 2. Takes encrypted hash from database: "$2b$10$..."
 * 3. Applies same encryption to plain password
 * 4. Compares the two encrypted values
 * 5. Returns true if they match
 * 
 * WHY THIS WORKS:
 * Bcrypt is designed so:
 * encrypt("MyPassword123", salt1) ≠ encrypt("MyPassword123", salt2)
 * BUT bcrypt.compare("MyPassword123", hashedValue) = true
 */
userSchema.methods.comparePassword = async function(plainPassword) {
  // bcryptjs.compare(plainPassword, hashedPassword)
  // Returns true if passwords match, false if they don't
  return await bcryptjs.compare(plainPassword, this.password);
};

/**
 * METHOD: generateAnonymousCode
 * 
 * Generates a unique anonymous code like "A7X-992-B4Q"
 * 
 * FORMAT: ABC-123-DEF
 * - A-Z letters: 6 characters
 * - 0-9 numbers: 3 characters
 * - Separated by hyphens
 * 
 * USAGE:
 * const user = new User({ email: 'test@college.edu', password: 'pass' });
 * user.anonymousCode = user.generateAnonymousCode();
 * await user.save();
 */
userSchema.methods.generateAnonymousCode = function() {
  // Character sets for random selection
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  // Generate random selections
  const part1 = Array(3).fill(null).map(() => 
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('');
  
  const part2 = Array(3).fill(null).map(() => 
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  ).join('');
  
  const part3 = Array(3).fill(null).map(() => 
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('');
  
  return `${part1}-${part2}-${part3}`;
};

/**
 * Create and export User model
 * 
 * WHAT DOES THIS DO?
 * mongoose.model('User', userSchema)
 * - Takes the schema we defined above
 * - Creates a model from it
 * - Model can create, read, update, delete documents
 * - First parameter: Model name (capitalized)
 * - Second parameter: Schema to use
 * 
 * WHAT CAN WE DO WITH MODEL?
 * const User = model('User', userSchema);
 * 
 * await User.create({ email, password })           // Create new user
 * await User.findOne({ email })                    // Find user by email
 * await User.findById(id)                          // Find user by ID
 * await User.findByIdAndUpdate(id, { name: '' })  // Update user
 * await User.deleteOne({ email })                 // Delete user
 */
const User = mongoose.model('User', userSchema);

export default User;

/**
 * ===================================
 * QUICK REFERENCE
 * ===================================
 * 
 * Schema Field Options:
 * type: String        - Data type
 * required: true      - Must be provided
 * unique: true        - No duplicates
 * default: value      - Default value if not provided
 * trim: true          - Remove whitespace
 * lowercase: true     - Convert to lowercase
 * enum: [...]         - Only allow specific values
 * minlength: 6        - Minimum characters
 * match: /regex/      - Must match regex pattern
 * select: false       - Don't return in queries
 * timestamps: true    - Add createdAt, updatedAt
 * 
 * Pre-save hook execution:
 * User input → Validation → Pre-save hook → Database save → Done
 * 
 * Password Storage:
 * Plain: "MyPassword123"
 * Encrypted: "$2b$10$nOUIs5kJ7naTuTFkBy1I.e2yO2hO5asvVmWDzmVQXXbVxWis2qK4m"
 * Compare: bcryptjs.compare("MyPassword123", encrypted_password)
 * Result: true (matches)
 * 
 * Timestamps:
 * createdAt: When document first created
 * updatedAt: When document last modified
 * Automatically managed by Mongoose
 */
