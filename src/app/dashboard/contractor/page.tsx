'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { 
  Briefcase, Users, LayoutDashboard, Wallet, BarChart3, 
  MessageSquare, History, Shield, Settings, Bell, 
  LogOut, MapPin, ChevronRight, CheckCircle2, Navigation
} from 'lucide-react';

import TeamManagement from '@/components/contractor/TeamManagement';
import ActiveProjects from '@/components/contractor/ActiveProjects';
import ProjectRequests from '@/components/contractor/ProjectRequests';
import ContractorAnalytics from '@/components/contractor/ContractorAnalytics';
import ContractorVerification from '@/components/contractor/ContractorVerification';
import ProjectHistory from '@/components/contractor/ProjectHistory';
import LiveTeamTracking from '@/components/contractor/LiveTeamTracking';
import LabourChatCenter from '@/components/labour/LabourChatCenter';
import EarningsWallet from '@/components/labour/EarningsWallet';
import SafetySupport from '@/components/labour/SafetySupport';

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState('Ravi Sharma');

  const [stats, setStats] = useState({
    activeProjects: 0,
    teamWorkers: 0,
    monthlyEarnings: 0,
    completionRate: 0,
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.status === 200) {
          const data = res.data;
          setUserName(data.name || data.email?.split('@')[0] || 'Contractor');
          
          setStats({
            activeProjects: data.statistics?.activeProjects || 0,
            teamWorkers: data.statistics?.teamWorkers || 0,
            monthlyEarnings: data.statistics?.monthlyEarnings || 0,
            completionRate: data.statistics?.completionRate || 0,
            profileImage: data.profileImage || ''
          });
        }
      } catch (err) {
        const email = localStorage.getItem('user_email');
        if (email) {
          setUserName(email.split('@')[0]);
        }
      }
    };
    fetchProfile();
  }, []);

  const navItems = [
    { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard, category: 'OVERVIEW' },
    { id: 'projects_req', label: 'Project Requests', icon: Bell, badge: 3, category: 'PROJECTS' },
    { id: 'active_projects', label: 'Active Projects', icon: Briefcase, category: 'PROJECTS' },
    { id: 'team', label: 'Team Management', icon: Users, category: 'TEAM' },
    { id: 'tracking', label: 'Live Team Tracking', icon: MapPin, category: 'TEAM' },
    { id: 'wallet', label: 'Earnings & Wallet', icon: Wallet, category: 'FINANCE' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, category: 'FINANCE' },
    { id: 'chat', label: 'Communication', icon: MessageSquare, badge: 5, category: 'SUPPORT' },
    { id: 'verification', label: 'KYC Verification', icon: Shield, category: 'SUPPORT' },
    { id: 'history', label: 'Project History', icon: History, category: 'SUPPORT' },
    { id: 'safety', label: 'Safety & Support', icon: Shield, category: 'SUPPORT' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'SUPPORT' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden selection:bg-brand-amber/30">
      
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-zinc-800 flex flex-col hidden md:flex shrink-0 shadow-lg z-20">
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-amber to-brand-orange rounded-xl flex items-center justify-center shadow-lg shadow-brand-amber/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">WorkerHub</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contractor Portal</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="relative">
              {stats.profileImage ? (
                <img src={stats.profileImage} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-zinc-700 shadow-sm" alt="Profile" />
              ) : (
                <div className="w-14 h-14 rounded-full border-2 border-gray-100 dark:border-zinc-700 shadow-sm bg-gradient-to-br from-brand-amber to-brand-orange flex items-center justify-center text-white font-bold text-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#111111] rounded-full"></div>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{userName}</p>
              <p className="text-xs font-semibold text-brand-amber flex items-center gap-1 mt-0.5">
                Verified Pro <CheckCircle2 className="w-3 h-3" />
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {['OVERVIEW', 'PROJECTS', 'TEAM', 'FINANCE', 'SUPPORT'].map((category) => (
            <div key={category}>
              <h3 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-3">
                {category}
              </h3>
              <div className="space-y-1">
                {navItems.filter(item => item.category === category).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                        isActive 
                          ? 'bg-brand-amber/10 dark:bg-brand-amber/10 text-brand-amber' 
                          : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-brand-amber' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                        <span className={`text-sm font-bold ${isActive ? 'text-brand-amber' : ''}`}>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-brand-amber text-white' : 'bg-red-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold text-sm">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-amber" />
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Contractor Hub</h1>
          </div>
          {stats.profileImage ? (
            <img src={stats.profileImage} className="w-10 h-10 rounded-full border border-gray-200" alt="Profile" />
          ) : (
            <div className="w-10 h-10 rounded-full border border-gray-200 bg-brand-amber flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10">
          {activeTab !== 'chat' && (
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
            </div>
          )}

          {activeTab === 'home' && <HomeTab stats={stats} />}
          {activeTab === 'team' && <TeamManagement />}
          {activeTab === 'active_projects' && <ActiveProjects />}
          {activeTab === 'projects_req' && <ProjectRequests />}
          {activeTab === 'analytics' && <ContractorAnalytics />}
          {activeTab === 'verification' && <ContractorVerification />}
          {activeTab === 'history' && <ProjectHistory />}
          {activeTab === 'tracking' && <LiveTeamTracking />}
          
          {/* Re-used components */}
          {activeTab === 'chat' && (
            <div className="h-full w-full flex flex-col">
              <LabourChatCenter />
            </div>
          )}
          {activeTab === 'wallet' && <EarningsWallet />}
          {activeTab === 'safety' && <SafetySupport />}

          {/* Placeholders for others */}
          {['settings'].includes(activeTab) && (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Module under construction</h3>
              <p className="text-gray-500 dark:text-zinc-400">The {activeTab} section is currently being integrated for contractors.</p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

function HomeTab({ stats }: { stats?: any }) {
  const displayStats = stats || { activeProjects: 0, teamWorkers: 0, monthlyEarnings: 0, completionRate: 0 };
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full"></div>
          <Briefcase className="w-6 h-6 text-blue-500 mb-4" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Active Projects</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">{displayStats.activeProjects}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/10 rounded-bl-full"></div>
          <Users className="w-6 h-6 text-brand-amber mb-4" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Team Workers</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">{displayStats.teamWorkers}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full"></div>
          <Wallet className="w-6 h-6 text-green-500 mb-4" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Monthly Earnings</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white flex items-center">
            <span className="text-2xl text-green-500 mr-1">₹</span>
            {displayStats.monthlyEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full"></div>
          <CheckCircle2 className="w-6 h-6 text-purple-500 mb-4" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Completion Rate</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">{displayStats.completionRate}%</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Urgent Attention Needed */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 dark:from-zinc-900 dark:to-zinc-800 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
              <span className="text-sm font-bold uppercase tracking-wider text-indigo-200">Attention Needed</span>
            </div>
            <h3 className="text-2xl font-black mb-4">Project: City Mall Wiring</h3>
            <p className="text-indigo-100 mb-6 max-w-md text-sm leading-relaxed">2 workers are currently inactive at the site. Project progress is 15% behind schedule. Would you like to reassign new workers?</p>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
              Manage Team
            </button>
            <button className="px-6 py-3 bg-indigo-800/50 hover:bg-indigo-800 text-white border border-indigo-500/30 rounded-xl font-bold transition-colors">
              Contact Client
            </button>
          </div>
        </div>

        {/* Live Team Tracking Preview */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Live Team Status</h3>
            <button className="text-sm font-bold text-brand-amber hover:underline flex items-center gap-1">
              Track All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 overflow-hidden relative">
            {/* Fake Map */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 p-4 z-10">
               {/* Team Pin 1 */}
               <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 flex items-center gap-3 transform -translate-x-12 -translate-y-4">
                 <div className="relative">
                   <img src="https://i.pravatar.cc/150?u=a" className="w-8 h-8 rounded-full" />
                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                 </div>
                 <div>
                   <p className="text-xs font-bold dark:text-white">Site A Team (4)</p>
                   <p className="text-[10px] text-green-600">Working</p>
                 </div>
               </div>

               {/* Team Pin 2 */}
               <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 flex items-center gap-3 transform translate-x-16 translate-y-6">
                 <div className="relative">
                   <img src="https://i.pravatar.cc/150?u=b" className="w-8 h-8 rounded-full" />
                   <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                 </div>
                 <div>
                   <p className="text-xs font-bold dark:text-white">Site B Team (2)</p>
                   <p className="text-[10px] text-amber-600">On Break</p>
                 </div>
               </div>
            </div>
            
            <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full text-sm font-bold shadow-xl z-20 flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Open Full Map
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
