'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5002/api/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Server error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen brand-bg-image flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-amber to-brand-orange items-center justify-center text-white font-extrabold text-2xl shadow-md">
          R
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Set New Password</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Enter your new password below to reset your credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl rounded-3xl border border-gray-150 dark:border-zinc-800 sm:px-10 space-y-6 relative pt-12">
          <Link href="/" className="absolute top-4 left-4 text-xs font-semibold text-gray-500 hover:text-brand-orange dark:text-zinc-400 dark:hover:text-brand-amber flex items-center gap-1 transition-all">
            ← Back to Home
          </Link>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
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

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
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

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 p-3.5 rounded-xl text-xs font-medium">
                ✅ {message} - Redirecting to login...
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-amber to-brand-orange text-white font-bold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-brand-amber/15 flex justify-center items-center gap-2"
            >
              {loading ? 'Updating password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
