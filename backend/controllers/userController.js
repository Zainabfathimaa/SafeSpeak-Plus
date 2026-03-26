import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

// ===================================
// GET ALL USERS (Admin only)
// ===================================
export const getAllUsers = async (req, res) => {
    try {
        // Check admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can view all users'
            });
        }

        // Exclude passwords and sensitive data
        const users = await User.find({})
            .select('-password -verificationToken -verificationTokenExpiry')
            .sort({ createdAt: -1 });

        // Mask PII for users who have NOT given identity reveal consent
        const sanitizedUsers = users.map(u => {
            const obj = u.toObject();
            if (!obj.idRevealConsent) {
                obj.fullName = 'Anonymous User';
                obj.phone = '---';
                obj.department = obj.department ? '(hidden)' : '---';
                obj.email = '***@***.***';
            }
            return obj;
        });

        res.status(200).json({
            success: true,
            count: sanitizedUsers.length,
            users: sanitizedUsers
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

// ===================================
// GET CURRENT USER PROFILE
// ===================================
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -verificationToken -verificationTokenExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// ===================================
// UPDATE USER PROFILE
// ===================================
export const updateUserProfile = async (req, res) => {
    try {
        const { fullName, phone, department } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (department) user.department = department;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// ===================================
// GET USER PREFERENCES/NOTIFICATION SETTINGS
// ===================================
export const getUserPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('notificationPreferences idRevealConsent lastReadNotificationTime appearance');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            preferences: {
                notificationPreferences: user.notificationPreferences,
                idRevealConsent: user.idRevealConsent,
                lastReadNotificationTime: user.lastReadNotificationTime,
                appearance: user.appearance
            }
        });

    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching preferences',
            error: error.message
        });
    }
};

// ===================================
// UPDATE NOTIFICATION PREFERENCES
// ===================================
export const updateNotificationPreferences = async (req, res) => {
    try {
        const { emailNotifications, inAppNotifications, preferredNotificationTime } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update preferences
        if (emailNotifications) {
            user.notificationPreferences.emailNotifications = {
                ...user.notificationPreferences.emailNotifications,
                ...emailNotifications
            };
        }

        if (inAppNotifications) {
            user.notificationPreferences.inAppNotifications = {
                ...user.notificationPreferences.inAppNotifications,
                ...inAppNotifications
            };
        }

        if (preferredNotificationTime) {
            user.notificationPreferences.preferredNotificationTime = preferredNotificationTime;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Notification preferences updated successfully',
            preferences: user.notificationPreferences
        });

    } catch (error) {
        console.error('Error updating notification preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating notification preferences',
            error: error.message
        });
    }
};

// ===================================
// REQUEST ID REVEAL CONSENT
// ===================================
export const updateIdRevealConsent = async (req, res) => {
    try {
        const { idRevealConsent } = req.body;

        if (typeof idRevealConsent !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'idRevealConsent must be a boolean'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.idRevealConsent = idRevealConsent;
        user.idRevealConsentDate = new Date();

        await user.save();

        res.status(200).json({
            success: true,
            message: idRevealConsent
                ? 'ID reveal consent granted. Admins can now see your identity for your reports.'
                : 'ID reveal consent revoked. Your reports will remain anonymous.',
            idRevealConsent: user.idRevealConsent
        });

    } catch (error) {
        console.error('Error updating ID reveal consent:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating ID reveal consent',
            error: error.message
        });
    }
};

// ===================================
// GET ID REVEAL CONSENT STATUS
// ===================================
export const getIdRevealConsentStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('idRevealConsent idRevealConsentDate email anonymousCode');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            consent: {
                idRevealConsent: user.idRevealConsent,
                idRevealConsentDate: user.idRevealConsentDate,
                displayName: user.idRevealConsent ? user.email : user.anonymousCode
            }
        });

    } catch (error) {
        console.error('Error getting ID reveal consent status:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting ID reveal consent status',
            error: error.message
        });
    }
};

// ===================================
// UPDATE APPEARANCE PREFERENCES
// ===================================
export const updateAppearancePreferences = async (req, res) => {
    try {
        const { theme } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate and update fields
        const validThemes = ['light', 'dark'];

        if (theme && validThemes.includes(theme)) {
            user.appearance.theme = theme;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Appearance preferences updated successfully',
            appearance: user.appearance
        });

    } catch (error) {
        console.error('Error updating appearance preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating appearance preferences',
            error: error.message
        });
    }
};

// ===================================
// DELETE USER ACCOUNT
// ===================================
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Precaution: Do not allow deletion of admin accounts via this route
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin accounts cannot be deleted via the user dashboard.'
            });
        }

        // Alternatively, instead of hard delete, we can soft delete or deactivate
        // But for this requirement, we'll permanently delete the user (Note conflicts with orphaned reports)
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Your account has been permanently deleted.'
        });

    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting account',
            error: error.message
        });
    }
};

// ===================================
// GET USER ACTIVITY & METRICS
// ===================================
export const getUserActivity = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch logs
        const logs = await ActivityLog.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        // Calculate metrics
        const metrics = {
            storiesPosted: 0,
            storiesLiked: 0,
            reportsSubmitted: 0,
            reportsEscalated: 0,
            storiesDeleted: 0
        };

        logs.forEach(log => {
            if (log.action === 'story_posted') metrics.storiesPosted++;
            if (log.action === 'story_liked') metrics.storiesLiked++;
            if (log.action === 'report_submitted') metrics.reportsSubmitted++;
            if (log.action === 'report_escalated') metrics.reportsEscalated++;
            if (log.action === 'story_deleted') metrics.storiesDeleted++;
        });

        res.status(200).json({
            success: true,
            metrics,
            timeline: logs
        });

    } catch (error) {
        console.error('Error fetching user activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user activity',
            error: error.message
        });
    }
};

export default {
    getAllUsers,
    getCurrentUser,
    updateUserProfile,
    getUserPreferences,
    updateNotificationPreferences,
    updateAppearancePreferences,
    updateIdRevealConsent,
    getIdRevealConsentStatus,
    deleteAccount,
    getUserActivity
};

