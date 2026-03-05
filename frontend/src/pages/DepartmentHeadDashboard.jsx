import React from 'react';
import { LayoutDashboard, Users, FileText, Bell } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function DepartmentHeadDashboard() {
    return (
        <div className="h-screen overflow-hidden bg-gray-50/50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Department Head Dashboard</h1>
                        <p className="text-gray-500">Overview of your department's incidents and reports</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Bell className="h-4 w-4" />
                            Notifications
                        </Button>
                        <Button className="gap-2">
                            <FileText className="h-4 w-4" />
                            Generate Report
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <LayoutDashboard className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">+12%</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">24</h3>
                        <p className="text-sm text-gray-500 mt-1">Active Cases</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 bg-gray-50 px-2.5 py-0.5 rounded-full">Total</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">156</h3>
                        <p className="text-sm text-gray-500 mt-1">Students Monitored</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <FileText className="h-6 w-6 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">New</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">8</h3>
                        <p className="text-sm text-gray-500 mt-1">Pending Reviews</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <LayoutDashboard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">Dashboard Content</h3>
                        <p>Detailed metrics and charts will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
