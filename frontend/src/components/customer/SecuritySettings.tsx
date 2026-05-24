import React, { useState } from 'react';
import { Shield, Smartphone, Monitor, Key, Clock, AlertTriangle, LogOut, CheckCircle, Activity, Server } from 'lucide-react';

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeoutSetting, setTimeoutSetting] = useState('30');
  const [suspiciousAlerts, setSuspiciousAlerts] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    // Simulate API call
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogoutAll = () => {
    if (confirm("Are you sure you want to log out from all other devices?")) {
      alert("Logged out from all other devices successfully.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-300 z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Password updated successfully!</span>
        </div>
      )}

      {/* Change Password */}
      <div>
        <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-brand-amber" /> Change Password
        </h5>
        <form onSubmit={handlePasswordChange} className="space-y-4 bg-white dark:bg-zinc-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:border-brand-amber dark:text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:border-brand-amber dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full mt-1 p-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:border-brand-amber dark:text-white" />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900 p-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button type="button" className="text-sm text-brand-amber hover:underline font-medium">Forgot password?</button>
            <button type="submit" className="px-4 py-2 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-lg text-sm transition-colors">Update Password</button>
          </div>
        </form>
      </div>

      {/* Device Management */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h5 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-500" /> Logged Devices
          </h5>
          <button onClick={handleLogoutAll} className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Logout from all devices
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-500/10 text-green-500 rounded-lg">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">iPhone 15</p>
                <p className="text-[10px] text-green-500 font-semibold uppercase tracking-wider mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active now
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded">Current Device</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-zinc-700 text-gray-500 rounded-lg">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Chrome Desktop</p>
                <p className="text-xs text-gray-500 mt-0.5">Last active: 2h ago</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-100 dark:border-red-900/50 rounded-lg transition-colors">
              Remove Device
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Security */}
      <div>
        <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-500" /> Advanced Security
        </h5>
        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-sm divide-y divide-gray-100 dark:divide-zinc-700">
          
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Suspicious Login Alerts</p>
              <p className="text-xs text-gray-500 mt-0.5">Get notified about logins from unknown locations.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={suspiciousAlerts} onChange={() => setSuspiciousAlerts(!suspiciousAlerts)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
            </label>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Session Timeout</p>
              <p className="text-xs text-gray-500 mt-0.5">Auto-logout after inactivity.</p>
            </div>
            <select value={timeoutSetting} onChange={e => setTimeoutSetting(e.target.value)} className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm rounded-lg focus:ring-brand-amber focus:border-brand-amber block p-2 dark:text-white">
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
              <option value="never">Never</option>
            </select>
          </div>

        </div>
      </div>

      {/* Account Activity */}
      <div>
        <h5 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" /> Recent Activity
        </h5>
        <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex gap-3">
            <div className="mt-0.5"><Shield className="w-4 h-4 text-green-500" /></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Successful login from iPhone 15</p>
              <p className="text-xs text-gray-400">Today, 10:45 AM • Mumbai, India</p>
            </div>
          </div>
          <div className="flex gap-3 opacity-70">
            <div className="mt-0.5"><AlertTriangle className="w-4 h-4 text-amber-500" /></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Password changed</p>
              <p className="text-xs text-gray-400">12 May 2026, 04:30 PM</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
