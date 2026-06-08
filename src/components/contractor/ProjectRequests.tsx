import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, MapPin, Calendar, IndianRupee, Clock, Check, X, Eye, 
  ShieldCheck, Star, Activity, Phone, MessageSquare, AlertCircle, FileText, 
  Send, Bot, Search, Filter
} from 'lucide-react';

interface Request {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  reliability: number;
  isVerified: boolean;
  title: string;
  category: string;
  description: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  labourRequired: number;
  skills: { role: string; count: number }[];
  location: string;
  distance: string;
  startDate: string;
  endDate: string;
  duration: string;
  budgetMin: number;
  budgetMax: number;
  estimatedRevenue: number;
  platformFee: number;
  netEarnings: number;
  availableWorkers: number;
  aiRecommendation: string;
  status: 'New' | 'Pending' | 'Accepted' | 'Rejected';
}

const mockRequests: Request[] = [
  {
    id: 'REQ-24581',
    customerName: 'Mithun Kumar',
    customerAvatar: 'https://i.pravatar.cc/150?u=mithun',
    rating: 4.8,
    reliability: 96,
    isVerified: true,
    title: 'House Construction',
    category: 'Construction',
    description: 'Need 10 workers for residential construction project in the main city area.',
    priority: 'Urgent',
    labourRequired: 10,
    skills: [
      { role: 'Mason', count: 4 },
      { role: 'Electrician', count: 2 },
      { role: 'Painter', count: 4 }
    ],
    location: 'Shimla Main Road',
    distance: '12 km',
    startDate: '25 May 2026',
    endDate: '10 Jun 2026',
    duration: '16 Days',
    budgetMin: 50000,
    budgetMax: 70000,
    estimatedRevenue: 65000,
    platformFee: 3250,
    netEarnings: 61750,
    availableWorkers: 12,
    aiRecommendation: 'Similar project completed successfully 8 times. Recommended team size: 12 workers. Expected completion time: 14 days.',
    status: 'New'
  },
  {
    id: 'REQ-24582',
    customerName: 'Priya Verma',
    customerAvatar: 'https://i.pravatar.cc/150?u=priya2',
    rating: 4.2,
    reliability: 88,
    isVerified: true,
    title: 'Commercial Plumbing Revamp',
    category: 'Plumbing',
    description: 'Full commercial plumbing system upgrade for a 3-story office block.',
    priority: 'Normal',
    labourRequired: 5,
    skills: [
      { role: 'Master Plumber', count: 2 },
      { role: 'Helper', count: 3 }
    ],
    location: 'Sector 17, Chandigarh',
    distance: '25 km',
    startDate: '01 Jun 2026',
    endDate: '07 Jun 2026',
    duration: '7 Days',
    budgetMin: 30000,
    budgetMax: 45000,
    estimatedRevenue: 40000,
    platformFee: 2000,
    netEarnings: 38000,
    availableWorkers: 3,
    aiRecommendation: 'Warning: Team availability is low. Consider subcontracting or proposing a delayed start.',
    status: 'Pending'
  }
];

export default function ProjectRequests() {
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [activeFilter, setActiveFilter] = useState<'All' | 'New' | 'Pending' | 'Accepted' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quote Modal State
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedReqForQuote, setSelectedReqForQuote] = useState<Request | null>(null);
  const [quoteDetails, setQuoteDetails] = useState({ price: '', size: '', days: '', message: '' });

  const handleAction = (id: string, action: 'Accepted' | 'Rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

  const openQuoteModal = (req: Request) => {
    setSelectedReqForQuote(req);
    setQuoteDetails({
      price: req.estimatedRevenue.toString(),
      size: req.labourRequired.toString(),
      days: req.duration.replace(/\D/g, ''),
      message: 'Hi, we have reviewed your requirement and can fulfill this project efficiently.'
    });
    setShowQuoteModal(true);
  };

  const submitQuote = () => {
    alert(`Quote sent successfully for ${selectedReqForQuote?.id}!`);
    setShowQuoteModal(false);
  };

  const filteredRequests = requests.filter(req => {
    const matchesTab = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const summary = {
    new: requests.filter(r => r.status === 'New').length,
    pending: requests.filter(r => r.status === 'Pending').length,
    accepted: requests.filter(r => r.status === 'Accepted').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'Emergency') return 'bg-red-100 text-red-600 border-red-200';
    if (priority === 'Urgent') return 'bg-amber-100 text-amber-600 border-amber-200';
    return 'bg-green-100 text-green-600 border-green-200';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* TOP SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'New Requests', count: summary.new, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Pending Quotes', count: summary.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
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

      {/* SEARCH & FILTERS */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          {['All', 'New', 'Pending', 'Accepted', 'Rejected'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300'}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search request ID, name..." 
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
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-md overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                
                {/* LEFT COL: CUSTOMER & PROJECT INFO */}
                <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-gray-150 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-gray-500 bg-gray-200/50 dark:bg-zinc-800 px-2 py-1 rounded-md">{req.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getPriorityColor(req.priority)} uppercase tracking-wider`}>
                      {req.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img src={req.customerAvatar} className="w-14 h-14 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm" alt="Avatar" />
                      {req.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-white">
                          <ShieldCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{req.customerName}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs font-bold text-gray-600 dark:text-zinc-400">
                        <span className="flex items-center text-amber-500"><Star className="w-3 h-3 fill-amber-500 mr-0.5"/> {req.rating}</span>
                        <span className="flex items-center"><Activity className="w-3 h-3 text-indigo-500 mr-0.5"/> {req.reliability}% Rel.</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">{req.title}</h4>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-md mb-3">
                    {req.category}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-3 mb-6">
                    {req.description}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold py-2.5 rounded-xl text-sm transition-colors">
                      <MessageSquare className="w-4 h-4" /> Chat
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 text-green-600 dark:text-green-400 font-bold py-2.5 rounded-xl text-sm transition-colors">
                      <Phone className="w-4 h-4" /> Call
                    </button>
                  </div>
                </div>

                {/* RIGHT COL: DETAILS, AI & ACTIONS */}
                <div className="lg:w-2/3 p-6">
                  
                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Required</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{req.labourRequired} Workers</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Duration</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{req.duration}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Distance</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{req.distance}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Starts</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{req.startDate}</p>
                    </div>
                  </div>

                  {/* Skills Map */}
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Required Skills Map</p>
                    <div className="flex flex-wrap gap-2">
                      {req.skills.map((s, i) => (
                        <span key={i} className="text-xs font-bold text-gray-700 bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300 px-3 py-1 rounded-lg">
                          {s.role} <span className="text-indigo-600 dark:text-indigo-400 ml-1">× {s.count}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Finance & Budget Box */}
                  <div className="bg-gray-50 dark:bg-zinc-800/40 rounded-2xl p-4 border border-gray-200 dark:border-zinc-700 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Customer Budget Range</p>
                      <p className="font-bold text-gray-900 dark:text-white mt-0.5">₹{req.budgetMin.toLocaleString()} – ₹{req.budgetMax.toLocaleString()}</p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-gray-300 dark:bg-zinc-700"></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Platform Fee (5%)</p>
                      <p className="font-bold text-rose-500 mt-0.5">-₹{req.platformFee.toLocaleString()}</p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-gray-300 dark:bg-zinc-700"></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Est. Net Earnings</p>
                      <p className="text-lg font-black text-green-600 dark:text-green-400 mt-0.5 flex items-center gap-1"><IndianRupee className="w-4 h-4"/>{req.netEarnings.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* AI & Team Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Team check */}
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${req.availableWorkers >= req.labourRequired ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-900/30'}`}>
                      <Users className={`w-5 h-5 mt-0.5 ${req.availableWorkers >= req.labourRequired ? 'text-green-600' : 'text-rose-600'}`} />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">Team Availability Check</p>
                        <p className={`text-[10px] font-semibold mt-1 ${req.availableWorkers >= req.labourRequired ? 'text-green-600' : 'text-rose-600'}`}>
                          Required: {req.labourRequired} | Available: {req.availableWorkers}
                        </p>
                        <p className={`text-xs font-bold mt-1.5 ${req.availableWorkers >= req.labourRequired ? 'text-green-600' : 'text-rose-600'}`}>
                          {req.availableWorkers >= req.labourRequired ? '✅ Team Available' : '❌ Insufficient Team'}
                        </p>
                      </div>
                    </div>
                    {/* AI Suggest */}
                    <div className="bg-indigo-50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-900/30 p-4 rounded-xl border flex items-start gap-3">
                      <Bot className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">AI Recommendation</p>
                        <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1 leading-snug">
                          {req.aiRecommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {req.status === 'New' || req.status === 'Pending' ? (
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleAction(req.id, 'Rejected')}
                        className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 rounded-xl font-bold text-sm transition-all"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => openQuoteModal(req)}
                        className="flex-1 px-6 py-3 bg-brand-amber hover:bg-brand-orange text-white rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" /> Custom Quote
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'Accepted')}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Accept As-Is
                      </button>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl border text-center font-bold text-sm ${req.status === 'Accepted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {req.status === 'Accepted' ? '✅ You have accepted this project' : '❌ You rejected this project'}
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
              <Building2 className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Requests Found</h3>
              <p className="text-gray-500 dark:text-zinc-400">We couldn't find any requests matching your filters.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* CUSTOM QUOTE MODAL */}
      {showQuoteModal && selectedReqForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Send Custom Quote</h3>
                <p className="text-xs text-gray-500">For {selectedReqForQuote.title} ({selectedReqForQuote.id})</p>
              </div>
              <button onClick={() => setShowQuoteModal(false)} className="text-gray-400 hover:text-rose-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Proposed Total Price (₹)</label>
                  <input 
                    type="number" 
                    value={quoteDetails.price}
                    onChange={(e) => setQuoteDetails({...quoteDetails, price: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-gray-900 dark:text-white font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Proposed Team Size</label>
                  <input 
                    type="number" 
                    value={quoteDetails.size}
                    onChange={(e) => setQuoteDetails({...quoteDetails, size: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-gray-900 dark:text-white font-bold" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Est. Completion Time (Days)</label>
                <input 
                  type="number" 
                  value={quoteDetails.days}
                  onChange={(e) => setQuoteDetails({...quoteDetails, days: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-gray-900 dark:text-white font-bold" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Personal Message to Customer</label>
                <textarea 
                  rows={3}
                  value={quoteDetails.message}
                  onChange={(e) => setQuoteDetails({...quoteDetails, message: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-gray-900 dark:text-white" 
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
              <button 
                onClick={() => setShowQuoteModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button 
                onClick={submitQuote}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Quote
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
