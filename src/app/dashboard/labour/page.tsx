'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LabourDashboard() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('user_email')?.split('@')[0] || 'Labour Worker';
    setUserName(name);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Worker Dashboard</h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-1">Welcome back, {userName}!</p>
          </div>
          <Link href="/profile" className="bg-brand-amber hover:bg-brand-orange text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Update Profile
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border-l-4 border-brand-amber">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-zinc-300">Pending Requests</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-zinc-300">Completed Jobs</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-zinc-300">Total Earnings</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">₹0</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Jobs</h2>
          <div className="text-center py-10 text-gray-500 dark:text-zinc-400">
            No upcoming jobs. Make sure your profile is updated to get more requests!
          </div>
        </div>
      </div>
    </div>
  );
}
