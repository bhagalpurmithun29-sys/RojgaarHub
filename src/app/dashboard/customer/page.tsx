'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BookingHistory from '@/components/booking/BookingHistory';
import SearchDiscovery from '@/components/customer/SearchDiscovery';
import PostRequirement from '@/components/customer/PostRequirement';
import LiveBookingTracker from '@/components/customer/LiveBookingTracker';
import FavouriteWorkers from '@/components/customer/FavouriteWorkers';
import RatingsReviews from '@/components/customer/RatingsReviews';
import ChatCenter from '@/components/customer/ChatCenter';
import CustomerWallet from '@/components/customer/CustomerWallet';
import SecuritySettings from '@/components/customer/SecuritySettings';
import {
  Home, Search, MapPin, Clock, History, Heart,
  Wallet, ShieldAlert, Mic, User, Star, ChevronRight,
  Filter, Map, BookOpen, Truck, CheckCircle, Download,
  X, Briefcase, IndianRupee, Zap, Navigation, ThumbsUp, LogOut,
  ClipboardList, MessageSquare, Bell, Gift, Settings,
  Plus, Phone, Paperclip, AlertOctagon, HelpCircle, Ticket, ShieldCheck, CheckCircle2, XCircle, Minus, UploadCloud, Camera, Check, FileText
} from 'lucide-react';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('Customer');
  const [location, setLocation] = useState('Fetching location...');
  const [settingsExpandedSection, setSettingsExpandedSection] = useState<string | null>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userHandle, setUserHandle] = useState<string>('');
  
  // KYC specific states
  const [kycStatus, setKycStatus] = useState<string>('approved'); // default to true to prevent flash
  const [showFirstLoginKYC, setShowFirstLoginKYC] = useState(false);
  const [showBookingKYC, setShowBookingKYC] = useState(false);

  useEffect(() => {
    // Initial fallback
    const emailName = localStorage.getItem('user_email')?.split('@')[0] || 'Customer';
    setUserName(emailName);

    // Fetch real profile from DB
    const fetchGlobalProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5002/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.name) setUserName(data.name);
          if (data.profileImage) setProfileImage(data.profileImage);
          if (data.username) setUserHandle(data.username);
          setLocation(data.address || 'Address Not Set');
          
          const currentKycStatus = data.kycStatus || 'unverified';
          setKycStatus(currentKycStatus);
          
          if (currentKycStatus !== 'approved' && localStorage.getItem('firstLoginKyCPromptDone') !== 'true') {
            setTimeout(() => {
              setShowFirstLoginKYC(true);
              localStorage.setItem('firstLoginKyCPromptDone', 'true');
            }, 1000);
          }

        } else {
          setLocation('Location Not Set');
        }
      } catch (e) {
        console.error('Error fetching global profile', e);
        setLocation('Failed to fetch location');
      }
    };
    fetchGlobalProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navGroups = [
    {
      title: 'Main',
      items: [
        { id: 'home', label: 'Dashboard Home', icon: Home },
        { id: 'search', label: 'Search & Discovery', icon: Search },
        { id: 'marketplace', label: 'Post Requirement', icon: ClipboardList },
      ]
    },
    {
      title: 'Bookings & Activity',
      items: [
        { id: 'live', label: 'Live Booking', icon: Navigation },
        { id: 'history', label: 'Booking History', icon: History },
        { id: 'favourites', label: 'Favourite Workers', icon: Heart },
        { id: 'reviews', label: 'Ratings & Reviews', icon: Star },
      ]
    },
    {
      title: 'Communications',
      items: [
        { id: 'chat', label: 'Chat & Calls', icon: MessageSquare },
        { id: 'notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'Account & Settings',
      items: [
        { id: 'wallet', label: 'Wallet System', icon: Wallet },
        { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
        { id: 'rewards', label: 'Rewards & Referrals', icon: Gift },
        { id: 'verification', label: 'Verification & Trust', icon: ShieldCheck },
        { id: 'support', label: 'Support & Safety', icon: ShieldAlert },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#121212] overflow-hidden font-sans">

      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col shadow-sm z-10 custom-scrollbar overflow-y-auto">
        <div className="p-6 sticky top-0 bg-white dark:bg-zinc-950 z-20 border-b border-gray-100 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-brand-amber" />
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-amber to-brand-orange">
              RozgaarHub
            </span>
          </Link>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-amber/20 flex items-center justify-center text-brand-amber font-bold text-lg shrink-0 overflow-hidden shadow-sm">
              {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Customer Account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${activeTab === item.id
                          ? 'bg-brand-amber/10 text-brand-amber font-bold dark:bg-brand-amber/20'
                          : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white font-medium'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 mt-auto sticky bottom-0 bg-white dark:bg-zinc-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-zinc-50 dark:bg-brand-navy brand-bg-image transition-colors duration-300">
        <div className={activeTab === 'chat' ? "h-full w-full relative z-10" : "max-w-6xl mx-auto p-8 pb-24 relative z-10"}>

          {/* Header Actions shared across tabs */}
          {activeTab !== 'chat' && (
            <div className="flex justify-end items-center gap-4 mb-4">
              <button className="p-2 bg-white dark:bg-zinc-800 rounded-full text-gray-600 dark:text-zinc-300 shadow-sm hover:text-brand-amber transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={() => setActiveTab('support')} className="p-2 bg-white dark:bg-zinc-800 rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-colors">
                <ShieldAlert className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className={activeTab === 'chat' ? "h-full w-full" : "pt-4"}>
            {activeTab === 'home' && <HomeTab userName={userName} userHandle={userHandle} location={location} setActiveTab={setActiveTab} setSettingsExpandedSection={setSettingsExpandedSection} />}
            {activeTab === 'search' && <SearchTab kycStatus={kycStatus} setShowBookingKYC={setShowBookingKYC} />}
            {activeTab === 'marketplace' && <MarketplaceTab kycStatus={kycStatus} setShowBookingKYC={setShowBookingKYC} />}
            {activeTab === 'live' && <LiveBookingTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'favourites' && <FavouritesTab kycStatus={kycStatus} setShowBookingKYC={setShowBookingKYC} />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'wallet' && <WalletTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'rewards' && <RewardsTab />}
            {activeTab === 'verification' && <VerificationTab />}
            {activeTab === 'support' && <SupportTab />}
            {activeTab === 'settings' && <SettingsTab defaultExpanded={settingsExpandedSection} />}
          </div>

        </div>
      </main>

      {/* First Login KYC Prompt Modal */}
      {showFirstLoginKYC && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-inner">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Welcome to RozgaarHub!</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">Complete your KYC verification to unlock all RozgaarHub features and improve account trust.</p>
            <div className="space-y-3">
              <button onClick={() => { setShowFirstLoginKYC(false); setActiveTab('verification'); }} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm">Verify Now</button>
              <button onClick={() => setShowFirstLoginKYC(false)} className="w-full py-3.5 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-sm">Skip for Later</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking KYC Restriction Modal */}
      {showBookingKYC && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-inner">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Verification Required</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">Complete your KYC verification to unlock all RozgaarHub features and improve account trust.</p>
            <div className="space-y-3">
              <button onClick={() => { setShowBookingKYC(false); setActiveTab('verification'); }} className="w-full py-3.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl shadow-md transition-all text-sm">Complete KYC</button>
              <button onClick={() => setShowBookingKYC(false)} className="w-full py-3.5 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- SUB COMPONENTS ---

function HomeTab({ userName, userHandle, location, setActiveTab, setSettingsExpandedSection }: { userName: string, userHandle: string, location: string, setActiveTab: (t: string) => void, setSettingsExpandedSection: (s: string | null) => void }) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    favouriteLabourCount: 0,
    reliabilityScore: 0,
    rating: 0,
    reviewsReceived: 0,
    cancellationRate: 0,
    isVerified: false,
    profileImage: ''
  });
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5002/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalBookings: data.statistics?.totalBookings || 0,
            activeBookings: data.statistics?.activeBookings || 0,
            completedBookings: data.statistics?.completedBookings || 0,
            cancelledBookings: data.statistics?.cancelledBookings || 0,
            totalSpent: data.statistics?.totalSpent || 0,
            favouriteLabourCount: data.statistics?.favouriteLabourCount || 0,
            reliabilityScore: data.reliabilityScore || 0,
            rating: data.rating || 0,
            reviewsReceived: data.reviewsReceived || 0,
            cancellationRate: data.cancellationRate || 0,
            isVerified: data.isVerified || false,
            profileImage: data.profileImage || ''
          });

          // Calculate profile completion percentage
          const fieldsToCheck = ['name', 'email', 'phone', 'username', 'gender', 'dateOfBirth', 'address', 'profileImage'];
          let filledFields = 0;
          fieldsToCheck.forEach(field => {
            if (data[field] && data[field].toString().trim() !== '') {
              filledFields++;
            }
          });
          setProfileCompletion(Math.round((filledFields / fieldsToCheck.length) * 100));
        }
      } catch (e) {
        console.error('Error fetching stats', e);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {profileCompletion < 100 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-brand-amber/10 dark:to-orange-500/10 border border-brand-amber/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-full shadow-sm">
              <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
                <path className="text-gray-200 dark:text-zinc-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-brand-amber transition-all duration-1000 ease-out" strokeDasharray={`${profileCompletion}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="text-xs font-bold text-gray-800 dark:text-white absolute">{profileCompletion}%</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Profile Incomplete</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Complete your profile to build trust and get better service.</p>
            </div>
          </div>
          <button onClick={() => { setSettingsExpandedSection('profile'); setActiveTab('settings'); }} className="w-full sm:w-auto whitespace-nowrap px-6 py-2.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl text-sm transition-colors shadow-md">
            Complete Profile
          </button>
        </div>
      )}

      <div className="bg-gradient-to-br from-brand-navy to-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-brand-amber text-brand-navy flex items-center justify-center text-4xl font-black border-4 border-white/10 shadow-lg overflow-hidden">
            {stats.profileImage ? (
              <img src={stats.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              userName ? userName.charAt(0).toUpperCase() : 'C'
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tight">{userName}</h1>
              {stats.isVerified && (
                <span className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            {userHandle && <p className="text-brand-amber font-medium text-sm mb-2 opacity-90">@{userHandle}</p>}
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-brand-amber" />
              <span className="font-medium text-sm">{location}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
            <Star className="w-4 h-4 text-brand-amber fill-brand-amber" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Rating</span>
              <span className="font-bold text-sm text-white">{stats.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-xl">📦</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Completed Bookings</span>
              <span className="font-bold text-sm text-white">{stats.completedBookings}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-xl">💰</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Total Spent</span>
              <span className="font-bold text-sm text-white">₹{stats.totalSpent.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-xl">📈</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Reliability</span>
              <span className="font-bold text-sm text-white">{stats.reliabilityScore}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
            <span className="text-xl">❤️</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Favourite Workers</span>
              <span className="font-bold text-sm text-white">{stats.favouriteLabourCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-zinc-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="What service do you need?" className="w-full bg-transparent border-none pl-12 pr-4 py-3 focus:ring-0 text-gray-900 dark:text-white" />
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-zinc-700"></div>
        <button className="p-3 text-gray-400 hover:text-brand-amber transition-colors rounded-xl"><Mic className="w-5 h-5" /></button>
        <button onClick={() => setActiveTab('search')} className="bg-brand-amber hover:bg-brand-orange text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all">Search</button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: BookOpen, label: 'Book Labour', color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', action: () => setActiveTab('search') },
            { icon: ShieldAlert, label: 'SOS Support', color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-500/10', action: () => setActiveTab('support') },
            { icon: History, label: 'Book Again', color: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-500/10', action: () => setActiveTab('history') },
            { icon: IndianRupee, label: 'Wallet', color: 'bg-brand-amber', bg: 'bg-amber-50 dark:bg-brand-amber/10', action: () => setActiveTab('wallet') },
            { icon: ClipboardList, label: 'Post Job', color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', action: () => setActiveTab('marketplace') },
          ].map((action, i) => (
            <button key={i} onClick={action.action} className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 ${action.bg} hover:shadow-md transition-all group`}>
              <div className={`${action.color} text-white p-3 rounded-xl mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity & Booking Statistics</h2>
          <button onClick={() => setActiveTab('history')} className="text-sm font-bold text-brand-amber hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Bookings</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalBookings}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
            <p className="text-sm text-gray-500 font-semibold mb-1">Completed Jobs</p>
            <p className="text-3xl font-black text-green-500">{stats.completedBookings}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Spent</p>
            <p className="text-3xl font-black text-blue-500">₹{stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
            <p className="text-sm text-gray-500 font-semibold mb-1">Reliability Score</p>
            <p className="text-3xl font-black text-brand-amber">{stats.reliabilityScore}%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Active</p>
            <p className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">{stats.activeBookings}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl text-center">
            <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Cancelled</p>
            <p className="text-xl font-black text-red-700 dark:text-red-300 mt-1">{stats.cancelledBookings}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-500/10 p-4 rounded-xl text-center cursor-pointer hover:opacity-90" onClick={() => setActiveTab('favourites')}>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase flex items-center justify-center gap-1"><Heart className="w-3 h-3" /> Favourites</p>
            <p className="text-xl font-black text-purple-700 dark:text-purple-300 mt-1">{stats.favouriteLabourCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ... Additional smaller stub components ...
function SearchTab({ kycStatus, setShowBookingKYC }: { kycStatus?: string, setShowBookingKYC?: (v: boolean) => void }) {
  return <SearchDiscovery kycStatus={kycStatus} setShowBookingKYC={setShowBookingKYC} />;
}

function MarketplaceTab({ kycStatus, setShowBookingKYC }: { kycStatus?: string, setShowBookingKYC?: (v: boolean) => void }) {
  return <PostRequirement kycStatus={kycStatus} setShowBookingKYC={setShowBookingKYC} />;
}

function LiveBookingTab() {
  return <LiveBookingTracker />;
}

function HistoryTab() {
  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking History</h2>
        <p className="text-sm text-gray-500 mt-1">Manage and view your previous, active, cancelled, and completed bookings.</p>
      </div>
      <BookingHistory />
    </div>
  );
}
function FavouritesTab({ kycStatus, setShowBookingKYC }: { kycStatus?: string, setShowBookingKYC?: (v: boolean) => void }) {
  return <FavouriteWorkers kycStatus={kycStatus} setShowBookingKYC={setShowBookingKYC} />;
}

function ReviewsTab() {
  return <RatingsReviews />;
}

function ChatTab() {
  return (
    <div className="h-screen w-full flex flex-col">
      <ChatCenter />
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
        <div className="flex gap-2">
          <select className="text-sm p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white"><option>All</option><option>Unread</option><option>Bookings</option><option>Promotions</option></select>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 divide-y divide-gray-100 dark:divide-zinc-700">
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0"><Navigation className="w-5 h-5" /></div>
          <div><h4 className="font-bold text-sm dark:text-white">Worker Arrived</h4><p className="text-xs text-gray-500 mt-1">Ramesh Kumar has arrived at your location.</p><p className="text-[10px] text-gray-400 mt-2">Just now</p></div>
        </div>
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors flex gap-4 opacity-70">
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center shrink-0"><Gift className="w-5 h-5" /></div>
          <div><h4 className="font-bold text-sm dark:text-white">Promo Code Inside!</h4><p className="text-xs text-gray-500 mt-1">Get 20% off on your next booking using code FESTIVAL20.</p><p className="text-[10px] text-gray-400 mt-2">2 hours ago</p></div>
        </div>
      </div>
    </div>
  );
}

function WalletTab() {
  return <CustomerWallet />;
}

function AddressesTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 font-bold rounded-xl text-sm transition-colors shadow-sm">
            <Navigation className="w-4 h-4" /> Use Current Location
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Home Address */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border-2 border-brand-amber relative group">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-500 hover:text-brand-amber rounded-lg"><Settings className="w-4 h-4" /></button>
            <button className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:text-red-600 rounded-lg"><XCircle className="w-4 h-4" /></button>
          </div>
          <span className="text-xs font-black bg-brand-amber text-white px-3 py-1 rounded-full flex items-center gap-1 w-max mb-4 shadow-sm">
            <MapPin className="w-3 h-3" /> HOME
          </span>
          <p className="font-bold text-gray-900 dark:text-white text-lg">Flat 402, Block A</p>
          <p className="text-sm text-gray-500 mt-1">Green Valley Apartments, Near City Center</p>
          <p className="text-sm text-gray-500">New Delhi, Delhi, 110001</p>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700 flex justify-between items-center text-xs text-gray-400">
            <span>Primary Address</span>
            <span className="text-brand-amber font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selected</span>
          </div>
        </div>

        {/* Office Address */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 relative group hover:border-blue-400 transition-colors cursor-pointer">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-500 hover:text-blue-500 rounded-lg"><Settings className="w-4 h-4" /></button>
            <button className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:text-red-600 rounded-lg"><XCircle className="w-4 h-4" /></button>
          </div>
          <span className="text-xs font-black bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full flex items-center gap-1 w-max mb-4">
            <Briefcase className="w-3 h-3" /> OFFICE
          </span>
          <p className="font-bold text-gray-900 dark:text-white text-lg">Tech Hub Tower</p>
          <p className="text-sm text-gray-500 mt-1">12th Floor, Phase 3, Cyber City</p>
          <p className="text-sm text-gray-500">Gurugram, Haryana, 122001</p>
        </div>

        {/* Site Address */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 relative group hover:border-purple-400 transition-colors cursor-pointer">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-500 hover:text-purple-500 rounded-lg"><Settings className="w-4 h-4" /></button>
            <button className="p-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:text-red-600 rounded-lg"><XCircle className="w-4 h-4" /></button>
          </div>
          <span className="text-xs font-black bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full flex items-center gap-1 w-max mb-4">
            <AlertOctagon className="w-3 h-3" /> SITE
          </span>
          <p className="font-bold text-gray-900 dark:text-white text-lg">New Villa Construction</p>
          <p className="text-sm text-gray-500 mt-1">Plot 45, Sector 128, Taj Expressway</p>
          <p className="text-sm text-gray-500">Noida, Uttar Pradesh, 201304</p>
        </div>
      </div>
    </div>
  );
}

function RewardsTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rewards & Referrals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
          <Gift className="w-8 h-8 mb-4 opacity-80" />
          <h3 className="font-bold text-xl mb-1">Refer a Friend</h3>
          <p className="text-sm opacity-90 mb-4">Earn ₹100 for every friend who books their first service.</p>
          <div className="flex gap-2 bg-black/20 p-2 rounded-xl">
            <input type="text" readOnly value="RZG-REF-2026" className="bg-transparent border-none text-center font-mono w-full outline-none" />
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 flex flex-col justify-center items-center text-center">
          <Star className="w-12 h-12 text-brand-amber fill-brand-amber mb-2" />
          <h3 className="font-bold text-2xl dark:text-white">450 <span className="text-sm text-gray-500">Points</span></h3>
          <p className="text-sm text-gray-500 mt-2">Redeem points for discounts on your next booking.</p>
          <button className="mt-4 text-brand-amber font-bold text-sm underline">View Coupons</button>
        </div>
      </div>
    </div>
  );
}

function SupportTab() {
  const [subTab, setSubTab] = useState('sos');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support & Safety</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage emergencies, complaints, and general support tickets.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-3 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700">
          <div className="flex flex-col items-center px-3 border-r border-gray-100 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-gray-400">Complaints</span>
            <span className="font-black text-gray-900 dark:text-white flex items-center gap-1"><AlertOctagon className="w-3 h-3 text-red-500"/> 3</span>
          </div>
          <div className="flex flex-col items-center px-3 border-r border-gray-100 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-gray-400">Tickets</span>
            <span className="font-black text-gray-900 dark:text-white flex items-center gap-1"><Ticket className="w-3 h-3 text-blue-500"/> 8</span>
          </div>
          <div className="flex flex-col items-center px-3 border-r border-gray-100 dark:border-zinc-700">
            <span className="text-[10px] uppercase font-bold text-gray-400">Resolved</span>
            <span className="font-black text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> 9</span>
          </div>
          <div className="flex flex-col items-center px-3">
            <span className="text-[10px] uppercase font-bold text-gray-400">Pending</span>
            <span className="font-black text-amber-500 flex items-center gap-1"><Clock className="w-3 h-3"/> 2</span>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
        <button onClick={() => setSubTab('sos')} className={`font-semibold pb-2 border-b-2 transition-all ${subTab === 'sos' ? 'border-red-500 text-red-600 dark:text-red-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Safety & SOS</button>
        <button onClick={() => setSubTab('contacts')} className={`font-semibold pb-2 border-b-2 transition-all ${subTab === 'contacts' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Emergency Contacts</button>
        <button onClick={() => setSubTab('complaints')} className={`font-semibold pb-2 border-b-2 transition-all ${subTab === 'complaints' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Complaint History</button>
        <button onClick={() => setSubTab('tickets')} className={`font-semibold pb-2 border-b-2 transition-all ${subTab === 'tickets' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Support Tickets</button>
      </div>

      <div className="pb-8">

        {/* Safety & SOS View */}
        {subTab === 'sos' && (
          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-500/10 border-2 border-red-500/50 p-8 rounded-3xl shadow-sm text-center max-w-2xl mx-auto mt-4">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner cursor-pointer hover:scale-105 transition-transform active:scale-95">
                <AlertOctagon className="w-12 h-12 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-black text-2xl text-red-600 dark:text-red-400 mb-2 tracking-tight">EMERGENCY SOS</h3>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-8 max-w-md mx-auto">
                Pressing this will instantly alert your emergency contacts, share your live location, and notify our rapid response team. Use only in genuine emergencies.
              </p>
              <button className="w-full sm:w-auto px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-red-500/30 transition-all uppercase tracking-widest">
                TRIGGER SOS
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"><h3 className="font-bold dark:text-white">SOS Trigger History</h3></div>
              <div className="p-8 text-center text-gray-500">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3 opacity-50" />
                <p>No SOS history found. You are safe!</p>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contacts View */}
        {subTab === 'contacts' && (
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Trusted Contacts</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-amber text-white font-bold rounded-lg text-sm"><Plus className="w-4 h-4" /> Add Contact</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">M</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Mom</h4>
                    <p className="text-sm text-gray-500">+91 98765 43210</p>
                    <span className="text-[10px] uppercase font-bold text-brand-amber mt-1 inline-block bg-brand-amber/10 px-2 py-0.5 rounded">Primary Alert</span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><XCircle className="w-5 h-5" /></button>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 flex justify-between items-center border-dashed">
                <div className="flex items-center justify-center w-full py-4 text-gray-400 hover:text-brand-amber cursor-pointer transition-colors group">
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-sm">Add Secondary Contact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaints View */}
        {subTab === 'complaints' && (
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center bg-purple-50 dark:bg-purple-500/10 p-4 rounded-xl border border-purple-100 dark:border-purple-500/20">
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-300">Complaint History</h3>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Track serious reports against fraud, bad behavior, or poor work quality. (Affects Trust Score)</p>
              </div>
              <button className="text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2"><AlertOctagon className="w-4 h-4"/> File Complaint</button>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden divide-y divide-gray-100 dark:divide-zinc-700">
              
              {/* Complaint 1 */}
              <div className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded">#CMP1025</span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded uppercase">Priority: High</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Issue: Labour did not arrive</h4>
                    <p className="text-sm text-gray-500 mt-1">Booking ID: <span className="font-medium text-blue-600 dark:text-blue-400">RZH-45211</span></p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full uppercase flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Under Review</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-100 dark:border-zinc-800">
                  Worker accepted the booking but never showed up at the location. They stopped answering calls after 10 AM.
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 dark:border-zinc-700 pt-4">
                  <span className="flex items-center gap-1"><Paperclip className="w-3 h-3"/> 2 Attachments (Call logs)</span>
                  <span>Date: 20 May 2026</span>
                </div>
              </div>

              {/* Complaint 2 */}
              <div className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors opacity-75">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded">#CMP1026</span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded uppercase">Priority: Medium</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Issue: Wrong service provided</h4>
                    <p className="text-sm text-gray-500 mt-1">Booking ID: <span className="font-medium text-blue-600 dark:text-blue-400">RZH-41908</span></p>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full uppercase flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Resolved</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-100 dark:border-zinc-700 pt-4 mt-4">
                  <span className="flex items-center gap-1"><Paperclip className="w-3 h-3"/> 3 Images Uploaded</span>
                  <span>Date: 12 May 2026</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tickets View */}
        {subTab === 'tickets' && (
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20">
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300">Support Tickets</h3>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">General help requests regarding payments, technical issues, or wallet queries.</p>
              </div>
              <button className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Create Ticket</button>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden divide-y divide-gray-100 dark:divide-zinc-700">
              
              {/* Ticket 1 */}
              <div className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">Category: Payment</span>
                      <span className="text-[10px] text-gray-400 font-mono">#TKT1002</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Subject: Refund not received</h4>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded uppercase">In Progress</span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-1">I cancelled the booking RZH-45210 yesterday, but ₹350 is not yet showing in my wallet.</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center gap-1 text-blue-500 font-semibold"><MessageSquare className="w-3 h-3"/> 1 New Reply</span>
                  <span>Created: 21 May 2026</span>
                </div>
              </div>

              {/* Ticket 2 */}
              <div className="p-5 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors opacity-75">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded">Category: Technical</span>
                      <span className="text-[10px] text-gray-400 font-mono">#TKT1003</span>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Subject: Login issue</h4>
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded uppercase">Resolved</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                  <span>No new messages</span>
                  <span>Resolved: 19 May 2026</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function VerificationTab() {
  const [profile, setProfile] = useState<any>(null);
  const [showKYCModal, setShowKYCModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5002/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        console.error('Error fetching profile', e);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const isVerified = profile.isVerified;
  const kycStatus = profile.kycStatus || 'unverified';
  const trustScore = profile.trustScore || 0;
  const reliabilityScore = profile.reliabilityScore || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Verification & Trust Hub</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 max-w-3xl">RozgaarHub ensures safety by verifying both workers AND customers. Build your trust profile to get faster responses.</p>
      </div>

      {/* Profile Overview Header */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-amber/20 flex items-center justify-center text-brand-amber font-bold text-2xl overflow-hidden shrink-0 shadow-sm border border-brand-amber/30">
            {profile.profileImage ? <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" /> : profile.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-900 dark:text-white flex items-center gap-2">
              {profile.name}
              {isVerified && <span className="flex items-center gap-1 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              Customer Account
              <span className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300"><Star className="w-3 h-3 text-brand-amber fill-brand-amber" /> {profile.rating || 0}</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
          <div><p className="text-xs text-gray-400 font-bold uppercase">Completed Jobs</p><p className="font-black text-xl dark:text-white">{profile.statistics?.completedBookings || 0}</p></div>
          <div><p className="text-xs text-gray-400 font-bold uppercase">Cancellation</p><p className="font-black text-xl dark:text-white">{profile.cancellationRate || 0}%</p></div>
          <div><p className="text-xs text-gray-400 font-bold uppercase">Trust Score</p><p className="font-black text-xl text-green-500">{trustScore}/100</p></div>
          <div><p className="text-xs text-gray-400 font-bold uppercase">Reliability</p><p className="font-black text-xl text-blue-500">{reliabilityScore}%</p></div>
        </div>
      </div>

      {/* KYC Status Section */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-700">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">KYC Status</h3>
        
        {kycStatus === 'unverified' && (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex gap-4">
                <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-700 dark:text-blue-400 text-lg">Action Required: Complete KYC</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1 max-w-xl">You must complete your verification to get the Trusted Customer Badge and unlock unrestricted bookings.</p>
                </div>
              </div>
              <button onClick={() => setShowKYCModal(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all whitespace-nowrap">
                Start KYC Verification
              </button>
            </div>
          </div>
        )}

        {kycStatus === 'pending' && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex gap-4 relative z-10">
              <Clock className="w-8 h-8 text-amber-500 shrink-0 animate-pulse" />
              <div>
                <h4 className="font-bold text-amber-700 dark:text-amber-500 text-lg flex items-center gap-2">Pending ⏳</h4>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">Your documents are under review by our admin team.</p>
                <div className="mt-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                  <p className="font-bold text-xs text-amber-800 dark:text-amber-300 uppercase mb-2">Current Restrictions:</p>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                    <li>Limited to basic bookings</li>
                    <li>Wallet withdrawals are blocked</li>
                    <li>Some premium features disabled</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {kycStatus === 'approved' && (
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex gap-4 relative z-10">
              <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
              <div>
                <h4 className="font-bold text-green-700 dark:text-green-500 text-lg">Approved ✅</h4>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">Aadhaar and selfie verification matched successfully.</p>
                <div className="mt-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                  <p className="font-bold text-xs text-green-800 dark:text-green-300 uppercase mb-2">Benefits Unlocked:</p>
                  <ul className="text-sm text-green-700 dark:text-green-400 space-y-1 list-disc list-inside">
                    <li>Full platform access</li>
                    <li>Trusted Customer Badge awarded</li>
                    <li>Higher worker acceptance rate and better visibility</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {kycStatus === 'rejected' && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex gap-4 relative z-10">
              <XCircle className="w-8 h-8 text-red-500 shrink-0" />
              <div>
                <h4 className="font-bold text-red-700 dark:text-red-500 text-lg">Rejected ❌</h4>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-semibold">Reason: Aadhaar image unclear or details mismatch.</p>
                <p className="text-sm text-red-500 dark:text-red-400/80 mt-1">Your documents were rejected during admin review.</p>
                <button onClick={() => setShowKYCModal(true)} className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-sm transition-colors">
                  Re-upload Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KYC Modal */}
      {showKYCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-brand-amber"/> Customer KYC Verification</h2>
                <p className="text-sm text-gray-500 mt-1">Upload mandatory documents to verify your identity.</p>
              </div>
              <button onClick={() => setShowKYCModal(false)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X className="w-6 h-6"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50 dark:bg-zinc-900/30">
              
              {/* Mandatory Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Mandatory Requirements</h3>
                <div className="space-y-4">
                  {/* Phone Verification */}
                  <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500"><Phone className="w-5 h-5"/></div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">Phone Verification (OTP)</p>
                        <p className="text-xs text-gray-500">{profile.phone || '+91 ******'}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full uppercase"><Check className="w-3 h-3"/> Verified</span>
                  </div>

                  {/* Aadhaar Upload */}
                  <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 relative overflow-hidden group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 mt-1 shrink-0"><FileText className="w-5 h-5"/></div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Aadhaar Card <span className="text-red-500">*</span></p>
                          <p className="text-xs text-gray-500 mt-1">Upload front and back images or PDF.</p>
                          <p className="text-[10px] text-blue-500 font-semibold mt-1 bg-blue-50 dark:bg-blue-500/10 inline-block px-2 py-0.5 rounded">JPG, PNG (Max 1MB) | PDF (Max 3MB)</p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-sm transition-colors cursor-pointer border border-gray-200 dark:border-zinc-600">
                          <UploadCloud className="w-4 h-4"/> Upload
                          <input type="file" className="hidden" accept=".jpg,.png,.pdf"/>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Selfie Upload */}
                  <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500 mt-1 shrink-0"><Camera className="w-5 h-5"/></div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">Selfie Verification <span className="text-red-500">*</span></p>
                          <p className="text-xs text-gray-500 mt-1">Take a clear selfie in a well-lit room.</p>
                          <p className="text-[10px] text-purple-500 font-semibold mt-1 bg-purple-50 dark:bg-purple-500/10 inline-block px-2 py-0.5 rounded">Used for AI Face Match with ID</p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-sm transition-colors cursor-pointer border border-gray-200 dark:border-zinc-600">
                          <Camera className="w-4 h-4"/> Take Photo
                          <input type="file" accept="image/*" capture="user" className="hidden"/>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Optional Documents (Choose Any)</h3>
                <div className="bg-white dark:bg-zinc-800 p-1 rounded-2xl border border-gray-200 dark:border-zinc-700 divide-y divide-gray-100 dark:divide-zinc-700">
                  {['PAN Card', 'Driving License', 'Passport', 'Voter ID'].map((doc) => (
                    <div key={doc} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400"/>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{doc}</span>
                      </div>
                      <label className="text-xs font-bold text-brand-amber cursor-pointer hover:underline">Upload <input type="file" className="hidden" accept=".jpg,.png,.pdf"/></label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Warning */}
              <div className="bg-blue-50 dark:bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-xl">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0"/>
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Automated System Validations</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Your documents will be checked for: <strong>File type & Size limits</strong>. Our AI performs <strong>OCR extraction</strong> (Name, DOB, Aadhaar No, Address) and <strong>Face Match</strong> (Selfie ↔ ID Face) for instant processing.</p>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end gap-3">
              <button onClick={() => setShowKYCModal(false)} className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">Cancel</button>
              <button className="px-8 py-2.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl shadow-md transition-all">Submit Documents</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trust Score Section */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-700 flex flex-col hover:border-green-400 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Trust Score</h3>
              <p className="text-xs text-gray-500 mt-0.5">Measures how genuine your profile is</p>
            </div>
            <div className="text-4xl font-black text-green-500">{trustScore}<span className="text-lg text-gray-400 font-bold">/100</span></div>
          </div>
          
          <div className="bg-gray-50 dark:bg-zinc-900/50 p-5 rounded-2xl flex-1 border border-gray-100 dark:border-zinc-700/50">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase mb-3 flex items-center gap-1"><Plus className="w-3 h-3"/> Positive Factors</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex justify-between items-center"><span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500"/> Verified Account</span><span className="text-green-500 font-bold">+20</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-1"><History className="w-3 h-3 text-green-500"/> Completed Jobs</span><span className="text-green-500 font-bold">+15</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-1"><Star className="w-3 h-3 text-green-500"/> Good Ratings</span><span className="text-green-500 font-bold">+20</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-green-500"/> Low Complaints</span><span className="text-green-500 font-bold">+15</span></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase mb-3 flex items-center gap-1"><Minus className="w-3 h-3"/> Negative Factors</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex justify-between items-center"><span className="flex items-center gap-1"><AlertOctagon className="w-3 h-3 text-red-500"/> Fake Complaints</span><span className="text-red-500 font-bold">−15</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-500"/> Spam Activity</span><span className="text-red-500 font-bold">−25</span></li>
                  <li className="flex justify-between items-center"><span className="flex items-center gap-1"><Wallet className="w-3 h-3 text-red-500"/> Wallet Defaults</span><span className="text-red-500 font-bold">−20</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reliability Score Section */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-zinc-700 flex flex-col hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Reliability Score</h3>
              <p className="text-xs text-gray-500 mt-0.5">Measures booking consistency</p>
            </div>
            <div className="text-4xl font-black text-blue-500">{reliabilityScore}<span className="text-lg text-gray-400 font-bold">%</span></div>
          </div>
          
          <div className="bg-gray-50 dark:bg-zinc-900/50 p-5 rounded-2xl flex-1 border border-gray-100 dark:border-zinc-700/50">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-3 flex items-center gap-1"><Plus className="w-3 h-3"/> Positive Behaviors</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex justify-between items-center"><span>Job Completed</span><span className="text-blue-500 font-bold">↗</span></li>
                  <li className="flex justify-between items-center"><span>On-time Payment</span><span className="text-blue-500 font-bold">↗</span></li>
                  <li className="flex justify-between items-center"><span>No Complaints</span><span className="text-blue-500 font-bold">↗</span></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase mb-3 flex items-center gap-1"><Minus className="w-3 h-3"/> Negative Behaviors</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex justify-between items-center"><span>Frequent Cancels</span><span className="text-amber-500 font-bold">↘</span></li>
                  <li className="flex justify-between items-center"><span>No-Show Behavior</span><span className="text-amber-500 font-bold">↘</span></li>
                  <li className="flex justify-between items-center"><span>Late Response</span><span className="text-amber-500 font-bold">↘</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function SettingsTab({ defaultExpanded = null }: { defaultExpanded?: string | null }) {
  const [expanded, setExpanded] = useState<string | null>(defaultExpanded);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', username: '', gender: '', dateOfBirth: '', language: 'en', profileImage: '', address: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5002/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            username: data.username || '',
            gender: data.gender || '',
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
            language: data.language || 'en',
            profileImage: data.profileImage || '',
            address: data.address || ''
          });
        }
      } catch (e) {
        console.error('Error fetching profile', e);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5002/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        const data = await res.json();
        // Update local storage email if it changed
        localStorage.setItem('user_email', data.email);
      } else {
        alert('Failed to update profile.');
      }
    } catch (e) {
      alert('Error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (section: string) => {
    setExpanded(prev => prev === section ? null : section);
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-300 z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">Profile updated successfully!</span>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 divide-y divide-gray-100 dark:divide-zinc-700">

        <div className="flex flex-col">
          <div onClick={() => toggleExpand('profile')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Profile Settings</h4><p className="text-xs text-gray-500 mt-1">Update your name, email, and phone</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'profile' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'profile' && (
            <div className="p-6 pt-0 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
              <form className="space-y-4 mt-4" onSubmit={handleProfileSave}>
                <div className="flex items-center gap-4 mb-4">
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoChange} />
                  <div
                    className="w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-gray-500 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handlePhotoClick}
                  >
                    {profile.profileImage ? <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
                  </div>
                  <button type="button" onClick={handlePhotoClick} className="text-sm font-semibold text-brand-amber hover:underline">Change Photo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-600 dark:text-zinc-400">Full Name</label><input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" required /></div>
                  <div><label className="text-sm text-gray-600 dark:text-zinc-400">Username <span className="text-[10px] text-gray-400 ml-1">(Cannot be changed)</span></label><input type="text" value={profile.username} readOnly className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-700 text-gray-500 cursor-not-allowed" placeholder="e.g. jdoe123" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-600 dark:text-zinc-400">Email Address <span className="text-[10px] text-gray-400 ml-1">(Cannot be changed)</span></label><input type="email" value={profile.email} readOnly className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-700 text-gray-500 cursor-not-allowed" required /></div>
                  <div><label className="text-sm text-gray-600 dark:text-zinc-400">Phone Number</label><input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" required /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-600 dark:text-zinc-400">Gender</label><select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })} className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white"><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option></select></div>
                  <div><label className="text-sm text-gray-600 dark:text-zinc-400">Date of Birth</label><input type="date" value={profile.dateOfBirth} onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })} className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" /></div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div><label className="text-sm text-gray-600 dark:text-zinc-400">Address</label><input type="text" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 dark:text-white" placeholder="e.g. Flat 402, Block A, Green Valley" /></div>
                </div>
                <button type="submit" disabled={isLoading} className="px-4 py-2 mt-4 bg-brand-amber text-white font-bold rounded-lg text-sm disabled:opacity-50">{isLoading ? 'Saving...' : 'Save Changes'}</button>
              </form>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div onClick={() => toggleExpand('language')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Language Preferences</h4><p className="text-xs text-gray-500 mt-1">English / Hindi</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'language' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'language' && (
            <div className="p-6 pt-0 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
              <div className="flex gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="lang" value="en" checked={profile.language === 'en'} onChange={e => setProfile({ ...profile, language: e.target.value })} className="text-brand-amber focus:ring-brand-amber" /> <span className="text-sm dark:text-white">English</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="lang" value="hi" checked={profile.language === 'hi'} onChange={e => setProfile({ ...profile, language: e.target.value })} className="text-brand-amber focus:ring-brand-amber" /> <span className="text-sm dark:text-white">Hindi (हिंदी)</span></label>
              </div>
              <button type="button" onClick={handleProfileSave} disabled={isLoading} className="mt-4 px-4 py-2 bg-brand-amber text-white font-bold rounded-lg text-sm disabled:opacity-50">{isLoading ? 'Saving...' : 'Update Language'}</button>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div onClick={() => toggleExpand('notifications')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold dark:text-white text-sm">Notification Preferences</h4><p className="text-xs text-gray-500 mt-1">Push, Email, and SMS alerts</p></div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded === 'notifications' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'notifications' && (
            <div className="p-6 pt-0 border-t border-gray-100 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
              <div className="space-y-4 mt-4">
                
                {/* Booking Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Booking Notifications</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Alerts for booking status, arrivals, and completion.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
                  </label>
                </div>

                {/* Chat Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Chat Notifications</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Messages and calls from service providers.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
                  </label>
                </div>

                {/* Promotions Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Promotions Notifications</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Exclusive discounts, offers, and seasonal deals.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
                  </label>
                </div>

                {/* System Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">System Notifications</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Important updates, maintenance, and policy changes.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
                  </label>
                </div>

                {/* Reward Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Reward Notifications</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Points earned, wallet cashbacks, and referrals.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-brand-amber"></div>
                  </label>
                </div>

              </div>
              <button type="button" onClick={() => alert('Notification preferences saved!')} className="mt-4 px-4 py-2 bg-brand-amber text-white font-bold rounded-lg text-sm">Save Preferences</button>
            </div>
          )}
        </div>

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

        <div className="flex flex-col">
          <div onClick={() => toggleExpand('delete')} className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div><h4 className="font-bold text-red-500 text-sm">Account Deletion</h4><p className="text-xs text-red-500/70 mt-1">Permanently deactivate your account</p></div>
            <ChevronRight className={`w-5 h-5 text-red-300 transition-transform ${expanded === 'delete' ? 'rotate-90' : ''}`} />
          </div>
          {expanded === 'delete' && (
            <div className="p-6 pt-0 border-t border-gray-100 dark:border-zinc-700 bg-red-50 dark:bg-red-500/10">
              <div className="mt-4">
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-2">Are you absolutely sure?</p>
                <p className="text-xs text-red-500/80 mb-4">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
                <button type="button" onClick={() => alert('Account deletion requested.')} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-sm hover:bg-red-700">Yes, delete my account</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
