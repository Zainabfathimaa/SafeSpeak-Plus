import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ReportStatusCard } from '../components/ReportStatus/ReportStatusCard';
import { Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReportStatus() {
    // Mock Data - In a real app, fetch from API
    const [reports, setReports] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchReports = async () => {
            try {
                const { getUserReports } = await import('../services/reportService');
                const response = await getUserReports();
                if (response.success) {
                    setReports(response.reports);
                }
            } catch (error) {
                console.error('Failed to fetch reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background text-text-primary">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Active Reports</h1>
                                <p className="text-text-secondary mt-1">
                                    Track the status and progress of your submitted reports safely.
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-gray-300 text-text-primary py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer">
                                        <option>All Statuses</option>
                                        <option>In Review</option>
                                        <option>Resolved</option>
                                    </select>
                                    <Filter className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                </div>
                                <Link
                                    to="/report-incident"
                                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    + New Report
                                </Link>
                            </div>
                        </div>

                        {/* Reports Grid */}
                        {loading ? (
                            <div className="text-center py-10">Loading reports...</div>
                        ) : reports.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {reports.map((report) => (
                                    <ReportStatusCard key={report._id} report={report} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-xl font-medium text-gray-400 mb-2">No active reports found</p>
                                <p className="text-gray-500 mb-6">You haven't submitted any reports yet.</p>
                                <Link
                                    to="/report-incident"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Submit a new report
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
