import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Star, TrendingUp, AlertTriangle, 
  CheckCircle2, XCircle, ShieldCheck, Zap, 
  MessageSquare, Phone, IndianRupee, Eye, 
  Package, Calendar, Check, X, Search, Filter, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingReq {
  id: string;
  customer: {
    name: string;
    image: string;
    rating: number;
    reliability: number;
    verified: boolean;
    trustScore: number;
    completedBookings: number;
    cancellationRate: string;
  };
  job: {
    category: string;
    subCategory: string;
    description: string;
    type: 'Hourly' | 'Daily' | 'Project' | 'Emergency';
    priority: 'Normal' | 'Urgent' | 'Emergency';
  };
  location: {
    address: string;
    distance: string;
    area: string;
  };
  schedule: {
    date: string;
    time: string;
    duration: string;
  };
  payment: {
    customerPays: number;
    fee: number;
    earnings: number;
  };
  timeRemaining: number;
  match: {
    isMatch: boolean;
    similarJobs: number;
    successRate: number;
  };
  validation: {
    isAvailable: boolean;
    conflictingTime?: string;
  };
  status: 'New' | 'Pending' | 'Accepted' | 'Rejected';
}

const mockRequests: BookingReq[] = [
  {
    id: 'REQ-24581',
    customer: {
      name: 'Mithun Kumar',
      image: 'https://i.pravatar.cc/150?u=mithun',
      rating: 4.8,
      reliability: 96,
      verified: true,
      trustScore: 94,
      completedBookings: 35,
      cancellationRate: '2%'
    },
    job: {
      category: 'Electrician',
      subCategory: 'Wiring Repair',
      description: 'Need wiring repair in 2 rooms urgently. Main fuse is tripping repeatedly.',
      type: 'Emergency',
      priority: 'Emergency'
    },
    location: {
      address: 'House 42, Sector 17',
      area: 'Shimla Main Road',
      distance: '2.3 km'
    },
    schedule: {
      date: 'Today',
      time: '10:00 AM',
      duration: '3 Hours'
    },
    payment: {
      customerPays: 1000,
      fee: 50,
      earnings: 950
    },
    timeRemaining: 150, // 2:30 minutes
    match: {
      isMatch: true,
      similarJobs: 48,
      successRate: 97
    },
    validation: {
      isAvailable: true
    },
    status: 'New'
  },
  {
    id: 'REQ-24582',
    customer: {
      name: 'Priya Sharma',
      image: 'https://i.pravatar.cc/150?u=priya',
      rating: 4.2,
      reliability: 88,
      verified: true,
      trustScore: 82,
      completedBookings: 12,
      cancellationRate: '5%'
    },
    job: {
      category: 'Plumber',
      subCategory: 'Pipe Leakage',
      description: 'Bathroom pipe is leaking continuously. Need someone to fix it by tomorrow.',
      type: 'Hourly',
      priority: 'Normal'
    },
    location: {
      address: 'Apt 304, Green Valley',
      area: 'Mall Road',
      distance: '5.1 km'
    },
    schedule: {
      date: 'Tomorrow',
      time: '11:00 AM - 1:00 PM',
      duration: '2 Hours'
    },
    payment: {
      customerPays: 600,
      fee: 30,
      earnings: 570
    },
    timeRemaining: 600, // 10 minutes
    match: {
      isMatch: true,
      similarJobs: 15,
      successRate: 92
    },
    validation: {
      isAvailable: false,
      conflictingTime: '10:00 AM - 12:00 PM'
    },
    status: 'Pending'
  }
];

export default function BookingRequests() {
  const [requests, setRequests] = useState<BookingReq[]>(mockRequests);
  const [activeFilter, setActiveFilter] = useState<'All' | 'New' | 'Pending' | 'Accepted' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Countdown timer effect for active requests
  useEffect(() => {
    const timer = setInterval(() => {
      setRequests(prev => prev.map(req => {
        if (req.status === 'New' || req.status === 'Pending') {
          const newTime = Math.max(0, req.timeRemaining - 1);
          // Auto reject if timer hits zero
          if (newTime === 0 && req.timeRemaining > 0) {
            toast.error(`Request ${req.id} auto-rejected due to timeout.`);
            return { ...req, timeRemaining: 0, status: 'Rejected' };
          }
          return { ...req, timeRemaining: newTime };
        }
        return req;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAction = (id: string, action: 'Accepted' | 'Rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action, timeRemaining: 0 } : req));
    if (action === 'Accepted') {
      toast.success('Booking accepted! Check your Active Bookings.');
    } else {
      toast('Booking rejected and passed to next labour.', { icon: '🔄' });
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesTab = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch = req.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.job.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  })
  // Sort Emergency to top if they are new/pending
  .sort((a, b) => {
    if (a.job.priority === 'Emergency' && b.job.priority !== 'Emergency') return -1;
    if (a.job.priority !== 'Emergency' && b.job.priority === 'Emergency') return 1;
    return 0;
  });

  const summary = {
    new: requests.filter(r => r.status === 'New').length,
    pending: requests.filter(r => r.status === 'Pending').length,
    accepted: requests.filter(r => r.status === 'Accepted').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'Emergency') return 'bg-red-500 text-white border-red-600 animate-pulse';
    if (priority === 'Urgent') return 'bg-amber-100 text-amber-600 border-amber-200';
    return 'bg-green-100 text-green-600 border-green-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* TOP SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New Requests', count: summary.new, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Pending', count: summary.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Accepted', count: summary.accepted, icon: Check, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'Rejected', count: summary.rejected, icon: X, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-10`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.count}</p>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          {['All', 'New', 'Pending', 'Accepted', 'Rejected'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300'}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search request ID, category..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 text-gray-900 dark:text-white" 
          />
        </div>
      </div>

      {/* REQUEST CARDS */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredRequests.map(req => (
            <motion.div 
              key={req.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border shadow-sm transition-all relative ${
                req.job.priority === 'Emergency' && (req.status === 'New' || req.status === 'Pending')
                  ? 'border-red-300 dark:border-red-900/50 shadow-red-100 dark:shadow-red-900/10' 
                  : 'border-gray-200 dark:border-zinc-800'
              }`}
            >
              {/* TOP STRIP - PRIORITY & TIMER */}
              <div className={`px-6 py-3 flex justify-between items-center ${req.job.priority === 'Emergency' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-zinc-800/50'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-gray-500 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-zinc-700 shadow-sm">{req.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${getPriorityColor(req.job.priority)}`}>
                    {req.job.priority} Priority
                  </span>
                </div>
                {(req.status === 'New' || req.status === 'Pending') && (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-900/30 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 shadow-sm">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span>{formatTime(req.timeRemaining)} Left</span>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col xl:flex-row gap-6">
                
                {/* COLUMN 1: Customer Profile & Trust */}
                <div className="xl:w-1/3 space-y-5 border-b xl:border-b-0 xl:border-r border-gray-100 dark:border-zinc-800 pb-6 xl:pb-0 xl:pr-6">
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={req.customer.image} alt={req.customer.name} className="w-16 h-16 rounded-full border-2 border-white dark:border-zinc-800 shadow-md object-cover" />
                      {req.customer.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{req.customer.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs font-bold text-gray-600 dark:text-zinc-400">
                        <span className="flex items-center text-amber-500"><Star className="w-3 h-3 fill-amber-500 mr-0.5" /> {req.customer.rating}</span>
                        <span className="text-gray-300 dark:text-zinc-600">|</span>
                        <span className="flex items-center text-indigo-500"><TrendingUp className="w-3 h-3 mr-0.5" /> Rel: {req.customer.reliability}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Trust Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Completed</p>
                        <p className="font-bold text-gray-900 dark:text-white">{req.customer.completedBookings} Jobs</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Cancellations</p>
                        <p className="font-bold text-gray-900 dark:text-white">{req.customer.cancellationRate}</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-gray-200 dark:border-zinc-700">
                        <p className="text-xs text-gray-500 mb-1">Overall Trust Score</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${req.customer.trustScore}%` }}></div>
                          </div>
                          <span className="font-black text-emerald-600 dark:text-emerald-400">{req.customer.trustScore}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5">
                      <Eye className="w-4 h-4" /> Profile
                    </button>
                    <button className="flex-1 bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-indigo-500" /> Chat
                    </button>
                  </div>

                </div>

                {/* COLUMN 2: Work & Logistics */}
                <div className="xl:w-1/3 space-y-6 border-b xl:border-b-0 xl:border-r border-gray-100 dark:border-zinc-800 pb-6 xl:pb-0 xl:pr-6">
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded font-bold text-[10px] uppercase tracking-wider">{req.job.type}</span>
                      <span className="text-sm font-bold text-gray-500">{req.job.category} &gt; {req.job.subCategory}</span>
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium leading-relaxed bg-indigo-50/50 dark:bg-zinc-800/30 p-3 rounded-xl border border-indigo-100/50 dark:border-zinc-700/50">
                      "{req.job.description}"
                    </p>
                  </div>

                  <div className="space-y-4 bg-gray-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location & Distance</p>
                        <p className="font-bold text-gray-900 dark:text-white">{req.location.area} <span className="text-gray-400 font-normal">({req.location.address})</span></p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">{req.location.distance} away from you</p>
                      </div>
                    </div>
                    
                    <div className="w-full h-px bg-gray-200 dark:bg-zinc-700"></div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                        <p className="font-bold text-gray-900 dark:text-white">{req.schedule.date} at {req.schedule.time}</p>
                        <p className="text-sm text-gray-500 mt-0.5">Est. Duration: <span className="font-bold text-gray-700 dark:text-zinc-300">{req.schedule.duration}</span></p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* COLUMN 3: Earning, AI & Actions */}
                <div className="xl:w-1/3 flex flex-col space-y-5">
                  
                  {/* Earnings Preview */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-5 rounded-2xl border border-green-200 dark:border-green-900/30">
                    <p className="text-[10px] font-bold text-green-700 dark:text-green-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" /> Estimated Net Earnings
                    </p>
                    <p className="text-4xl font-black text-green-600 dark:text-green-400 mb-4 tracking-tight">₹{req.payment.earnings}</p>
                    
                    <div className="space-y-2 text-xs font-bold border-t border-green-200/50 dark:border-green-800/50 pt-3">
                      <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                        <span>Customer Pays</span>
                        <span>₹{req.payment.customerPays}</span>
                      </div>
                      <div className="flex justify-between text-rose-500">
                        <span>Platform Fee (5%)</span>
                        <span>-₹{req.payment.fee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Smart Match & Validation */}
                  <div className="space-y-3 flex-1">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                      <Zap className="w-5 h-5 text-blue-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Smart Match Active</p>
                        <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5 leading-snug">
                          Matches your primary skills. You completed {req.match.similarJobs} similar jobs with a {req.match.successRate}% success rate.
                        </p>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${req.validation.isAvailable ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30 text-green-700 dark:text-green-400' : 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900/30 text-rose-700 dark:text-rose-400'}`}>
                      {req.validation.isAvailable ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                      <div>
                        <p className="text-xs font-bold">{req.validation.isAvailable ? '✅ Schedule Available' : '❌ Time Conflict Detected'}</p>
                        {!req.validation.isAvailable && req.validation.conflictingTime && (
                          <p className="text-[10px] mt-0.5">Clashes with a booking at {req.validation.conflictingTime}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(req.status === 'New' || req.status === 'Pending') ? (
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => handleAction(req.id, 'Rejected')}
                        className="flex-1 py-3.5 bg-white border-2 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-gray-700 dark:text-zinc-300 rounded-xl font-black text-sm transition-all"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'Accepted')}
                        disabled={!req.validation.isAvailable}
                        className={`flex-[2] py-3.5 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                          req.validation.isAvailable 
                            ? 'bg-brand-amber hover:bg-brand-orange text-white cursor-pointer' 
                            : 'bg-gray-300 dark:bg-zinc-700 text-gray-500 cursor-not-allowed shadow-none'
                        }`}
                      >
                        {req.validation.isAvailable ? 'Accept Booking' : 'Unavailable'}
                      </button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl border text-center font-bold text-sm ${req.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {req.status === 'Accepted' ? '✅ You accepted this request' : '❌ You rejected this request'}
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
              <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-zinc-700">
                <CheckCircle2 className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Requests Found</h3>
              <p className="text-gray-500 text-sm font-medium">Try adjusting your filters or keep the app open to receive new jobs.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

