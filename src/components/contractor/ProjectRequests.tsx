import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, MapPin, Calendar, 
  IndianRupee, Clock, Check, X, Eye, ShieldCheck
} from 'lucide-react';

export default function ProjectRequests() {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-901',
      customerName: 'Amitabh Sharma',
      customerAvatar: 'https://i.pravatar.cc/150?u=amitabh',
      title: 'Complete Office Rewiring',
      type: 'Electrical',
      labourRequired: 4,
      budget: '₹85,000 - ₹1,00,000',
      timeline: '15 Days',
      startDate: '01 Jun 2026',
      location: 'Sector 17, Chandigarh',
      isVerified: true,
      postedTime: '2 hours ago'
    },
    {
      id: 'REQ-902',
      customerName: 'Priya Verma',
      customerAvatar: 'https://i.pravatar.cc/150?u=priya2',
      title: 'New Villa Plumbing Layout',
      type: 'Plumbing',
      labourRequired: 2,
      budget: '₹40,000',
      timeline: '7 Days',
      startDate: 'Flexible',
      location: 'Mall Road, Shimla',
      isVerified: true,
      postedTime: '5 hours ago'
    },
    {
      id: 'REQ-903',
      customerName: 'Rahul Enterprises',
      customerAvatar: 'https://i.pravatar.cc/150?u=rahulent',
      title: 'Factory Shed Construction',
      type: 'Construction',
      labourRequired: 15,
      budget: '₹5,50,000',
      timeline: '45 Days',
      startDate: '10 Jun 2026',
      location: 'Industrial Area, Baddi',
      isVerified: false,
      postedTime: '1 day ago'
    }
  ]);

  const handleAction = (id: string, action: 'accept' | 'reject') => {
    setRequests(prev => prev.filter(req => req.id !== id));
    // In a real app, API call would happen here
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">Incoming Project Requests</h2>
          <p className="text-sm text-gray-500 mt-1">You have {requests.length} new requests matching your team's skills.</p>
        </div>
        <div className="bg-brand-amber/10 text-brand-amber px-4 py-2 rounded-xl font-bold">
          {requests.length} Pending
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {requests.map((req) => (
            <motion.div 
              key={req.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Top Customer Info */}
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={req.customerAvatar} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-zinc-700" alt="Customer" />
                    {req.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                      {req.customerName}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {req.postedTime}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700">
                  {req.id}
                </span>
              </div>

              {/* Project Title & Meta */}
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-2">{req.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2.5 py-1 rounded-md">
                    {req.type}
                  </span>
                  <span className="text-xs font-bold text-brand-amber bg-brand-amber/10 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Users className="w-3 h-3" /> {req.labourRequired} Workers Needed
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Budget</p>
                  <p className="text-sm font-black text-green-600 dark:text-green-400">{req.budget}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Timeline</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{req.timeline} (Starts {req.startDate})</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{req.location}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(req.id, 'reject')}
                  className="w-14 h-12 flex items-center justify-center bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 rounded-xl transition-colors shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
                <button className="flex-1 h-12 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl font-bold transition-colors">
                  <Eye className="w-4 h-4" /> View Details
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'accept')}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-brand-amber hover:bg-brand-orange text-white rounded-xl font-bold transition-colors shadow-lg shadow-brand-amber/20"
                >
                  <Check className="w-5 h-5" /> Accept
                </button>
              </div>

            </motion.div>
          ))}
          
          {requests.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
              <Building2 className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No New Requests</h3>
              <p className="text-gray-500 dark:text-zinc-400">You're all caught up! Check back later for new project opportunities.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
