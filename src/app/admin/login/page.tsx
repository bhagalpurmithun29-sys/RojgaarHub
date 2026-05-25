'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('user_role');
      if (token && role === 'admin') {
        window.location.href = '/admin';
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    const toastId = toast.loading('Authenticating Admin...');

    try {
      const response = await api.post('/auth/login', { 
        email: identifier.trim().toLowerCase(), 
        password 
      });
      const data = response.data;
      
      // Enforce admin only
      if (data.role !== 'admin') {
        setErrorMessage('Access denied. Admin privileges required.');
        toast.error('Access denied. Admin privileges required.', { id: toastId });
        setIsLoading(false);
        return;
      }

      toast.success('Admin Login successful!', { id: toastId });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('access_token', data.token);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_id', data._id);
      
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Invalid admin credentials');
      toast.error(err.response?.data?.message || 'Invalid admin credentials', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-navy brand-bg-image p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl relative pt-12">
        <Link href="/" className="absolute top-4 left-4 text-xs font-semibold text-gray-500 hover:text-brand-amber dark:text-zinc-400 dark:hover:text-brand-amber flex items-center gap-1 transition-all">
          ← Back to Home
        </Link>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-650 dark:text-zinc-400 font-medium">
            Secure Admin Portal Access
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-center text-sm font-semibold text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Admin Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-amber focus:outline-none focus:ring-brand-amber sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                placeholder="admin@rozgaarhub.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-amber focus:outline-none focus:ring-brand-amber sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-amber dark:border-zinc-700 dark:bg-zinc-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-zinc-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-brand-orange hover:text-brand-amber dark:text-brand-amber">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-brand-amber to-brand-orange px-4 py-2 text-sm font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-amber focus:ring-offset-2 disabled:opacity-50 transition-all uppercase tracking-wider"
          >
            {isLoading ? 'Authorizing Admin...' : 'Sign in as Admin'}
          </button>
        </form>
        
        <div className="mt-6 p-4 rounded-xl bg-amber-50/50 dark:bg-brand-amber/15 border border-brand-amber/20 text-center text-xs font-semibold text-brand-orange dark:text-brand-amber flex items-center justify-center gap-1.5 shadow-sm">
          🔒 Secure Admin Portal Gate — All sessions are audited.
        </div>
      </div>
    </div>
  );
}
