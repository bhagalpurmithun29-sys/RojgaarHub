'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#121212] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-amber/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        
        {/* Error Icon */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-100 dark:bg-red-500/10 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white dark:bg-zinc-900 rounded-full w-24 h-24 flex items-center justify-center shadow-xl border border-red-100 dark:border-red-900/50">
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-brand-amber drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Page Not Found
          </h2>
          <p className="text-gray-500 dark:text-zinc-400">
            Oops! The page you are looking for has been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="pt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Link href="/" className="flex items-center justify-center gap-2 py-4 px-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-amber transition-all group font-bold text-gray-700 dark:text-zinc-300">
            <Home className="w-5 h-5 text-gray-400 group-hover:text-brand-amber transition-colors" />
            Go to Homepage
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 py-4 px-6 bg-brand-amber hover:bg-brand-orange text-white rounded-2xl shadow-md transition-all font-bold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}
