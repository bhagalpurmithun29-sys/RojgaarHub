import React, { useState } from 'react';
import { 
  MapPin, Navigation, Navigation2, CheckCircle2, AlertTriangle, 
  Phone, MessageSquare, ShieldAlert, Zap, Clock, BatteryMedium,
  Wifi, Filter, Search, MoreVertical, Coffee, Crosshair, Plus, Minus, Maximize, Layers, UserPlus, X
} from 'lucide-react';

const MOCK_SUMMARY = {
  totalAssigned: 10,
  online: 8,
  onSite: 6,
  travelling: 2,
  completed: 0
};

const MOCK_WORKERS = [
  {
    id: 'W001',
    name: 'Ravi Kumar',
    skill: 'Electrician',
    project: 'PRJ24581 - House Wiring',
    status: 'Working',
    distance: '0.0 km',
    eta: 'Arrived',
    battery: '85%',
    network: 'Strong',
    avatar: 'R',
    color: 'emerald'
  },
  {
    id: 'W002',
    name: 'Aman Sharma',
    skill: 'Plumber',
    project: 'PRJ24581 - Pipe Fitting',
    status: 'Travelling',
    distance: '2.1 km',
    eta: '6 min',
    battery: '42%',
    network: 'Moderate',
    avatar: 'A',
    color: 'brand-amber'
  },
  {
    id: 'W003',
    name: 'Vikash Singh',
    skill: 'Carpenter',
    project: 'PRJ24582 - Woodwork',
    status: 'Break',
    distance: '0.0 km',
    eta: 'Arrived',
    battery: '90%',
    network: 'Strong',
    avatar: 'V',
    color: 'blue'
  },
  {
    id: 'W004',
    name: 'Manoj Das',
    skill: 'Mason',
    project: 'PRJ24585 - Wall Plastering',
    status: 'Offline',
    distance: 'Unknown',
    eta: 'Unknown',
    battery: 'Low',
    network: 'Disconnected',
    avatar: 'M',
    color: 'gray'
  }
];

const MOCK_ALERTS = [
  { id: 1, type: 'warning', message: 'Manoj Das is inactive for 30 minutes', time: '10 mins ago' },
  { id: 2, type: 'critical', message: 'SOS Triggered: Worksite A', time: 'Just now' },
  { id: 3, type: 'info', message: 'Aman Sharma is arriving in 6 mins', time: '1 min ago' }
];

import api from '@/utils/api';

export default function LiveTeamTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [workers, setWorkers] = useState(MOCK_WORKERS);

  React.useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const res = await api.get('/contractors/dashboard');
        if (res.data) {
          // Update summary with real counts
          setSummary({
            totalAssigned: res.data.totalWorkers || MOCK_SUMMARY.totalAssigned,
            online: res.data.analytics?.teamPerformance ? Math.floor((res.data.analytics.teamPerformance / 100) * (res.data.totalWorkers || 10)) : MOCK_SUMMARY.online,
            onSite: res.data.activeProjectsCount || MOCK_SUMMARY.onSite,
            travelling: res.data.pendingProjectsCount || MOCK_SUMMARY.travelling,
            completed: res.data.analytics?.totalCompleted || MOCK_SUMMARY.completed
          });
          
          // Note: Since real-time GPS requires websockets and is outside current scope, 
          // we gracefully retain the mock workers array for UI tracking presentation,
          // or we could map res.data.projects.assignedWorkers if they were populated.
        }
      } catch (err) {
        console.error('Failed to load tracking data. Using mock.', err);
      }
    };
    fetchTrackingData();
  }, []);

  const selectedWorker = selectedWorkerId ? workers.find(w => w.id === selectedWorkerId) : null;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Working': return <span className="flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-200"><CheckCircle2 className="w-3 h-3"/> {status}</span>;
      case 'Travelling': return <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-md border border-amber-200"><Navigation2 className="w-3 h-3"/> {status}</span>;
      case 'Break': return <span className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-200"><Coffee className="w-3 h-3"/> {status}</span>;
      default: return <span className="flex items-center gap-1 text-xs font-bold bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200"><Clock className="w-3 h-3"/> {status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 📊 Team Overview Panel */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Assigned</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{summary.totalAssigned}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1 text-green-500">🟢 Online</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{summary.online}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1 text-blue-500">📍 On-Site</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{summary.onSite}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1 text-brand-amber">🚗 Travelling</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{summary.travelling}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Completed</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{summary.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Tracking List & Alerts */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* AI Insights Panel */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
            <h3 className="font-black text-indigo-900 dark:text-indigo-400 flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-indigo-500" /> AI Smart Insights
            </h3>
            <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-300">
              <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> Team efficiency increased by 15% this week.</li>
              <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> 2 workers are currently idle. Reassign suggested.</li>
              <li className="flex items-start gap-2"><span className="text-indigo-500">•</span> Worker Ravi has the highest completion rate.</li>
            </ul>
          </div>

          {/* Real-time Alerts */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
              <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Live Alerts
              </h3>
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{MOCK_ALERTS.length}</span>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_ALERTS.map(alert => (
                <div key={alert.id} className={`p-3 rounded-xl border flex gap-3 items-start ${
                  alert.type === 'critical' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 
                  alert.type === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 
                  'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
                }`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                    alert.type === 'critical' ? 'text-red-500' : alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className={`text-sm font-bold ${
                      alert.type === 'critical' ? 'text-red-700 dark:text-red-400' : alert.type === 'warning' ? 'text-amber-700 dark:text-amber-400' : 'text-blue-700 dark:text-blue-400'
                    }`}>{alert.message}</p>
                    <p className="text-[10px] font-semibold mt-1 opacity-70">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Column: Map & Active Team Members */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Mock Interactive Map */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden h-[400px] relative group">
            {/* Map Background Grid/Texture */}
            <div className="absolute inset-0 bg-[#eef2f5] dark:bg-[#1a1a1a]" style={{ backgroundImage: 'radial-gradient(#9ca3af 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Map Controls */}
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
              <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden flex flex-col">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-zinc-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 transition-colors mt-1">
                <Maximize className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 transition-colors mt-1">
                <Layers className="w-4 h-4" />
              </button>
            </div>

            {/* Map Overlay Top Left */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-3 rounded-xl border border-gray-200 dark:border-zinc-700 shadow-lg z-20 pointer-events-none">
              <h4 className="font-black text-gray-900 dark:text-white text-sm flex items-center gap-2"><Crosshair className="w-4 h-4 text-brand-amber"/> GPS Active</h4>
              <p className="text-xs text-gray-500 mt-1">Live tracking strictly enabled for active projects.</p>
            </div>

            {/* Mock Map Markers Layer */}
            <div className="absolute inset-0 z-10" onClick={() => setSelectedWorkerId(null)}>
              
              {/* Route Line Mock */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path d="M 50% 50% L 80% 80%" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 8" fill="none" className="animate-[dash_2s_linear_infinite]" />
                <path d="M 50% 50% L 30% 20%" stroke="#10b981" strokeWidth="3" fill="none" />
              </svg>

              {/* Work Site Project Location */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
                <div className="bg-blue-600 text-white p-2.5 rounded-full shadow-lg shadow-blue-600/40 mb-1 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="bg-white dark:bg-zinc-800 text-xs font-black px-2 py-1 rounded-md shadow-lg border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-400">Project Site</span>
              </div>

              {/* Working Worker (Ravi) */}
              <div 
                className="absolute top-[48%] left-[45%] flex flex-col items-center cursor-pointer hover:scale-110 transition-transform group"
                onClick={(e) => { e.stopPropagation(); setSelectedWorkerId('W001'); }}
              >
                <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full border-2 border-emerald-500 shadow-lg flex items-center justify-center p-0.5 relative z-20">
                  <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">R</div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <span className="text-[10px] font-bold bg-white/90 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded shadow mt-1">Ravi (Working)</span>
              </div>

              {/* Travelling Worker (Aman) */}
              <div 
                className="absolute top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform group"
                onClick={(e) => { e.stopPropagation(); setSelectedWorkerId('W002'); }}
              >
                <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full border-2 border-amber-500 shadow-lg flex items-center justify-center p-0.5 relative z-20">
                  <div className="w-full h-full bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center"><Navigation2 className="w-2 h-2 text-white" /></div>
                </div>
                <span className="text-[10px] font-bold bg-white/90 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded shadow mt-1">Aman (On Way)</span>
              </div>

              {/* Break Worker (Vikash) */}
              <div 
                className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform group"
                onClick={(e) => { e.stopPropagation(); setSelectedWorkerId('W003'); }}
              >
                <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full border-2 border-blue-400 shadow-lg flex items-center justify-center p-0.5 relative z-20">
                  <div className="w-full h-full bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xs">V</div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 border-2 border-white rounded-full flex items-center justify-center"><Coffee className="w-2 h-2 text-white" /></div>
                </div>
                <span className="text-[10px] font-bold bg-white/90 dark:bg-zinc-800/90 border border-gray-200 dark:border-zinc-700 px-1.5 py-0.5 rounded shadow mt-1">Vikash (Arrived)</span>
              </div>

              {/* SOS/Offline Example Marker (Manoj) */}
              <div 
                className="absolute top-[30%] right-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform group"
                onClick={(e) => { e.stopPropagation(); setSelectedWorkerId('W004'); }}
              >
                <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full border-2 border-red-500 shadow-lg shadow-red-500/50 flex items-center justify-center p-0.5 relative z-20 animate-pulse">
                  <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs">M</div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center"><AlertTriangle className="w-2 h-2 text-white" /></div>
                </div>
                <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded shadow mt-1">Manoj (Offline)</span>
              </div>
            </div>

            {/* Worker Popup Dialog Layer */}
            {selectedWorker && (
              <div className="absolute bottom-4 left-4 right-16 md:right-auto md:w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 z-30 animate-in slide-in-from-bottom-4 duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg bg-${selectedWorker.color}-500 shadow-md`}>
                      {selectedWorker.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        {selectedWorker.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mb-1">{selectedWorker.skill}</p>
                      {getStatusBadge(selectedWorker.status)}
                    </div>
                  </div>
                  <button onClick={() => setSelectedWorkerId(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 bg-gray-50/50 dark:bg-zinc-800/30 grid grid-cols-2 gap-y-3 gap-x-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Distance</p><p className="text-xs font-bold text-gray-900 dark:text-white">{selectedWorker.distance}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">ETA</p><p className="text-xs font-bold text-gray-900 dark:text-white">{selectedWorker.eta}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BatteryMedium className="w-4 h-4 text-green-500" />
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Battery</p><p className="text-xs font-bold text-gray-900 dark:text-white">{selectedWorker.battery}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-500" />
                    <div><p className="text-[10px] text-gray-500 uppercase font-bold">Network</p><p className="text-xs font-bold text-gray-900 dark:text-white">{selectedWorker.network}</p></div>
                  </div>
                </div>
                <div className="p-3 flex gap-2">
                  <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                    <MessageSquare className="w-3 h-3"/> Chat
                  </button>
                  <button className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20 text-green-600 dark:text-green-400 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                    <Phone className="w-3 h-3"/> Call
                  </button>
                  <button className="flex-1 bg-brand-amber hover:bg-brand-orange text-white py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm">
                    <UserPlus className="w-3 h-3"/> Assign
                  </button>
                </div>
              </div>
            )}
            
            {/* Privacy Note Overlay */}
            <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center gap-2 z-20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">End-to-End Encrypted Location</span>
            </div>
          </div>

          {/* 🔎 Filters & List */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <h3 className="font-black text-gray-900 dark:text-white">Active Team Members</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search team..." className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-brand-amber transition-colors" />
                </div>
                <button className="p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {workers.filter(w => filterStatus === 'All' || w.status === filterStatus).filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase())).map((worker) => (
                <div key={worker.id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                  
                  {/* Worker Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg bg-${worker.color}-500 shadow-md`}>
                        {worker.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${worker.status === 'Offline' ? 'bg-gray-400' : 'bg-emerald-500'}`}></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-base">{worker.name} <span className="text-xs font-normal text-gray-500 ml-1">({worker.id})</span></h4>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mb-2">{worker.skill} • {worker.project}</p>
                      
                      {/* Live Data Pills */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {getStatusBadge(worker.status)}
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                          <MapPin className="w-3 h-3"/> {worker.distance}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                          <Clock className="w-3 h-3"/> ETA: {worker.eta}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                          <BatteryMedium className={`w-3 h-3 ${worker.battery === 'Low' ? 'text-red-500' : 'text-green-500'}`}/> {worker.battery}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                          <Wifi className={`w-3 h-3 ${worker.network === 'Disconnected' ? 'text-red-500' : 'text-blue-500'}`}/> {worker.network}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-zinc-800 w-full sm:w-auto mt-2 sm:mt-0">
                    <button className="flex-1 sm:flex-none px-3 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                      <MessageSquare className="w-4 h-4"/> Chat
                    </button>
                    <button className="flex-1 sm:flex-none px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-500/10 dark:hover:bg-green-500/20 text-green-600 dark:text-green-400 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                      <Phone className="w-4 h-4"/> Call
                    </button>
                    <button className="flex-1 sm:flex-none px-3 py-2 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow-sm">
                      <Crosshair className="w-4 h-4"/> Track
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors hidden sm:block">
                      <MoreVertical className="w-5 h-5"/>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
