import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Star, TrendingUp, AlertTriangle, 
  CheckCircle2, XCircle, ShieldCheck, Zap, 
  MessageSquare, SlidersHorizontal, ArrowRight, IndianRupee
} from 'lucide-react';

export default function BookingRequests() {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-8821',
      customer: {
        name: 'Mithun Kumar',
        image: 'https://i.pravatar.cc/150?u=mithun',
        rating: 4.8,
        reliability: 96,
        verified: true
      },
      job: {
        category: 'Electrician Work',
        type: 'Emergency Service',
        isEmergency: true
      },
      location: {
        address: 'Shimla Main Road',
        distance: 2.3,
      },
      schedule: {
        date: 'Today',
        time: '10:00 AM',
        duration: '3 hours'
      },
      payment: {
        customerPays: 1000,
        fee: 50,
        earnings: 950
      },
      timeRemaining: 150, // seconds (2:30)
      aiSuggestions: [
        'Similar jobs completed: 48',
        'High chance of customer repeat booking'
      ]
    },
    {
      id: 'REQ-8822',
      customer: {
        name: 'Priya Sharma',
        image: 'https://i.pravatar.cc/150?u=priya',
        rating: 4.5,
        reliability: 88,
        verified: true
      },
      job: {
        category: 'AC Servicing',
        type: 'Hourly Booking',
        isEmergency: false
      },
      location: {
        address: 'Kufri Heights, Block B',
        distance: 5.1,
      },
      schedule: {
        date: 'Tomorrow',
        time: '02:00 PM',
        duration: '2 hours'
      },
      payment: {
        customerPays: 600,
        fee: 30,
        earnings: 570
      },
      timeRemaining: 420, // 7:00
      aiSuggestions: [
        'Expected completion time: 1.5 hours'
      ]
    }
  ]);

  const [filterMode, setFilterMode] = useState('All');

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRequests(prev => prev.map(req => ({
        ...req,
        timeRemaining: Math.max(0, req.timeRemaining - 1)
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = (id: string, action: 'accept' | 'reject') => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-amber/10 dark:bg-brand-amber/20 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-brand-amber" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Incoming Requests</h2>
            <p className="text-xs text-gray-500">Auto-rejects if not accepted</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['All', 'Emergency', 'High Payout', 'Nearby'].map(f => (
            <button 
              key={f}
              onClick={() => setFilterMode(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterMode === f 
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                  : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
          <button className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-xl hover:bg-gray-100 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-6">
        <AnimatePresence>
          {requests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800"
            >
              <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No pending requests</h3>
              <p className="text-gray-500 text-sm">You are all caught up! Make sure you are online to receive jobs.</p>
            </motion.div>
          ) : (
            requests.map(req => {
              const isUrgent = req.timeRemaining < 60;
              
              return (
                <motion.div 
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border shadow-sm transition-all ${
                    req.job.isEmergency 
                      ? 'border-rose-200 dark:border-rose-900/50 shadow-rose-100 dark:shadow-rose-900/10' 
                      : 'border-gray-100 dark:border-zinc-800'
                  }`}
                >
                  {/* Top Notification Bar */}
                  <div className={`px-6 py-2.5 flex justify-between items-center text-xs font-bold uppercase tracking-wider ${
                    req.job.isEmergency ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-gray-50 dark:bg-zinc-800/50 text-gray-500'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      {req.job.isEmergency && <AlertTriangle className="w-3.5 h-3.5" />}
                      {req.job.type}
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${isUrgent ? 'bg-red-500 text-white animate-pulse' : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-white'}`}>
                      <Clock className="w-3.5 h-3.5" /> {formatTime(req.timeRemaining)} Remaining
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      
                      {/* Left: Customer & AI */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img src={req.customer.image} alt="Customer" className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-50 dark:border-zinc-800 shadow-sm" />
                            {req.customer.verified && (
                              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900">
                                <ShieldCheck className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none mb-2">{req.customer.name}</h3>
                            <div className="flex items-center gap-3 text-xs font-bold">
                              <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-2 py-1 rounded-md">
                                <Star className="w-3.5 h-3.5 fill-current" /> {req.customer.rating}
                              </span>
                              <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded-md">
                                <TrendingUp className="w-3.5 h-3.5" /> Rel: {req.customer.reliability}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AI Suggestions */}
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-500/20 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                            <Zap className="w-4 h-4" fill="currentColor" /> AI Smart Match
                          </div>
                          {req.aiSuggestions.map((sug, i) => (
                            <p key={i} className="text-sm text-indigo-900 dark:text-indigo-300 flex items-start gap-2">
                              <span className="text-indigo-400 mt-1">•</span> {sug}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Middle: Job Details */}
                      <div className="lg:col-span-4 space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Service Required</p>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">{req.job.category}</p>
                        </div>
                        
                        <div className="flex items-start gap-3 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl">
                          <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{req.location.distance} km away</p>
                            <p className="text-xs text-gray-500">{req.location.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl">
                          <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{req.schedule.date} – {req.schedule.time}</p>
                            <p className="text-xs text-gray-500">Est. Duration: {req.schedule.duration}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment & Actions */}
                      <div className="lg:col-span-3 flex flex-col justify-between">
                        <div className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-4 border border-green-100 dark:border-green-500/20 mb-4">
                          <p className="text-[10px] font-bold text-green-700 dark:text-green-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" /> Estimated Earnings
                          </p>
                          <p className="text-3xl font-black text-green-600 mb-3">₹{req.payment.earnings}</p>
                          <div className="flex justify-between text-xs text-green-800/70 dark:text-green-400/70 border-t border-green-200/50 dark:border-green-900/50 pt-2">
                            <span>Cust. Pays: ₹{req.payment.customerPays}</span>
                            <span>Fee: -₹{req.payment.fee}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleAction(req.id, 'accept')}
                            className="w-full bg-brand-amber hover:bg-brand-orange text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-brand-amber/20 flex items-center justify-center gap-2"
                          >
                            Accept Job <ArrowRight className="w-4 h-4" />
                          </button>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAction(req.id, 'reject')}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                            <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5">
                              <MessageSquare className="w-4 h-4" /> Chat
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
