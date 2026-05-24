'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserRecord {
  id: string;
  name: string;
  role: 'customer' | 'labour' | 'contractor';
  status: 'Active' | 'Blocked' | 'Pending KYC';
  email: string;
  phone: string;
}

interface SosAlert {
  active: boolean;
  token: string;
  lat: string;
  lng: string;
  priority: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'CRITICAL';
  status: 'Open' | 'Under Investigation' | 'Resolved';
  createdAt: string;
}

interface SecurityAlert {
  score: number;
  risk: 'LOW' | 'ELEVATED' | 'CRITICAL';
  flags: string[];
  kyc: boolean;
  timestamp: string;
  email: string;
}

interface AuditLog {
  timestamp: string;
  action: string;
  category: 'User' | 'Finance' | 'Security' | 'System' | 'CMS';
}

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rawProfiles, setRawProfiles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLabourers: 0,
    totalContractors: 0,
    activeBookings: 0,
    platformRevenue: 0,
  });

  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'approvals' | 'finance' | 'disputes' | 'controls' | 'audits'>('analytics');
  
  // Platform Metrics & Audit Logs States
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Features Flags
  const [featureFlags, setFeatureFlags] = useState({
    instantPayouts: true,
    audioCalling: true,
    graceCancel: true,
    aiSecurityScan: true
  });

  // Maintenance Mode
  const [maintenanceModeActive, setMaintenanceModeActive] = useState(false);

  // CMS dynamic variables
  const [cmsHeadline, setCmsHeadline] = useState('Book Certified Nearby Professionals Instantly');
  const [cmsPromoBanner, setCmsPromoBanner] = useState('Get 20% OFF on your first Electrician booking!');
  const [cmsHelpline, setCmsHelpline] = useState('+91 99999 88888');

  // Unified lists
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txSummary, setTxSummary] = useState({ totalVolume: 0, totalFees: 0, totalCommission: 0 });
  const [signupDays, setSignupDays] = useState<{ label: string; count: number }[]>([]);
  const [bookingCategories, setBookingCategories] = useState<{ _id: string; count: number }[]>([]);

  // SOS, Tickets & Wallet states synced from localStorage
  const [sosAlert, setSosAlert] = useState<SosAlert | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(1500);
  const [securityAlert, setSecurityAlert] = useState<SecurityAlert | null>(null);

  // Fetch all real operational data from the backend database
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch stats, users, KYC profiles
      const statsRes = await fetch('http://localhost:5002/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!statsRes.ok) throw new Error('Failed to fetch platform metrics');
      const data = await statsRes.json();

      setStats(data.stats);
      setRawProfiles(data.profiles || []);
      if (data.bookingCategories) setBookingCategories(data.bookingCategories);

      if (Array.isArray(data.auditLogs)) {
        const mappedLogs = data.auditLogs.map((log: any) => ({
          timestamp: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `${log.action}: ${log.details}`,
          category: log.action === 'KYC_VERIFICATION' ? 'User' : log.action.includes('CMS') ? 'CMS' : 'System',
        }));
        setAuditLogs(mappedLogs);
      }

      if (Array.isArray(data.users)) {
        const mappedUsers: UserRecord[] = data.users.map((u: any) => {
          const profile = (data.profiles || []).find((p: any) => p.user === u._id);
          let uiStatus: 'Active' | 'Blocked' | 'Pending KYC' = 'Active';
          if (u.status === 'suspended') {
            uiStatus = 'Blocked';
          } else if (u.role === 'labour' || u.role === 'contractor') {
            if (profile) {
              if (profile.kycStatus === 'pending') {
                uiStatus = 'Pending KYC';
              } else if (profile.kycStatus === 'rejected') {
                uiStatus = 'Blocked';
              }
            } else {
              uiStatus = 'Pending KYC';
            }
          }
          
          return {
            id: u._id,
            name: u.name,
            role: u.role,
            status: uiStatus,
            email: u.email,
            phone: u.phone,
            aadhaarCard: profile?.aadhaarCard,
            panCard: profile?.panCard,
          };
        });
        setUsers(mappedUsers);
      }

      // Fetch real transactions from DB
      const txRes = await fetch('http://localhost:5002/api/admin/transactions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
        setTxSummary({
          totalVolume: txData.totalVolume || 0,
          totalFees: txData.totalFees || 0,
          totalCommission: txData.totalCommission || 0,
        });
      }

      // Fetch daily signup counts for past 7 days
      const signupRes = await fetch('http://localhost:5002/api/admin/signups', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (signupRes.ok) {
        const signupData = await signupRes.json();
        setSignupDays(signupData.days || []);
      }

    } catch (err) {
      console.error('Error fetching admin operations console data', err);
    }
  };

  // Sync state values and enforce role authorization on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('user_role');
      if (!token || role !== 'admin') {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }
      setIsAdmin(true);
      fetchData();
    }
  }, []);

  useEffect(() => {
    // 1. Fetch active SOS alerts
    const savedSos = localStorage.getItem('rozgaar_admin_sos_alert');
    if (savedSos) {
      try { setSosAlert(JSON.parse(savedSos)); } catch (e) { console.error(e); }
    }

    // 2. Fetch complaint tickets
    const savedTickets = localStorage.getItem('rozgaar_tickets');
    if (savedTickets) {
      try { setTickets(JSON.parse(savedTickets)); } catch (e) { console.error(e); }
    }

    // 3. Fetch user wallet balance
    const savedWallet = localStorage.getItem('rozgaar_wallet_balance');
    if (savedWallet) {
      setWalletBalance(Number(savedWallet));
    }

    // 4. Fetch security alerts
    const savedSecurity = localStorage.getItem('rozgaar_admin_security_alert');
    if (savedSecurity) {
      try { setSecurityAlert(JSON.parse(savedSecurity)); } catch (e) { console.error(e); }
    }

    // 5. Fetch CMS configuration
    const savedCms = localStorage.getItem('rozgaar_cms_data');
    if (savedCms) {
      try {
        const data = JSON.parse(savedCms);
        setCmsHeadline(data.headline || 'Book Certified Nearby Professionals Instantly');
        setCmsPromoBanner(data.promoBanner || 'Get 20% OFF on your first Electrician booking!');
        setCmsHelpline(data.helpline || '+91 99999 88888');
      } catch (e) {
        console.error(e);
      }
    }

    // 6. Fetch maintenance mode setting
    const maintActive = localStorage.getItem('rozgaar_maintenance_mode');
    if (maintActive === 'true') {
      setMaintenanceModeActive(true);
    }
  }, [isAdmin]);

  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    // Hard redirect to login — login page will see no token and stay
    window.location.replace('/login');
  };

  const addAuditLog = (action: string, category: 'User' | 'Finance' | 'Security' | 'System' | 'CMS') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditLogs(prev => [{ timestamp, action, category }, ...prev]);
  };

  // User Actions connected to real database
  const handleToggleBlock = async (userId: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Blocked' ? 'active' : 'suspended';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5002/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        throw new Error('Failed to update block status in MongoDB');
      }
      await fetchData();
      alert(`Success! User status set to: ${currentStatus === 'Blocked' ? 'Active' : 'Blocked'}.`);
    } catch (err: any) {
      alert(err.message || 'An error occurred while updating block status');
    }
  };

  // Labour Approval Actions connected to real database
  const handleApproveLabour = async (userId: string, name: string) => {
    try {
      const profile = rawProfiles.find((p: any) => p.user === userId);
      if (!profile) {
        throw new Error('Labour profile not found for this user in database');
      }
      
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5002/api/admin/kyc/${profile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (!res.ok) {
        throw new Error('Failed to approve KYC in MongoDB');
      }
      await fetchData();
      alert(`Success! Labour profile ${name} approved for standard matching dispatch operations.`);
    } catch (err: any) {
      alert(err.message || 'An error occurred while approving profile');
    }
  };

  const handleRejectLabour = async (userId: string, name: string) => {
    try {
      const profile = rawProfiles.find((p: any) => p.user === userId);
      if (!profile) {
        throw new Error('Labour profile not found for this user in database');
      }
      
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5002/api/admin/kyc/${profile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (!res.ok) {
        throw new Error('Failed to reject KYC in MongoDB');
      }
      await fetchData();
      alert(`Rejected. Labour request status updated to Rejected.`);
    } catch (err: any) {
      alert(err.message || 'An error occurred while rejecting profile');
    }
  };


  // Contractor Management Actions
  const handleToggleContractorRole = (userId: string, name: string) => {
    const updated = users.map(u => u.id === userId ? { ...u, role: 'labour' as const } : u);
    setUsers(updated);
    addAuditLog(`Admin reassigned Contractor ${name} to standard Labour profile.`, 'User');
    alert(`Role updated to Labour.`);
  };

  // Dispatch / Close active SOS alert
  const handleResolveSOS = () => {
    localStorage.removeItem('rozgaar_admin_sos_alert');
    localStorage.setItem('rozgaar_sos_active', 'false');
    setSosAlert(null);
    addAuditLog('Admin resolved active SOS emergency call, silences dispatch sirens.', 'Security');
    alert('🚨 Emergency SOS successfully resolved!');
  };

  // Mitigate/Clear security flags
  const handleClearSecurityAlert = () => {
    localStorage.removeItem('rozgaar_admin_security_alert');
    localStorage.setItem('rozgaar_security_profile', JSON.stringify({
      trustScore: 100,
      riskLevel: 'LOW',
      kycVerified: true,
      suspiciousFlags: [],
      anomalies: [{ id: 'ANM-900', type: 'Admin Settle', severity: 'LOW', timestamp: 'Just now', description: 'Admin cleared all flags & approved trust status.' }],
      emailAddress: 'user.verma@gmail.com',
      profilePhotoStatus: 'Face Match Passed'
    }));

    setSecurityAlert(null);
    addAuditLog('Admin cleared suspicious AI flags & approved profile Trust to 100/100.', 'Security');
    alert('🛡️ AI Security Override executed successfully!');
  };

  const handleEnforceSecurityVerification = () => {
    if (securityAlert) {
      localStorage.setItem('rozgaar_security_profile', JSON.stringify({
        trustScore: 40,
        riskLevel: 'ELEVATED',
        kycVerified: false,
        suspiciousFlags: [...securityAlert.flags, 'Manual Admin Verification Hold'],
        anomalies: [{ id: 'ANM-901', type: 'Admin Hold', severity: 'ELEVATED', timestamp: 'Just now', description: 'Admin enforced strict identity verification protocol.' }],
        emailAddress: securityAlert.email,
        profilePhotoStatus: 'Generic Avatar'
      }));
      
      setSecurityAlert(prev => prev ? { ...prev, risk: 'ELEVATED', score: 40, flags: [...prev.flags, 'Manual Admin Verification Hold'] } : null);
      addAuditLog(`Admin enforced manual KYC restriction hold on flagged profile [${securityAlert.email}].`, 'Security');
      alert('⚠️ Verification Enforcement triggered!');
    }
  };

  // Settle Dispute: Payout Refund
  const handleApproveRefund = (ticketId: string) => {
    const updatedTickets = tickets.map(t => t.id === ticketId ? { ...t, status: 'Resolved' as const } : t);
    setTickets(updatedTickets);
    localStorage.setItem('rozgaar_tickets', JSON.stringify(updatedTickets));

    const nextBalance = walletBalance + 150;
    setWalletBalance(nextBalance);
    localStorage.setItem('rozgaar_wallet_balance', nextBalance.toString());

    addAuditLog(`Admin approved wallet refund of ₹150 for Dispute Ticket: ${ticketId}.`, 'Finance');
    alert(`💳 DISPUTE RESOLVED! ₹150 credited to customer wallet. New Balance: ₹${nextBalance}`);
  };

  // Settle Dispute: Reject / Dismiss Complaint
  const handleDismissTicket = (ticketId: string) => {
    const updatedTickets = tickets.map(t => t.id === ticketId ? { ...t, status: 'Resolved' as const } : t);
    setTickets(updatedTickets);
    localStorage.setItem('rozgaar_tickets', JSON.stringify(updatedTickets));
    addAuditLog(`Admin dismissed Complaint Ticket: ${ticketId} without wallet credit modifications.`, 'Finance');
    alert(`Dispute Ticket ${ticketId} resolved without payout.`);
  };

  // CMS configuration edits
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('rozgaar_cms_data', JSON.stringify({
      headline: cmsHeadline,
      promoBanner: cmsPromoBanner,
      helpline: cmsHelpline
    }));
    addAuditLog(`Admin updated CMS static content configurations.`, 'CMS');
    alert('🎨 CMS Configuration saved successfully! Changes are propagated across landing pages.');
  };

  // Feature flag settings togglers
  const handleToggleFlag = (flagName: keyof typeof featureFlags) => {
    const nextState = !featureFlags[flagName];
    setFeatureFlags(prev => ({ ...prev, [flagName]: nextState }));
    addAuditLog(`Admin toggled Feature Flag [${flagName}] to ${nextState ? 'ON' : 'OFF'}.`, 'System');
  };

  // Maintenance mode simulator togglers
  const handleToggleMaintenance = () => {
    const nextState = !maintenanceModeActive;
    setMaintenanceModeActive(nextState);
    localStorage.setItem('rozgaar_maintenance_mode', nextState ? 'true' : 'false');
    addAuditLog(`Admin toggled Global Platform Maintenance Mode to ${nextState ? 'ACTIVE' : 'INACTIVE'}.`, 'System');
    alert(`Maintenance Mode set to: ${nextState ? 'ACTIVE LOCKOUT' : 'STANDARD PRODUCTION'}.`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">Verifying Admin Access</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">Loading secure admin environment credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-6 transition-colors duration-300">
      
      {/* 🛠️ MAINTENANCE MODE ACTIVE FULL SCREEN INTERACTIVE BLANKET OVERLAY */}
      {maintenanceModeActive && (
        <div className="fixed inset-0 bg-zinc-900/95 backdrop-blur-md z-[100] flex flex-col justify-center items-center text-center p-6 select-none">
          <div className="max-w-xl space-y-6">
            <span className="text-6xl animate-bounce block">⚙️</span>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">🛠️ Platform Maintenance Active</h1>
            <p className="text-zinc-400 text-sm">
              RozgaarHub operations are currently throttled for scheduled system optimizations and security patches. 
              The application sandbox is locked.
            </p>
            <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700 text-left font-mono text-xs text-green-400 space-y-1">
              <p>&gt; sysStatus: MAINTENANCE_LOCKOUT_ACTIVE</p>
              <p>&gt; connection: SECURED_ADMIN_CONSOLE_ONLY</p>
              <p>&gt; ETA: 45 minutes remaining</p>
            </div>
            
            <button
              onClick={handleToggleMaintenance}
              className="bg-red-600 hover:bg-red-750 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow shadow-red-500/20"
            >
              ⚠️ FORCE OVERRIDE & DEACTIVATE MAINTENANCE MODE
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Navigation Head */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md border border-gray-150 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                ← Back to Homepage
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wide">Enterprise Ops Console</h1>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">Global platform administration metrics, user approvals, finance audits, feature flags, and CMS widgets.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleMaintenance}
              className={`font-bold text-xs px-4 py-2 rounded-xl transition-all ${
                maintenanceModeActive ? 'bg-amber-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
              }`}
            >
              {maintenanceModeActive ? '⚠️ Locked in Maintenance' : '🚨 Trigger Maintenance Mode'}
            </button>

            <button
              onClick={handleLogout}
              className="font-bold text-xs px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white transition-all shadow-md flex items-center gap-1.5"
            >
              🔓 Logout
            </button>
          </div>
        </div>

        {/* Tab Selector controls */}
        <div className="flex overflow-x-auto space-x-1.5 p-1 bg-gray-200/60 dark:bg-zinc-900/60 rounded-2xl border border-gray-250 dark:border-zinc-805/80 scrollbar-none">
          {[
            { id: 'analytics', label: '📊 Operations & Analytics' },
            { id: 'users', label: '👥 User & Contractor list' },
            { id: 'approvals', label: '🥇 Labour KYC Approvals' },
            { id: 'finance', label: '💰 Payments & Ledger' },
            { id: 'disputes', label: '⚖️ Disputes & Fraud' },
            { id: 'controls', label: '⚙️ CMS & Flags' },
            { id: 'audits', label: '📜 Live Audit Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-650 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: OPERATIONS & ANALYTICS TAB */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Stat counts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Registered Users', value: (stats.totalCustomers + stats.totalLabourers + stats.totalContractors).toString(), sub: 'In MongoDB Atlas', positive: true },
                { title: 'Active Labourers', value: stats.totalLabourers.toString(), sub: `${users.filter(u => u.status === 'Pending KYC').length} pending KYC`, positive: true },
                { title: 'Pending Support Tickets', value: tickets.filter(t => t.status === 'Open').length.toString(), sub: 'Dispute queue', positive: tickets.filter(t => t.status === 'Open').length === 0 },
                { title: 'Est Revenue Commissions', value: `₹${stats.platformRevenue}`, sub: '15% platform cut', positive: true }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-gray-150 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white font-mono mt-2">{stat.value}</h3>
                  <span className={`text-[9px] font-bold block mt-1 ${stat.positive ? 'text-green-600' : 'text-amber-600 animate-pulse'}`}>
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Analytics charts widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Daily Signups Chart — live from DB */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md border border-gray-150 dark:border-zinc-800 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-850 pb-4">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">🚀 Weekly Platform Signups Metric</h4>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded">Live from MongoDB</span>
                </div>
                
                {signupDays.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">Loading signup data...</p>
                ) : (() => {
                  const maxCount = Math.max(...signupDays.map(d => d.count), 1);
                  return (
                    <div className="h-44 flex items-end gap-3.5 pt-4">
                      {signupDays.map((day, i) => {
                        const heightPct = Math.max((day.count / maxCount) * 100, day.count > 0 ? 8 : 2);
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-indigo-650 opacity-0 group-hover:opacity-100 transition-opacity">
                              {day.count}
                            </div>
                            <div className="w-full bg-indigo-600/10 rounded-lg h-32 flex items-end">
                              <div 
                                className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-lg transition-all duration-700"
                                style={{ height: `${heightPct}%` }}
                              ></div>
                            </div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">{day.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-850 pt-3">
                  <span className="text-[10px] text-gray-400 font-semibold">Total new users this week:</span>
                  <span className="text-[10px] font-black text-indigo-650">{signupDays.reduce((s, d) => s + d.count, 0)} registrations</span>
                </div>
              </div>

              {/* Booking Category Splits — live from DB */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md border border-gray-150 dark:border-zinc-800 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-850 pb-4">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">📊 Completed Bookings Category Splits</h4>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Live from MongoDB</span>
                </div>

                {bookingCategories.length === 0 ? (
                  <div className="py-6 text-center space-y-2">
                    <p className="text-xs text-gray-400 font-semibold">No bookings recorded yet.</p>
                    <p className="text-[10px] text-gray-300">Booking category distribution will appear here once users start making bookings.</p>
                  </div>
                ) : (() => {
                  const totalBookings = bookingCategories.reduce((s, c) => s + c.count, 0);
                  const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-red-500', 'bg-purple-600', 'bg-blue-500'];
                  return (
                    <div className="space-y-3.5 pt-2">
                      {bookingCategories.slice(0, 6).map((cat, idx) => {
                        const pct = Math.round((cat.count / totalBookings) * 100);
                        return (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-bold">
                              <span>{cat._id || 'General'}</span>
                              <span>{pct}% ({cat.count})</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                              <div className={`h-full ${colors[idx % colors.length]}`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: USERS & CONTRACTORS LIST */}
        {/* ======================================================== */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-md border border-gray-150 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/20">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">👥 Platform User & Contractor Management Registry</h3>
              <p className="text-[10px] text-gray-400 font-semibold">Block customers or assign contractor roles.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 font-bold border-b border-gray-200 dark:border-zinc-805">
                  <tr>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Full Name</th>
                    <th className="px-6 py-4">Platform Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-zinc-850">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-850/50">
                      <td className="px-6 py-4 font-mono font-bold">{u.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          u.role === 'contractor' ? 'bg-amber-100 text-amber-700' :
                          u.role === 'labour' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          u.status === 'Blocked' ? 'bg-red-100 text-red-700' :
                          u.status === 'Pending KYC' ? 'bg-indigo-150 text-indigo-700 animate-pulse' : 'bg-green-150 text-green-700'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-400">{u.email}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleBlock(u.id, u.name, u.status)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                            u.status === 'Blocked' 
                              ? 'bg-green-50 border-green-200 text-green-755' 
                              : 'bg-red-50 border-red-200 text-red-650'
                          }`}
                        >
                          {u.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                        </button>
                        
                        {u.role === 'contractor' && (
                          <button
                            onClick={() => handleToggleContractorRole(u.id, u.name)}
                            className="bg-gray-50 border border-gray-250 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100"
                          >
                            Downgrade Contractor Role
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: LABOUR KYC APPROVALS */}
        {/* ======================================================== */}
        {activeTab === 'approvals' && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-md border border-gray-150 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/20">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">🥇 Pending Labour Profile Verification Approvals</h3>
              <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">
                KYC Audit Deck
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 font-bold border-b border-gray-200 dark:border-zinc-805">
                  <tr>
                    <th className="px-6 py-4">Labour ID</th>
                    <th className="px-6 py-4">Worker Name</th>
                    <th className="px-6 py-4">Doc Verification Task</th>
                    <th className="px-6 py-4">Phone Registered</th>
                    <th className="px-6 py-4 text-right">Audit Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-zinc-850">
                  {users.filter(u => u.status === 'Pending KYC').length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                        No pending labour registrations waiting for document audits.
                      </td>
                    </tr>
                  ) : (
                    users.filter(u => u.status === 'Pending KYC').map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-850/50">
                        <td className="px-6 py-4 font-mono font-bold">{u.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                        <td className="px-6 py-4 text-amber-600 font-bold">
                          <div className="flex gap-2">
                            {(u as any).aadhaarCard ? (
                              <a href={(u as any).aadhaarCard} target="_blank" rel="noreferrer" className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:underline">View Aadhaar</a>
                            ) : <span>⚠️ Aadhaar pending</span>}
                            {(u as any).panCard ? (
                              <a href={(u as any).panCard} target="_blank" rel="noreferrer" className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:underline">View PAN</a>
                            ) : <span>⚠️ PAN pending</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-gray-400">{u.phone}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleApproveLabour(u.id, u.name)}
                            className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-green-100"
                          >
                            Approve KYC
                          </button>
                          <button
                            onClick={() => handleRejectLabour(u.id, u.name)}
                            className="bg-red-50 border border-red-200 text-red-650 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-red-100"
                          >
                            Reject & Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: PAYMENTS & COMMISSION LEDGER */}
        {/* ======================================================== */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            
            {/* Split breakdown — live from DB */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-150 dark:border-zinc-800 shadow-md">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-2">💰 Commission Billing Splits</h3>
              <p className="text-xs text-gray-500 mb-6">Audits the exact splits on booking commissions pulled from live MongoDB payment records. (Platform fee + GST 18%, Labour deduction 15%).</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Total Transaction Volume</span>
                  <h4 className="text-2xl font-black text-indigo-650 font-mono mt-1">₹{txSummary.totalVolume.toLocaleString('en-IN')}</h4>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Platform Fees Collected</span>
                  <h4 className="text-2xl font-black text-indigo-650 font-mono mt-1">₹{txSummary.totalFees.toLocaleString('en-IN')}</h4>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Net Commission (15%)</span>
                  <h4 className="text-2xl font-black text-green-650 font-mono mt-1">₹{txSummary.totalCommission.toLocaleString('en-IN')}</h4>
                </div>
              </div>
            </div>

            {/* Transactions Ledger */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-md border border-gray-150 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-950/20">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">💳 Live Payments Transaction Ledger</h3>
                <span className="text-xs font-mono text-gray-450">UPI & Wallet</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 font-bold border-b border-gray-200 dark:border-zinc-805">
                    <tr>
                      <th className="px-6 py-4">Transaction ID</th>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Assigned Worker</th>
                      <th className="px-6 py-4">Job Value</th>
                      <th className="px-6 py-4">Platform Fee Surcharge</th>
                      <th className="px-6 py-4">Platform Commission (15%)</th>
                      <th className="px-6 py-4">Settle Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-zinc-850">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-xs text-gray-400 font-semibold">
                          No payment transactions recorded yet. Transactions will appear here once users complete bookings.
                        </td>
                      </tr>
                    ) : transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-zinc-850/50">
                        <td className="px-6 py-4 font-mono font-bold">{tx.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-905 dark:text-white">{tx.customer}</td>
                        <td className="px-6 py-4">{tx.provider}</td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-white">₹{tx.amount.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 font-mono">₹{tx.fee}</td>
                        <td className="px-6 py-4 font-mono text-red-500">- ₹{tx.commission}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            tx.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            tx.status === 'Refunded' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: DISPUTES, REFUNDS & FRAUD REPORTS */}
        {/* ======================================================== */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            
            {/* SOS Active Alerts deck */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-150 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-red-50/10 dark:bg-red-955/10">
                <h2 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>🚨 Active Security SOS Emergency Signals</span>
                </h2>
              </div>
              <div className="p-6">
                {!sosAlert ? (
                  <p className="text-xs text-gray-400 text-center py-4 font-semibold">🛡️ Zero Active emergency signals. Platform dispatch standing clean.</p>
                ) : (
                  <div className="bg-red-50/30 dark:bg-red-955/20 border border-red-200 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-red-650">{sosAlert.token} | {sosAlert.priority}</p>
                      <p className="text-gray-500 font-semibold">Coordinates: Lat {sosAlert.lat}, Lng {sosAlert.lng} ( Delhi Anomaly )</p>
                    </div>
                    <button 
                      onClick={handleResolveSOS}
                      className="bg-red-600 hover:bg-red-750 text-white font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Resolve SOS Emergency
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Security Flags block */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-150 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-emerald-50/10 dark:bg-emerald-955/10">
                <h2 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>🛡️ Flagged Fraud & Suspicious Booking Patterns</span>
                </h2>
              </div>
              <div className="p-6">
                {!securityAlert ? (
                  <p className="text-xs text-gray-400 text-center py-4 font-semibold">✓ Zero profile anomalies checked. All shields validated.</p>
                ) : (
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-xs space-y-1.5">
                      <p className="font-bold text-gray-900 dark:text-white">{securityAlert.email} [Score: {securityAlert.score}/100]</p>
                      <div className="flex flex-wrap gap-1">
                        {securityAlert.flags.map((f, i) => (
                          <span key={i} className="bg-red-50 border border-red-200 text-red-700 text-[8px] font-bold px-2 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={handleEnforceSecurityVerification}
                        className="bg-zinc-850 text-white text-[10px] font-bold px-3 py-2 rounded-xl"
                      >
                        Enforce KYC Restrict ⚠️
                      </button>
                      <button 
                        onClick={handleClearSecurityAlert}
                        className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-2 rounded-xl"
                      >
                        Clear Flags✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Disputes complaints list table */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-150 dark:border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wide">🎫 Active Support Disputes Complaints & Refunds Queue</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-zinc-955 text-gray-700 dark:text-zinc-300 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Ticket ID</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Description Info</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Dispute Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-zinc-850">
                    {tickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-semibold">
                          No active dispute complaint logs found.
                        </td>
                      </tr>
                    ) : (
                      tickets.map(tkt => (
                        <tr key={tkt.id} className="hover:bg-gray-50 dark:hover:bg-zinc-850/50">
                          <td className="px-6 py-4 font-mono font-bold text-indigo-650">{tkt.id}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{tkt.category}</td>
                          <td className="px-6 py-4 text-gray-400 max-w-sm truncate">{tkt.title} - {tkt.description}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              tkt.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 animate-pulse' :
                              tkt.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tkt.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              tkt.status === 'Resolved' ? 'bg-green-150 text-green-700' : 'bg-indigo-150 text-indigo-700 animate-pulse'
                            }`}>
                              {tkt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {tkt.status === 'Open' ? (
                              <>
                                <button 
                                  onClick={() => handleApproveRefund(tkt.id)}
                                  className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                                >
                                  Approve Wallet Refund (₹150)
                                </button>
                                <button 
                                  onClick={() => handleDismissTicket(tkt.id)}
                                  className="bg-gray-50 border border-gray-250 text-gray-700 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                                >
                                  Dismiss Dispute
                                </button>
                              </>
                            ) : (
                              <span className="text-green-700 font-bold text-[10px] uppercase">RESOLVED SUCCESS ✓</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 6: CMS CONFIGURATION & FEATURE FLAGS */}
        {/* ======================================================== */}
        {activeTab === 'controls' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Content Management System (CMS) form */}
            <form onSubmit={handleSaveCMS} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800 space-y-6">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-1">🎨 dynamic Content Management System (CMS)</h3>
                <p className="text-[10px] text-gray-500">Edit branding messages and promotional slogans live across user views immediately.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Primary Hero Headline</label>
                <input 
                  type="text" 
                  value={cmsHeadline}
                  onChange={(e) => setCmsHeadline(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none focus:border-indigo-500 text-gray-955 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Promotional discount banner Slogan</label>
                <input 
                  type="text" 
                  value={cmsPromoBanner}
                  onChange={(e) => setCmsPromoBanner(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none focus:border-indigo-500 text-gray-955 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Emergency helpline number</label>
                <input 
                  type="text" 
                  value={cmsHelpline}
                  onChange={(e) => setCmsHelpline(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none focus:border-indigo-500 text-gray-955 dark:text-white"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs py-3 rounded-xl shadow transition-all"
              >
                Save CMS Slogans ✓
              </button>
            </form>

            {/* Feature Flags console card */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800 flex flex-col justify-between gap-6">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-1">⚙️ Feature Flags Configuration</h3>
                <p className="text-[10px] text-gray-500">Live toggle experimental parameters to control sandbox booking pipelines immediately.</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'instantPayouts', label: '⚡ Enable Instant Wallet Payouts', flag: featureFlags.instantPayouts },
                  { id: 'audioCalling', label: '📞 In-App calling privacy mask channel', flag: featureFlags.audioCalling },
                  { id: 'graceCancel', label: '❌ 30-Minute Grace Window rule throttling', flag: featureFlags.graceCancel },
                  { id: 'aiSecurityScan', label: '🛡️ AI spam sentiment scanner triggers', flag: featureFlags.aiSecurityScan }
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs p-3.5 bg-gray-50 dark:bg-zinc-950/50 rounded-xl border border-gray-100">
                    <span className="font-semibold">{item.label}</span>
                    <button
                      onClick={() => handleToggleFlag(item.id as any)}
                      className={`text-[9px] font-black px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                        item.flag 
                          ? 'bg-green-150 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-650 border border-red-200'
                      }`}
                    >
                      {item.flag ? 'ACTIVE ON' : 'DISABLED OFF'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 text-center">
                <span className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Auditing signature</span>
                <p className="text-[9px] text-gray-400 font-semibold font-mono">sys_key: ADM-FLAG-SEC-MOD-2026</p>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 7: SYSTEM AUDIT LOGS CONSOLE */}
        {/* ======================================================== */}
        {activeTab === 'audits' && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800 space-y-4">
            <div className="border-b border-gray-100 dark:border-zinc-850 pb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">📜 Platform System Audit Logs Console</h3>
                <p className="text-[10px] text-gray-500">Chronological logging ledger of administrative decisions, security overrides, and CMS edits.</p>
              </div>
              <button 
                onClick={() => setAuditLogs([])}
                className="text-[10px] font-bold text-indigo-650 hover:underline"
              >
                Clear Console Logs
              </button>
            </div>

            <div className="h-80 bg-gray-950 text-green-400 p-4 rounded-2xl font-mono text-[10px] overflow-y-auto space-y-1.5 shadow-inner select-text scrollbar-thin">
              {auditLogs.length === 0 ? (
                <p className="text-zinc-500">Audit ledger cleared. Perform administrator actions to capture logs live...</p>
              ) : (
                auditLogs.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-zinc-900 pb-1 hover:bg-zinc-900/40 px-1 rounded transition-colors">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase mr-2 ${
                        log.category === 'Security' ? 'bg-red-900 text-red-200' :
                        log.category === 'Finance' ? 'bg-green-900 text-green-200' :
                        log.category === 'CMS' ? 'bg-amber-900 text-amber-200' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {log.category}
                      </span>
                      <span>{log.action}</span>
                    </div>
                    <span className="text-zinc-500 font-bold whitespace-nowrap ml-4">{log.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
