import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export function SLATimer({ createdDate, riskLevel }) {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [isBreached, setIsBreached] = useState(false);

    useEffect(() => {
        const calculateSLA = () => {
            const slaHours = {
                high: 24,
                medium: 72,
                low: 168
            };

            const created = new Date(createdDate);
            const deadline = new Date(created.getTime() + slaHours[riskLevel?.toLowerCase()] * 60 * 60 * 1000);
            const now = new Date();

            if (now > deadline) {
                setIsBreached(true);
                setTimeRemaining('BREACHED');
            } else {
                const diff = deadline - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`${hours}h ${minutes}m`);
                setIsBreached(false);
            }
        };

        calculateSLA();
        const interval = setInterval(calculateSLA, 60000);
        return () => clearInterval(interval);
    }, [createdDate, riskLevel]);

    if (isBreached) {
        return (
            <div className="flex items-center space-x-2 text-red-600 font-semibold">
                <AlertCircle className="h-5 w-5" />
                <span>{timeRemaining}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2 text-amber-600 font-semibold">
            <Clock className="h-5 w-5" />
            <span>{timeRemaining}</span>
        </div>
    );
}
