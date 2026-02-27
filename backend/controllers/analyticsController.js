import Report from '../models/Report.js';
import User from '../models/User.js';

// @desc    Get analytics for dashboard
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalReports = await Report.countDocuments();
        const openReports = await Report.countDocuments({ status: { $in: ['Open', 'In-Review', 'In-Progress'] } });
        const resolvedReports = await Report.countDocuments({ status: { $in: ['Resolved', 'Closed'] } });
        const totalUsers = await User.countDocuments();

        // 2. Breakdown by Risk Level
        const riskBreakdown = await Report.aggregate([
            {
                $group: {
                    _id: "$riskLevel",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Breakdown by Status
        const statusBreakdown = await Report.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Breakdown by Department
        const departmentBreakdown = await Report.aggregate([
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } } // Sort by highest count
        ]);

        // Format data arrays for frontend
        const formatData = (data, defaultKey = 'Unknown') => {
            return data.map(item => ({
                name: item._id || defaultKey,
                value: item.count
            }));
        };

        res.status(200).json({
            success: true,
            analytics: {
                kpis: {
                    totalReports,
                    openReports,
                    resolvedReports,
                    totalUsers
                },
                charts: {
                    riskLevel: formatData(riskBreakdown, 'Unassigned'),
                    status: formatData(statusBreakdown, 'Unknown'),
                    department: formatData(departmentBreakdown, 'General')
                }
            }
        });

    } catch (error) {
        console.error('Failed to get analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message
        });
    }
};

export default { getAnalytics };
