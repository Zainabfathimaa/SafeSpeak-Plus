import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        // Exclude passwords
        const users = await User.find({})
            .select('-password -verificationToken -verificationTokenExpiry')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Failed to get all users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

export default { getAllUsers };
