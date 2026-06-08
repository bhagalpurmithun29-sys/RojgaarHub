'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { 
  Home, Wallet, Calendar, Bell, Shield, MapPin, Search, ChevronRight,
  User, CheckCircle, Clock, Star, MessageSquare, History, Settings, LogOut, FileText, CheckCircle2, TrendingUp, AlertTriangle, ShieldAlert
} from 'lucide-react';

import LabourChatCenter from '@/components/labour/LabourChatCenter';
import SecuritySettings from '@/components/customer/SecuritySettings';
import BookingHistory from '@/components/booking/BookingHistory';
import EarningsWallet from '@/components/labour/EarningsWallet';
import PerformanceAnalytics from '@/components/labour/PerformanceAnalytics';
import ActiveBooking from '@/components/labour/ActiveBooking';
import BookingRequests from '@/components/labour/BookingRequests';
import RatingsReviews from '@/components/labour/RatingsReviews';
import SafetySupport from '@/components/labour/SafetySupport';
import DocumentVerification from '@/components/labour/DocumentVerification';
import { ShieldCheck } from 'lucide-react';

export default function LabourDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(true);
  const [userName, setUserName] = useState('Ravi Kumar');
  const [userHandle, setUserHandle] = useState('');

  const [stats, setStats] = useState({
    todayEarnings: 0,
    jobsCompleted: 0,
    rating: 0,
    reliability: 0,
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.status === 200) {
          const data = res.data;
          setUserName(data.name || data.email?.split('@')[0] || 'Labour Worker');
          setUserHandle('@' + (data.username || data.name?.toLowerCase().replace(/\s/g, '')));
          
          setStats({
            todayEarnings: data.statistics?.todayEarnings || 0,
            jobsCompleted: data.statistics?.completedBookings || 0,
            rating: data.rating || 0,
            reliability: data.reliabilityScore || 0,
            profileImage: data.profileImage || ''
          });
        }
      } catch (err) {
        // Fallback to local storage
        const email = localStorage.getItem('user_email');
        if (email) {
          setUserName(email.split('@')[0]);
          setUserHandle('@' + email.split('@')[0]);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { id: 'home', label: 'Dashboard Home', icon: Home, section: 'WORK' },
    { id: 'requests', label: 'Booking Requests', icon: Bell, section: 'WORK', badge: 2 },
    { id: 'active', label: 'Active Booking', icon: MapPin, section: 'WORK' },
    
    { id: 'wallet', label: 'Earnings & Wallet', icon: Wallet, section: 'FINANCE' },
    { id: 'analytics', label: 'Analytics & Performance', icon: TrendingUp, section: 'FINANCE' },
    
    { id: 'chat', label: 'Chat & Calls', icon: MessageSquare, section: 'COMMUNICATIONS' },
    { id: 'reviews', label: 'Ratings & Reviews', icon: Star, section: 'COMMUNICATIONS' },
    
    { id: 'history', label: 'Booking History', icon: History, section: 'ACCOUNT & SETTINGS' },
    { id: 'kyc', label: 'KYC & Verification', icon: ShieldCheck, section: 'ACCOUNT & SETTINGS' },
    { id: 'safety', label: 'Safety & Support', icon: ShieldAlert, section: 'ACCOUNT & SETTINGS' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'ACCOUNT & SETTINGS' },
  ];

  return (
    <div className="h-screen flex bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-72 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col z-20 shrink-0 shadow-sm relative">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-brand-amber/30">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">WorkerHub</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Labour Portal</p>
            </div>
          </div>
        </div>

        {/* Profile Snapshot & Online Toggle */}
        <div className="px-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            {stats.profileImage ? (
              <img src={stats.profileImage} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm bg-brand-amber flex items-center justify-center text-white font-bold text-lg">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{userName}</p>
              <p className="text-xs text-brand-amber font-bold">Electrician • ⭐ 4.8</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700">
            <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">Duty Status</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isOnline} onChange={() => setIsOnline(!isOnline)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          {['WORK', 'FINANCE', 'COMMUNICATIONS', 'ACCOUNT & SETTINGS'].map((section) => (
            <div key={section} className="mb-6">
              <h3 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-3">
                {section}
              </h3>
              <ul className="space-y-1">
                {navItems.filter(item => item.section === section).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isActive 
                            ? 'bg-brand-amber/10 text-brand-amber dark:bg-brand-amber/20' 
                            : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-brand-amber' : 'text-gray-400'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto relative ${activeTab === 'chat' ? '' : 'p-8'}`}>
        <div className={`mx-auto h-full ${activeTab === 'chat' ? 'w-full' : 'max-w-6xl'}`}>
          {activeTab !== 'chat' && (
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>
          )}

          {activeTab === 'home' && <HomeTab stats={stats} />}
          {activeTab === 'requests' && <BookingRequests />}
          {activeTab === 'chat' && (
            <div className="h-full w-full flex flex-col">
              <LabourChatCenter />
            </div>
          )}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'history' && <BookingHistory initialRole="labour" />}
          {activeTab === 'wallet' && <EarningsWallet />}
          {activeTab === 'analytics' && <PerformanceAnalytics />}
          {activeTab === 'active' && <ActiveBooking />}
          { activeTab === 'reviews' && <RatingsReviews /> }
          { activeTab === 'safety' && <SafetySupport /> }
          { activeTab === 'kyc' && <DocumentVerification /> }
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 z-50 pb-safe">
        <div className="flex items-center justify-around p-3">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'requests', icon: Bell, label: 'Requests' },
            { id: 'active', icon: MapPin, label: 'Active' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 ${isActive ? 'text-brand-amber' : 'text-gray-500 dark:text-zinc-400'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-brand-amber/20' : ''}`} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function HomeTab({ stats }: { stats?: any }) {
  const displayStats = stats || { todayEarnings: 0, jobsCompleted: 0, rating: 0, reliability: 0 };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-[100px]"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Today's Earnings</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white flex items-end gap-1">
            <span className="text-lg text-green-500">₹</span>{displayStats.todayEarnings}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-amber/10 rounded-bl-[100px]"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Jobs Completed</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{displayStats.jobsCompleted}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-bl-[100px]"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Overall Rating</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            {displayStats.rating ? displayStats.rating.toFixed(1) : 0} <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-[100px]"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Reliability</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{displayStats.reliability}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Schedule */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Availability & Schedule</h3>
            <button className="text-sm font-bold text-brand-amber hover:underline">Edit Schedule</button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Working Days</p>
                  <p className="text-xs text-gray-500">Monday - Saturday</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Time Slots</p>
                  <p className="text-xs text-gray-500">09:00 AM - 06:00 PM</p>
                </div>
              </div>
            </div>
            <div className="pt-2">
               <button className="w-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 font-bold py-3 rounded-xl hover:bg-rose-100 transition-colors">
                 Set as Busy (Holiday Mode)
               </button>
            </div>
          </div>
        </div>

        {/* Quick Action / Alerts */}
        <div className="bg-gradient-to-br from-gray-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-950 p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-amber/20 blur-3xl rounded-full"></div>
           <div>
             <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Bell className="w-5 h-5 text-brand-amber" /> Action Required</h3>
             <p className="text-gray-300 text-sm mb-6">You have 2 pending booking requests nearby. Accepting quickly improves your Reliability Score.</p>
           </div>
           
           <div className="bg-white/10 backdrop-blur border border-white/10 p-4 rounded-2xl">
             <div className="flex justify-between items-center mb-2">
               <p className="font-bold text-sm">Booking Request #2458</p>
               <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">Expires in 2m</span>
             </div>
             <p className="text-xs text-gray-400 mb-4">Electrician • 2.5 km away • Approx ₹450</p>
             <button className="w-full bg-brand-amber hover:bg-brand-orange text-white font-bold py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-brand-amber/20">
               View & Accept
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}


function SettingsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  const toggleExpand = (val: string) => setExpanded(prev => prev === val ? null : val);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 divide-y divide-gray-100 dark:divide-zinc-700">
        
        {/* Profile */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('profile')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Profile Settings</h4><p className="text-xs text-gray-500 mt-1">Skills, service area, and identity</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'profile' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'profile' && (
             <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-6">
               <div className="flex items-center gap-6">
                 <div className="relative">
                   <img src="https://i.pravatar.cc/150?u=ravi_e" className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-sm" alt="Profile" />
                   <button className="absolute bottom-0 right-0 bg-brand-amber text-white p-1.5 rounded-full shadow-md hover:bg-brand-orange transition-colors">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   </button>
                 </div>
                 <div>
                   <h5 className="font-bold text-gray-900 dark:text-white">Profile Photo</h5>
                   <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Username <span className="text-[10px] font-normal text-gray-400">(Cannot be changed)</span></label>
                   <input type="text" defaultValue="vinay_kumar" disabled className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800/80 text-gray-500 dark:text-zinc-400 text-sm shadow-sm cursor-not-allowed" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Email Address <span className="text-[10px] font-normal text-gray-400">(Cannot be changed)</span></label>
                   <input type="email" defaultValue="vinay@example.com" disabled className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800/80 text-gray-500 dark:text-zinc-400 text-sm shadow-sm cursor-not-allowed" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Full Name</label>
                   <input type="text" defaultValue="Vinay Kumar" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Phone Number (10 digits)</label>
                   <div className="flex mt-1 shadow-sm rounded-xl">
                     <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-500 text-sm">
                       +91
                     </span>
                     <input type="tel" defaultValue="9876543210" maxLength={10} minLength={10} pattern="\d{10}" className="w-full p-2.5 rounded-r-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm" />
                   </div>
                 </div>
                 <div className="md:col-span-2">
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Languages Known</label>
                   <input type="text" defaultValue="Hindi, English, Marathi" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm" />
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Category</label>
                   <select className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm">
                     <option>Electrician</option>
                     <option>Plumber</option>
                     <option>Carpenter</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Experience (Years)</label>
                   <input type="number" defaultValue="5" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm" />
                 </div>
                 <div>
                   <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Skills</label>
                   <input type="text" defaultValue="Wiring, Repair, Setup" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm" />
                 </div>
               </div>

               <div>
                 <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Service Description</label>
                 <textarea rows={3} defaultValue="Professional electrician with 5 years of experience in residential and commercial wiring." className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm resize-none"></textarea>
               </div>

               <div className="flex gap-3 pt-2">
                 <button className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                   Edit Profile
                 </button>
                 <button className="flex-1 bg-brand-amber text-white font-bold py-2.5 rounded-xl text-sm hover:bg-brand-orange transition-colors shadow-md shadow-brand-amber/20">
                   Save Changes
                 </button>
               </div>
             </div>
          )}
        </div>

        {/* Work & Service */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('work')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Work & Service Settings</h4><p className="text-xs text-gray-500 mt-1">Manage categories, skills, and availability</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'work' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'work' && (
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Primary Service Category</label>
                  <select className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm">
                    <option>Electrician</option>
                    <option>Plumber</option>
                    <option>Carpenter</option>
                    <option>Painter</option>
                    <option>Appliance Repair</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Sub-skills (comma separated)</label>
                  <input type="text" defaultValue="Wiring, Fan repair, AC repair, Switchboard installation" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h5 className="font-bold text-sm text-gray-900 dark:text-white">Service Preferences</h5>
                
                <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Emergency Services</p>
                    <p className="text-xs text-gray-500 mt-0.5">Accept urgent bookings 24/7 at a premium rate</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Available / Busy Status</p>
                    <p className="text-xs text-gray-500 mt-0.5">Toggle to stop receiving new requests temporarily</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button className="flex-1 bg-brand-amber text-white font-bold py-2.5 rounded-xl text-sm hover:bg-brand-orange transition-colors shadow-md shadow-brand-amber/20">
                   Update Preferences
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Service Area */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('area')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Service Area & Location</h4><p className="text-xs text-gray-500 mt-1">Manage GPS base location and working radius</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'area' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'area' && (
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-6">
              
              <div className="flex items-center gap-4 p-4 bg-brand-amber/10 border border-brand-amber/20 rounded-xl">
                <MapPin className="w-8 h-8 text-brand-amber shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Current Base Location</p>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">Mall Road, Shimla, Himachal Pradesh</p>
                </div>
                <button className="ml-auto text-xs font-bold bg-white dark:bg-zinc-800 text-brand-amber px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700">Update GPS</button>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 dark:text-white">Service Radius (Maximum travel distance)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button className="py-2.5 rounded-xl border-2 border-transparent bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-sm shadow-sm hover:border-gray-200 dark:hover:border-zinc-600">5 km</button>
                  <button className="py-2.5 rounded-xl border-2 border-brand-amber bg-brand-amber/10 text-brand-amber font-bold text-sm shadow-sm">10 km</button>
                  <button className="py-2.5 rounded-xl border-2 border-transparent bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-sm shadow-sm hover:border-gray-200 dark:hover:border-zinc-600">20 km</button>
                  <button className="py-2.5 rounded-xl border-2 border-transparent bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-sm shadow-sm hover:border-gray-200 dark:hover:border-zinc-600">Custom</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Add Extra Service Cities/Areas</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-300 shadow-sm">
                    Kufri <button className="text-gray-400 hover:text-red-500">&times;</button>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-300 shadow-sm">
                    Mashobra <button className="text-gray-400 hover:text-red-500">&times;</button>
                  </span>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 dark:border-zinc-600 text-xs font-bold text-gray-500 hover:text-brand-amber hover:border-brand-amber transition-colors">
                    + Add City
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button className="flex-1 bg-brand-amber text-white font-bold py-2.5 rounded-xl text-sm hover:bg-brand-orange transition-colors shadow-md shadow-brand-amber/20">
                   Save Location Settings
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Availability & Schedule */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('schedule')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Availability & Schedule</h4><p className="text-xs text-gray-500 mt-1">Manage working days, time slots, and breaks</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'schedule' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'schedule' && (
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-6">
              
              <div>
                <label className="text-sm font-bold text-gray-900 dark:text-white">Working Days</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <button key={day} className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-amber text-white font-bold text-sm shadow-sm shadow-brand-amber/20">{day}</button>
                  ))}
                  <button className="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 text-gray-500 font-bold text-sm hover:border-gray-300">Sun</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Working Time Slots</label>
                  <div className="flex items-center gap-3">
                    <input type="time" defaultValue="09:00" className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand-amber" />
                    <span className="text-gray-400 font-medium">to</span>
                    <input type="time" defaultValue="18:00" className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand-amber" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Daily Break Timing</label>
                  <div className="flex items-center gap-3">
                    <input type="time" defaultValue="13:00" className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand-amber" />
                    <span className="text-gray-400 font-medium">to</span>
                    <input type="time" defaultValue="14:00" className="flex-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand-amber" />
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Holiday Mode (On Vacation)</p>
                    <p className="text-xs text-gray-500 mt-0.5">Automatically reject all bookings during this period</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button className="flex-1 bg-brand-amber text-white font-bold py-2.5 rounded-xl text-sm hover:bg-brand-orange transition-colors shadow-md shadow-brand-amber/20">
                   Update Schedule
                 </button>
               </div>
            </div>
          )}
        </div>



        {/* Payout Settings */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('payout')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Earnings & Payout Settings</h4><p className="text-xs text-gray-500 mt-1">Manage withdrawal preferences and bank accounts</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'payout' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'payout' && (
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 dark:text-white">Auto-Withdrawal Preferences</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <input type="radio" name="payout_freq" id="p_instant" className="peer sr-only" />
                    <label htmlFor="p_instant" className="block p-4 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl cursor-pointer peer-checked:border-brand-amber peer-checked:bg-brand-amber/5 transition-all text-center shadow-sm">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Instant</p>
                      <p className="text-[10px] text-gray-500 mt-1">After every job (1% fee)</p>
                    </label>
                  </div>
                  <div className="relative">
                    <input type="radio" name="payout_freq" id="p_daily" className="peer sr-only" defaultChecked />
                    <label htmlFor="p_daily" className="block p-4 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl cursor-pointer peer-checked:border-brand-amber peer-checked:bg-brand-amber/5 transition-all text-center shadow-sm">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Daily</p>
                      <p className="text-[10px] text-gray-500 mt-1">End of day (Free)</p>
                    </label>
                  </div>
                  <div className="relative">
                    <input type="radio" name="payout_freq" id="p_weekly" className="peer sr-only" />
                    <label htmlFor="p_weekly" className="block p-4 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl cursor-pointer peer-checked:border-brand-amber peer-checked:bg-brand-amber/5 transition-all text-center shadow-sm">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">Weekly</p>
                      <p className="text-[10px] text-gray-500 mt-1">Every Monday (Free)</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <label className="text-sm font-bold text-gray-900 dark:text-white">Bank Details (Primary)</label>
                   <button className="text-xs font-bold text-brand-amber hover:underline">+ Add New</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Account Holder Name</label>
                    <input type="text" defaultValue="Vinay Kumar" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">UPI ID (Optional but recommended)</label>
                    <input type="text" defaultValue="vinay.kumar@okaxis" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm" />
                  </div>
                  <div className="md:col-span-2 flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">Account Number</label>
                      <input type="password" defaultValue="123456789012" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm font-mono tracking-widest" />
                    </div>
                    <div className="w-1/3">
                      <label className="text-xs font-semibold text-gray-600 dark:text-zinc-400">IFSC Code</label>
                      <input type="text" defaultValue="SBIN0001234" className="w-full mt-1 p-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:border-brand-amber dark:text-white text-sm shadow-sm uppercase font-mono" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button className="flex-1 bg-brand-amber text-white font-bold py-2.5 rounded-xl text-sm hover:bg-brand-orange transition-colors shadow-md shadow-brand-amber/20">
                   Save Payout Settings
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('security')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Authentication & Security</h4><p className="text-xs text-gray-500 mt-1">Passwords, logged devices, and activity</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'security' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'security' && (
            <div className="p-6 pt-0 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
              <div className="mt-4">
                <SecuritySettings />
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('notifications')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Notification Settings</h4><p className="text-xs text-gray-500 mt-1">Manage what alerts you receive</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'notifications' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'notifications' && (
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-4">
              
              {[
                { id: 'n_booking', label: 'Booking Notifications', desc: 'New requests, cancellations, and ETA updates', defaultChecked: true },
                { id: 'n_chat', label: 'Chat Notifications', desc: 'Messages from customers and admins', defaultChecked: true },
                { id: 'n_payment', label: 'Payment Notifications', desc: 'Wallet credits, payouts, and tips', defaultChecked: true },
                { id: 'n_promo', label: 'Promotions & Offers', desc: 'Bonus opportunities and platform offers', defaultChecked: false },
                { id: 'n_system', label: 'System Notifications', desc: 'Security alerts and platform updates', defaultChecked: true },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
                  </label>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Privacy Settings */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('privacy')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Privacy Settings</h4><p className="text-xs text-gray-500 mt-1">Control your visibility and data sharing</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'privacy' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'privacy' && (
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-4">
              
              {[
                { id: 'pv_online', label: 'Show Online Status', desc: 'Let customers see when you are active on the app', defaultChecked: true },
                { id: 'pv_profile', label: 'Profile Visibility', desc: 'Allow your profile to appear in public search results', defaultChecked: true },
                { id: 'pv_contact', label: 'Hide Contact Information', desc: 'Mask phone number and email until booking is confirmed', defaultChecked: true },
                { id: 'pv_location', label: 'Precise Location Sharing', desc: 'Share live GPS only during an active booking', defaultChecked: true },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
                  </label>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Account Management */}
        <div className="flex flex-col">
          <div onClick={() => toggleExpand('account')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold text-red-500 text-sm">Account Management</h4><p className="text-xs text-gray-500 mt-1">Data export, deactivation, and deletion</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'account' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'account' && (
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Download Account Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Get a copy of your bookings, earnings, and profile data.</p>
                </div>
                <button className="text-xs font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors">
                  Request Data
                </button>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Deactivate Account</p>
                    <p className="text-xs text-gray-500 mt-0.5">Temporarily hide your profile. You can reactivate anytime by logging in.</p>
                  </div>
                  <button className="text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/50 px-4 py-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                    Deactivate
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-red-600">Delete Account</p>
                    <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account. Includes a 30-day recovery period.</p>
                  </div>
                  <button className="text-xs font-bold text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20">
                    Delete
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
