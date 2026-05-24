import React, { useState } from 'react';
import { 
  User, Building2, Users, MapPin, Clock, CreditCard, 
  Bell, Shield, EyeOff, LifeBuoy, AlertCircle, Trash2,
  Camera, UploadCloud, Save, ChevronRight, CheckCircle2,
  Smartphone, Monitor, Activity, Download, Plus
} from 'lucide-react';

export default function ContractorSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const MENU_ITEMS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'area', label: 'Service Area', icon: MapPin },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'payout', label: 'Payout', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: EyeOff },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'safety', label: 'Safety', icon: AlertCircle },
    { id: 'account', label: 'Account', icon: Trash2, danger: true },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[700px] animate-in fade-in duration-500">
      
      {/* Settings Sidebar Menu */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 p-4 shrink-0 overflow-x-auto md:overflow-y-auto">
        <h2 className="font-black text-gray-900 dark:text-white text-lg mb-4 px-2 hidden md:block">Settings</h2>
        <div className="flex md:flex-col gap-1 min-w-max md:min-w-0">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-left ${
                activeTab === item.id 
                  ? 'bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700 text-brand-amber' 
                  : `hover:bg-gray-100 dark:hover:bg-zinc-800/50 ${item.danger ? 'text-red-500 hover:text-red-600' : 'text-gray-600 dark:text-gray-400'}`
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-brand-amber' : ''}`} />
              {item.label}
              {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto hidden md:block opacity-50" />}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 p-6 md:p-8 bg-white dark:bg-zinc-900 overflow-y-auto">
        
        {/* 👤 Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">Profile Information</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Update your personal and company profile details.</p>
            </div>
            
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-brand-amber/10 border-4 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center text-brand-amber font-black text-3xl overflow-hidden">
                  M
                </div>
                <button className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white rounded-full transition-all">
                  <Camera className="w-6 h-6" />
                </button>
              </div>
              <div>
                <button className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-white font-bold rounded-xl text-sm transition-colors shadow-sm mb-2">Change Avatar/Logo</button>
                <p className="text-xs text-gray-500 dark:text-zinc-400">JPG, GIF or PNG. Max size of 5MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Full Name</label>
                <input type="text" defaultValue="Mithun Kumar" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-amber dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Company Name</label>
                <input type="text" defaultValue="MK Builders & Contractors" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-amber dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Phone Number</label>
                <input type="text" defaultValue="+91 9876543210" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-amber dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Email Address</label>
                <input type="email" defaultValue="mithun.contractor@example.com" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-amber dark:text-white" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Business Description / Bio</label>
                <textarea rows={3} defaultValue="We specialize in full-service residential construction, interior renovation, and electrical works with 10+ years of experience." className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-amber dark:text-white resize-none" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button className="px-6 py-2.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2">
                <Save className="w-4 h-4"/> Save Changes
              </button>
            </div>
          </div>
        )}

        {/* 🏢 Business Settings */}
        {activeTab === 'business' && (
          <div className="space-y-6 max-w-2xl animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">Business Verification</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Manage your legal entity documents and compliance.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Business Verified</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Your core business details have been verified by RozgaarHub administrators.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">PAN Number</label>
                  <input type="text" disabled defaultValue="ABCDE1234F" className="w-full bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">GST Number</label>
                  <input type="text" defaultValue="22AAAAA0000A1Z5" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-amber dark:text-white" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Trade License / Registration Number</label>
                  <input type="text" defaultValue="REG/KA/BLR/2026/0045" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-brand-amber dark:text-white" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 block">Business Documents</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 py-3 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Upload Updated License</span>
                  </button>
                  <button className="flex-1 py-3 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Upload Tax Certificate</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button className="px-6 py-2.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2">
                <Save className="w-4 h-4"/> Save Business Settings
              </button>
            </div>
          </div>
        )}

        {/* 🔐 Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-2xl animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">Security & Access</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Manage passwords, login history, and connected devices.</p>
            </div>

            <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
              <h4 className="font-bold text-gray-900 dark:text-white">Change Password</h4>
              <div className="space-y-3">
                <input type="password" placeholder="Current Password" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-amber dark:text-white" />
                <input type="password" placeholder="New Password" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-amber dark:text-white" />
                <input type="password" placeholder="Confirm New Password" className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-amber dark:text-white" />
                <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm transition-colors shadow-sm w-max">Update Password</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-900 dark:text-white">Active Sessions</h4>
                <button className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Logout All Devices</button>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-zinc-800 border border-brand-amber/30 p-4 rounded-xl flex items-start gap-4">
                  <Monitor className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white text-sm flex justify-between">Mac OS / Chrome Browser <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">Current Device</span></h5>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">IP: 192.168.1.104 • Mumbai, India</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl flex items-start gap-4">
                  <Smartphone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white text-sm flex justify-between">iPhone 15 Pro / Safari Browser <button className="text-xs text-red-500 font-bold">Revoke</button></h5>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">IP: 103.24.11.2 • Last active 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">Suspicious Login Alerts</h4>
                <p className="text-xs text-gray-500">Get notified via SMS if someone logs in from a new device.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
              </label>
            </div>
          </div>
        )}

        {/* ❌ Account Management */}
        {activeTab === 'account' && (
          <div className="space-y-6 max-w-2xl animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Manage sensitive account operations like deactivation or deletion.</p>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Download className="w-4 h-4"/> Download Account Data</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Get a copy of your projects, team lists, and earnings.</p>
                </div>
                <button className="px-4 py-2 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 font-bold text-sm rounded-xl transition-colors w-max shrink-0">Request Archive</button>
              </div>

              <div className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-500/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-red-700 dark:text-red-400">Deactivate Account</h4>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">Temporarily hide your profile. You can reactivate anytime within 30 days.</p>
                </div>
                <button className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-200 font-bold text-sm rounded-xl transition-colors w-max shrink-0">Deactivate</button>
              </div>

              <div className="border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-500/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-red-700 dark:text-red-400">Delete Account Permanently</h4>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">This action cannot be undone. All data will be wiped.</p>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors w-max shrink-0">Delete Account</button>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs (Team, Service Area, Availability, Notifications, etc.) */}
        {['team', 'area', 'availability', 'payout', 'notifications', 'privacy', 'support', 'safety'].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-brand-amber">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 capitalize">{activeTab} Settings</h3>
            <p className="text-gray-500 dark:text-zinc-400 max-w-sm">This module handles advanced contractor operations and is actively being structured.</p>
            <button className="mt-6 px-6 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">Configure Later</button>
          </div>
        )}

      </div>
    </div>
  );
}
