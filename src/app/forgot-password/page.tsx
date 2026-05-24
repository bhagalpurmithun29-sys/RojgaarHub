'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setResetLink('');

    try {
      const response = await fetch('http://localhost:5002/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage(data.message);
      // In development mode, retrieve the link directly for seamless local testing
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
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
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Forgot Password</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Enter your registered email below to receive a password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl rounded-3xl border border-gray-150 dark:border-zinc-800 sm:px-10 space-y-6 relative pt-12">
          <Link href="/" className="absolute top-4 left-4 text-xs font-semibold text-gray-500 hover:text-brand-orange dark:text-zinc-400 dark:hover:text-brand-amber flex items-center gap-1 transition-all">
            ← Back to Home
          </Link>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400 p-3.5 rounded-xl text-xs font-medium">
                ✅ {message}
              </div>
            )}

            {resetLink && (
              <div className="bg-amber-50 dark:bg-brand-amber/10 border border-brand-amber/20 p-4 rounded-xl text-xs space-y-2">
                <span className="font-bold text-brand-orange dark:text-brand-amber">🛠️ Developer Dev Mode Shortcut:</span>
                <p className="text-gray-600 dark:text-zinc-400">Click below to open the reset link immediately without opening an email inbox:</p>
                <a href={resetLink} className="inline-block text-brand-orange dark:text-brand-amber font-bold hover:underline">
                  Reset Password Now →
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-amber to-brand-orange text-white font-bold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-brand-amber/15 flex justify-center items-center gap-2"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-xs font-semibold text-brand-orange dark:text-brand-amber hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
