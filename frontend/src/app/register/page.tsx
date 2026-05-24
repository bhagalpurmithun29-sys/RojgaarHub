'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [showPassword, setShowPassword] = useState(false);

  // Debounced check function
  const checkUsername = async (username: string) => {
    if (!username) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    try {
      const res = await fetch(`http://localhost:5002/api/auth/check-username?username=${username}`);
      if (res.ok) {
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } else {
        setUsernameStatus('idle');
      }
    } catch (e) {
      setUsernameStatus('idle');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      return;
    }
    if (name === 'username') {
      const formattedValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      // Debounce logic could be added here or just direct call for simplicity
      // Simple timeout approach
      setTimeout(() => checkUsername(formattedValue), 500);
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (usernameStatus === 'taken') {
      setError('Please choose an available username.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_id', data._id);
      
      const params = new URLSearchParams(window.location.search);
      let redirect = params.get('redirect');
      
      if (!redirect || redirect === '/') {
        if (data.role === 'customer') {
          redirect = '/dashboard/customer';
        } else if (data.role === 'labour') {
          redirect = '/dashboard/labour';
        } else if (data.role === 'contractor') {
          redirect = '/dashboard/contractor';
        } else {
          redirect = '/';
        }
      }
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please make sure the password contains uppercase, lowercase, numbers, and special characters.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-navy brand-bg-image p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl relative pt-12">
        <Link href="/" className="absolute top-4 left-4 text-xs font-semibold text-gray-500 hover:text-brand-amber dark:text-zinc-400 dark:hover:text-brand-amber flex items-center gap-1 transition-all">
          ← Back to Home
        </Link>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
            Join RozgaarHub today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-amber focus:outline-none focus:ring-brand-amber sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Username <span className="text-xs text-gray-400 font-normal ml-1">(lowercase letters & numbers only)</span>
              </label>
              <div className="relative mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none sm:text-sm dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400
                    ${usernameStatus === 'taken' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 
                      usernameStatus === 'available' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : 
                      'border-gray-300 dark:border-zinc-700 focus:border-brand-amber focus:ring-brand-amber'}`}
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {usernameStatus === 'checking' && <p className="mt-1 text-xs text-blue-500">Checking availability...</p>}
              {usernameStatus === 'available' && formData.username && <p className="mt-1 text-xs font-semibold text-green-600 dark:text-green-400">Available</p>}
              {usernameStatus === 'taken' && formData.username && <p className="mt-1 text-xs font-semibold text-red-600 dark:text-red-400">Username Already Taken</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-amber focus:outline-none focus:ring-brand-amber sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                minLength={10}
                required
                title="Phone number must be exactly 10 digits"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-amber focus:outline-none focus:ring-brand-amber sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-amber focus:outline-none focus:ring-brand-amber sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                I want to join as a
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-brand-amber focus:outline-none focus:ring-brand-amber sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="labour">Labour Worker</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-brand-amber to-brand-orange px-4 py-2 text-sm font-medium text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-amber focus:ring-offset-2 disabled:opacity-50 transition-all"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-zinc-400">Already have an account? </span>
          <Link href="/login" className="font-medium text-brand-orange hover:text-brand-amber dark:text-brand-amber">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
