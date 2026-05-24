'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  category: 'Booking' | 'Chat' | 'Promotion';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationSettings {
  bookings: boolean;
  chats: boolean;
  promotions: boolean;
}

export default function NotificationCenter() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  // Settings state (saved in LocalStorage)
  const [settings, setSettings] = useState<NotificationSettings>({
    bookings: true,
    chats: true,
    promotions: true
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Filtering & Searching States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Booking' | 'Chat' | 'Promotion'>('All');
  const [readFilter, setReadFilter] = useState<'All' | 'Unread' | 'Read'>('All');
  
  // Simulator logs
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [isAlertActive, setIsAlertActive] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    // Load settings
    const savedSettings = localStorage.getItem('rozgaar_notif_settings');
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch (e) { console.error(e); }
    }

    // Load or set default notifications
    const savedNotifs = localStorage.getItem('rozgaar_notifs');
    if (savedNotifs) {
      try { setNotifications(JSON.parse(savedNotifs)); } catch (e) { console.error(e); }
    } else {
      const defaults: NotificationItem[] = [
        {
          id: 'NTF-101',
          category: 'Booking',
          title: 'Booking Approved 📅',
          message: 'Electrician Ramesh Kumar has approved your slot and is arriving in 15 minutes. OTP Code: 4091.',
          time: '10 mins ago',
          isRead: false
        },
        {
          id: 'NTF-102',
          category: 'Chat',
          title: 'New Message from Plumber Anil 💬',
          message: 'Anil sent: "Aapka pipe leakage kitchen ke side se hai ya washroom se?"',
          time: '35 mins ago',
          isRead: false
        },
        {
          id: 'NTF-103',
          category: 'Promotion',
          title: 'Special 20% Discount Offer 🏷️',
          message: 'Use promo code ROZGAAR20 on your next Painter booking. Valid till this weekend only!',
          time: '2 hours ago',
          isRead: true
        },
        {
          id: 'NTF-104',
          category: 'Booking',
          title: 'Refund Payout Complete 💰',
          message: 'Admin processed and credited ₹150 cancellation refund to your Rozgaar Wallet.',
          time: '1 day ago',
          isRead: true
        }
      ];
      setNotifications(defaults);
      localStorage.setItem('rozgaar_notifs', JSON.stringify(defaults));
    }
  }, []);

  // Save utility wrappers
  const saveNotifList = (updated: NotificationItem[]) => {
    setNotifications(updated);
    localStorage.setItem('rozgaar_notifs', JSON.stringify(updated));
  };

  const handleToggleSetting = (key: keyof NotificationSettings) => {
    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);
    localStorage.setItem('rozgaar_notif_settings', JSON.stringify(nextSettings));
    
    // Log action to simulators
    const status = nextSettings[key] ? 'ENABLED' : 'DISABLED';
    setSimLogs(prev => [`⚙️ Preferences updated: ${key.toUpperCase()} notifications are now ${status}`, ...prev.slice(0, 4)]);
  };

  // Notification Actions
  const handleToggleReadStatus = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n);
    saveNotifList(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    saveNotifList(updated);
    setIsAlertActive('🎉 All notifications marked as read.');
    setTimeout(() => setIsAlertActive(null), 2500);
  };

  const handleClearAll = () => {
    saveNotifList([]);
    setIsAlertActive('🗑️ All notifications cleared.');
    setTimeout(() => setIsAlertActive(null), 2500);
  };

  const handleDeleteNotif = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifList(updated);
  };

  // Simulated Notification Creators
  const simulateNotification = (cat: 'Booking' | 'Chat' | 'Promotion') => {
    // Check settings preference
    if (cat === 'Booking' && !settings.bookings) {
      alert('🚫 BOOKING BLOCKED: You have disabled Booking notifications in settings. Enable it first to receive.');
      return;
    }
    if (cat === 'Chat' && !settings.chats) {
      alert('🚫 CHAT BLOCKED: You have disabled Chat notifications in settings. Enable it first to receive.');
      return;
    }
    if (cat === 'Promotion' && !settings.promotions) {
      alert('🚫 PROMOTIONS BLOCKED: You have disabled Promotions notifications in settings. Enable it first to receive.');
      return;
    }

    // Generate mock details
    let title = '';
    let message = '';
    const id = 'NTF-' + Math.floor(100 + Math.random() * 900);

    if (cat === 'Booking') {
      title = 'OTP milestone validation 🔑';
      message = `OTP Milestone validated! Milestone 1 completed successfully for booking ${id}.`;
    } else if (cat === 'Chat') {
      title = 'Contractor message dispatch 💬';
      message = 'Contractor Ravi posted: "Team has successfully arrived at the construction coordinates."';
    } else {
      title = 'Labour Monsoon Bonanza! 🏷️';
      message = 'Get verified electrician visits at flat ₹149 rates. Grab it now!';
    }

    const newNotif: NotificationItem = {
      id,
      category: cat,
      title,
      message,
      time: 'Just now',
      isRead: false
    };

    const updated = [newNotif, ...notifications];
    saveNotifList(updated);
    setSimLogs(prev => [`✅ Received: [${cat.toUpperCase()}] ${title}`, ...prev.slice(0, 4)]);
    setIsAlertActive(`🔔 New ${cat} Notification: "${title}"`);
    setTimeout(() => setIsAlertActive(null), 3000);
  };

  // Filter & Search computation
  const filteredNotifs = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    
    let matchesRead = true;
    if (readFilter === 'Unread') matchesRead = !n.isRead;
    if (readFilter === 'Read') matchesRead = n.isRead;

    return matchesSearch && matchesCategory && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      
      {/* Toast Alert popup */}
      {isAlertActive && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-zinc-900/90 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-indigo-500/50 backdrop-blur-md z-[100] transition-all text-xs font-bold tracking-wide animate-bounce">
          {isAlertActive}
        </div>
      )}

      {/* Navigation Headers */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          {unreadCount > 0 && <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>}
          <span>In-App Notification Center</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <span>🔔 Notification Center</span>
                {unreadCount > 0 && (
                  <span className="text-xs bg-indigo-650 text-white font-extrabold px-3 py-1 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h1>
              <p className="text-xs text-gray-500 mt-1">Configure your alert preferences and manage platform notifications instantly.</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleMarkAllRead}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-indigo-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm border border-indigo-100 dark:border-zinc-750"
              >
                ✓ Mark All Read
              </button>
              <button 
                onClick={handleClearAll}
                className="bg-red-50 hover:bg-red-105 text-red-650 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm border border-red-100 dark:border-zinc-750"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Main Workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: SETTINGS & SIMULATORS (1 Col) */}
          <div className="space-y-8">
            
            {/* IN-APP ALERTS SETTINGS DECK */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-150 dark:border-zinc-800/80">
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-850 pb-4 mb-4">
                ⚙️ In-App Alert Preferences
              </h3>
              
              <div className="space-y-4">
                
                {/* Booking settings */}
                <div className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">📅 Booking Status Updates</h4>
                    <p className="text-[10px] text-gray-400">Milestone codes, OTP checks, job assignment alerts.</p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('bookings')}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 ${
                      settings.bookings ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-800'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 transform ${
                      settings.bookings ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>

                {/* Chat settings */}
                <div className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">💬 Live Chat Messages</h4>
                    <p className="text-[10px] text-gray-400">New message updates from worker/customer portals.</p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('chats')}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 ${
                      settings.chats ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-800'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 transform ${
                      settings.chats ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>

                {/* Promo settings */}
                <div className="flex justify-between items-center p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">🏷️ Surcharges & Discounts</h4>
                    <p className="text-[10px] text-gray-400">Promotions, platform waivers, and monsoon coupon codes.</p>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('promotions')}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-300 ${
                      settings.promotions ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-800'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform duration-300 transform ${
                      settings.promotions ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>

              </div>
            </div>

            {/* SIMULATION GENERATOR PANEL */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">🧪 Notification Dispatch Simulator</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Fire simulated pushes to test settings blocking and filtering logic.</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => simulateNotification('Booking')}
                  className="bg-blue-500 text-white font-bold text-[10px] py-2 rounded-xl transition-all shadow-sm"
                >
                  + Booking
                </button>
                <button
                  onClick={() => simulateNotification('Chat')}
                  className="bg-purple-500 text-white font-bold text-[10px] py-2 rounded-xl transition-all shadow-sm"
                >
                  + Chat Msg
                </button>
                <button
                  onClick={() => simulateNotification('Promotion')}
                  className="bg-amber-500 text-white font-bold text-[10px] py-2 rounded-xl transition-all shadow-sm"
                >
                  + Coupon
                </button>
              </div>

              <div className="bg-zinc-950 p-4 rounded-2xl font-mono text-[9px] text-green-400 min-h-[120px] shadow-inner space-y-1">
                <p className="text-white border-b border-zinc-800 pb-1 mb-1">🤖 Notification Telemetry Streams:</p>
                {simLogs.length === 0 ? (
                  <p className="text-zinc-600">Waiting for simulated notification actions...</p>
                ) : (
                  simLogs.map((log, idx) => <p key={idx}>{log}</p>)
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: NOTIFICATION CENTER CONTROLS & LOGS (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* FILTERS & SEARCH CONSOLE */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search notification titles or keywords..."
                  className="w-full bg-gray-50 dark:bg-zinc-950 text-xs rounded-xl border border-gray-300 dark:border-zinc-700 px-4 py-3 text-gray-900 dark:text-white outline-none pl-10"
                />
                <span className="absolute left-3.5 top-3.5 text-gray-400 text-sm">🔍</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                
                {/* Category Filters */}
                <div className="flex gap-1.5 flex-wrap">
                  {(['All', 'Booking', 'Chat', 'Promotion'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow shadow-indigo-500/25'
                          : 'bg-gray-100 dark:bg-zinc-850 text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      {cat === 'All' ? '📂 Show All' : cat === 'Booking' ? '📅 Bookings' : cat === 'Chat' ? '💬 Chats' : '🏷️ Promos'}
                    </button>
                  ))}
                </div>

                {/* Read / Unread toggle */}
                <div className="flex gap-1">
                  {(['All', 'Unread', 'Read'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setReadFilter(status)}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-md transition-all ${
                        readFilter === status
                          ? 'bg-zinc-850 dark:bg-white text-white dark:text-zinc-900'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                      }`}
                    >
                      {status === 'All' ? 'All Alerts' : status === 'Unread' ? 'Unread Only' : 'Read Only'}
                    </button>
                  ))}
                </div>

              </div>

            </div>

            {/* NOTIFICATION ITERATION LIST */}
            <div className="space-y-3">
              {filteredNotifs.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-gray-150 dark:border-zinc-800/80 shadow-md">
                  <span className="text-4xl">📭</span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-3">No notifications found</h3>
                  <p className="text-xs text-gray-500 mt-1">Try clearing your filters, adjusting search queries, or simulating new pushes.</p>
                </div>
              ) : (
                filteredNotifs.map(notif => {
                  const borderAccent = 
                    notif.category === 'Booking' ? 'border-l-[6px] border-blue-500' :
                    notif.category === 'Chat' ? 'border-l-[6px] border-purple-500' : 
                    'border-l-[6px] border-amber-500';
                  
                  return (
                    <div 
                      key={notif.id}
                      className={`bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-gray-150 dark:border-zinc-800/80 flex justify-between items-start gap-4 transition-all hover:shadow-md ${borderAccent} ${
                        !notif.isRead ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                      }`}
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => handleToggleReadStatus(notif.id)}>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            notif.category === 'Booking' ? 'bg-blue-100 text-blue-800' :
                            notif.category === 'Chat' ? 'bg-purple-100 text-purple-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {notif.category}
                          </span>
                          
                          <span className="text-[10px] text-gray-400">{notif.time}</span>
                          
                          {!notif.isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                          )}
                        </div>

                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-2 flex items-center gap-1.5">
                          {notif.title}
                          {!notif.isRead && <span className="text-[9px] text-indigo-650 dark:text-indigo-400 font-bold">(Unread)</span>}
                        </h4>
                        
                        <p className="text-xs text-gray-600 dark:text-zinc-300 mt-1">{notif.message}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleReadStatus(notif.id)}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs px-2.5 py-1.5 rounded-lg font-bold"
                          title="Toggle read status"
                        >
                          {notif.isRead ? '👁️ Mark Unread' : '👁️ Mark Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-650 p-2 rounded-lg text-xs border border-red-200"
                          title="Remove notification"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
