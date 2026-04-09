import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function FilterPanel({ onFilterChange, onReset }) {
    const [filters, setFilters] = useState({
        riskLevel: 'all',
        status: 'all',
        dateRange: 'all'
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        setFilters({
            riskLevel: 'all',
            status: 'all',
            dateRange: 'all'
        });
        onReset();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <span>Filters</span>
                </h3>
                <button
                    onClick={handleReset}
                    className="text-sm text-primary hover:text-primary-dark flex items-center space-x-1 font-medium"
                >
                    <X className="h-4 w-4" />
                    <span>Reset</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Risk Level Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                    <select
                        value={filters.riskLevel}
                        onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">All Levels</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-review">In Review</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                        <option value="escalated">Escalated</option>
                    </select>
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
