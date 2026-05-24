import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Phone, MessageSquare, ShieldAlert, 
  Navigation, CheckCircle2, ChevronRight, AlertTriangle,
  WifiOff, Map, RefreshCcw, MoreVertical, XCircle, AlertCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues with leaflet
const LiveMap = dynamic(() => import('./LiveMap'), { ssr: false });

type Role = 'customer' | 'labour';

const STATUS_STEPS = [
  'Booking Requested',
  'Accepted',
  'Labour Assigned',
  'Labour On The Way',
  'Arrived',
  'Work Started',
  'Work Completed',
  'Payment Completed'
];

export default function LiveBookingTracker() {
  const [role, setRole] = useState<Role>('customer');
  const [currentStepIndex, setCurrentStepIndex] = useState(3); // Default: "Labour On The Way"
  
  // Edge case states
  const [isOffline, setIsOffline] = useState(false);
  const [gpsOff, setGpsOff] = useState(false);

  // Mock data updates
  const [eta, setEta] = useState(8);
  const [distance, setDistance] = useState(2.5);

  // Map and Location States
  const [customerLocation] = useState<[number, number]>([31.1048, 77.1734]); // Shimla approx
  const [labourLocation, setLabourLocation] = useState<[number, number]>([31.1000, 77.1650]);
  
  // Real-time tracking Simulation (Socket.io mock)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Safety Rule: Only track if Accepted, Assigned, On The Way, or Arrived.
    // Stop tracking after completed (idx 6). Hide before accepted (idx < 1).
    const isTrackingActive = currentStepIndex >= 1 && currentStepIndex < 6 && !isOffline && !gpsOff;

    if (isTrackingActive) {
      interval = setInterval(() => {
        setLabourLocation(prev => {
          // Move labour slowly towards customer
          const latDiff = customerLocation[0] - prev[0];
          const lngDiff = customerLocation[1] - prev[1];
          
          if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
            if (currentStepIndex === 3) handleLabourAction(4); // Arrived automatically
            return prev;
          }
          
          // Update distance & ETA (mocked based on progress)
          const newDist = (Math.sqrt(latDiff*latDiff + lngDiff*lngDiff) * 111).toFixed(1);
          setDistance(parseFloat(newDist));
          setEta(Math.ceil(parseFloat(newDist) * 3)); // ~3 min per km

          return [
            prev[0] + latDiff * 0.1,
            prev[1] + lngDiff * 0.1
          ];
        });
      }, 2000); // 2 sec update for demo
    }

    return () => {
      if (interval) clearInterval(interval);
    }
  }, [currentStepIndex, customerLocation, isOffline, gpsOff]);

  const activeStatus = STATUS_STEPS[currentStepIndex];

  // Labour Side Status Handlers
  const handleLabourAction = (nextStepIndex: number) => {
    setCurrentStepIndex(nextStepIndex);
  };

  const handleSOS = () => {
    alert('SOS Activated! Live location shared with admin and emergency contacts.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header & Role Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Live Booking Tracker</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time status, map tracking, and SOS safety.</p>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl inline-flex shadow-inner w-full md:w-auto">
          <button onClick={() => setRole('customer')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'customer' ? 'bg-white dark:bg-zinc-800 text-brand-amber shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'}`}>Customer View</button>
          <button onClick={() => setRole('labour')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'labour' ? 'bg-white dark:bg-zinc-800 text-brand-amber shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'}`}>Labour View</button>
        </div>
      </div>

      {/* Edge Case Warnings */}
      <AnimatePresence>
        {(isOffline || gpsOff) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-2">
            {isOffline && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 p-4 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-400">
                <WifiOff className="w-5 h-5 shrink-0" />
                <p className="text-sm font-bold flex-1">Labour internet disconnected. Auto-reconnecting...</p>
                <RefreshCcw className="w-4 h-4 animate-spin shrink-0" />
              </div>
            )}
            {gpsOff && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 rounded-2xl flex items-center gap-3 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-bold flex-1">GPS signal lost. ETA might be inaccurate.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Map & Primary Actions */}
        <div className="flex-1 space-y-6">
          
          {/* Real-time Map Container */}
          <div className="bg-gray-200 dark:bg-zinc-800 h-64 md:h-80 rounded-3xl relative overflow-hidden shadow-inner border border-gray-300 dark:border-zinc-700">
            
            <LiveMap 
              customerLocation={customerLocation} 
              labourLocation={labourLocation} 
              isTracking={currentStepIndex >= 1 && currentStepIndex < 6} 
            />

            {/* Map Overlay Stats */}
            {currentStepIndex >= 3 && currentStepIndex <= 4 && (
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-gray-150 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Distance</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{distance} km</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-zinc-700"></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ETA</p>
                    <p className="text-lg font-black text-brand-amber">{eta} min</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* SOS Overlay */}
            {role === 'customer' && (
               <button onClick={handleSOS} className="absolute bottom-4 right-4 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-2xl shadow-xl shadow-rose-600/30 font-black tracking-wider flex items-center gap-2 transition-transform active:scale-95">
                 <ShieldAlert className="w-5 h-5" /> SOS
               </button>
            )}
          </div>

          {/* Customer Specific Action Buttons */}
          {role === 'customer' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm">
                <Phone className="w-4 h-4 text-green-500" /> Call
              </button>
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm">
                <MessageSquare className="w-4 h-4 text-blue-500" /> Chat
              </button>
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-3 rounded-2xl text-sm font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Complaint
              </button>
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-3 rounded-2xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 shadow-sm">
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}

          {/* Labour Specific Action Controls */}
          {role === 'labour' && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm mb-2">Update Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button 
                  disabled={currentStepIndex >= 1}
                  onClick={() => handleLabourAction(1)} 
                  className={`p-3 rounded-xl font-bold text-sm transition-all ${currentStepIndex >= 1 ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500' : 'bg-brand-amber text-white hover:bg-brand-orange shadow-md'}`}
                >
                  Accept Booking
                </button>
                <button 
                  disabled={currentStepIndex >= 3}
                  onClick={() => handleLabourAction(3)} 
                  className={`p-3 rounded-xl font-bold text-sm transition-all ${currentStepIndex >= 3 ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'}`}
                >
                  Start Journey
                </button>
                <button 
                  disabled={currentStepIndex >= 4}
                  onClick={() => handleLabourAction(4)} 
                  className={`p-3 rounded-xl font-bold text-sm transition-all ${currentStepIndex >= 4 ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500' : 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md'}`}
                >
                  Arrived
                </button>
                <button 
                  disabled={currentStepIndex >= 5}
                  onClick={() => handleLabourAction(5)} 
                  className={`p-3 rounded-xl font-bold text-sm transition-all ${currentStepIndex >= 5 ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-md'}`}
                >
                  Start Work
                </button>
                <button 
                  disabled={currentStepIndex >= 6}
                  onClick={() => handleLabourAction(6)} 
                  className={`p-3 rounded-xl font-bold text-sm transition-all ${currentStepIndex >= 6 ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500' : 'bg-green-500 text-white hover:bg-green-600 shadow-md'}`}
                >
                  Complete Work
                </button>
                <button 
                  disabled={currentStepIndex >= 7}
                  onClick={() => handleLabourAction(7)} 
                  className={`p-3 rounded-xl font-bold text-sm transition-all ${currentStepIndex >= 7 ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'}`}
                >
                  Confirm Payment
                </button>
              </div>

              {/* Edge Case Toggles for testing */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 mt-4 flex gap-4">
                 <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 dark:text-zinc-400">
                    <input type="checkbox" checked={isOffline} onChange={e => setIsOffline(e.target.checked)} className="rounded text-rose-500 focus:ring-rose-500" />
                    Simulate Disconnect
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 dark:text-zinc-400">
                    <input type="checkbox" checked={gpsOff} onChange={e => setGpsOff(e.target.checked)} className="rounded text-amber-500 focus:ring-amber-500" />
                    Simulate GPS Off
                 </label>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Details & Timeline */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Booking Info Card */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/10 rounded-bl-[100px]"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">#RZH-24581</span>
              <button><MoreVertical className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <img src="https://i.pravatar.cc/150?u=ravi_e" alt="Labour" className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Ravi Kumar</h3>
                <p className="text-xs text-brand-amber font-bold">Electrician • ⭐ 4.8</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-zinc-400 relative z-10 border-t border-gray-100 dark:border-zinc-800 pt-4">
              <p className="flex justify-between"><span>Scheduled:</span> <strong className="text-gray-900 dark:text-white">Today, 10:00 AM</strong></p>
              <p className="flex justify-between"><span>Service:</span> <strong className="text-gray-900 dark:text-white">Hourly Booking</strong></p>
            </div>
          </div>

          {/* Timeline Status */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Live Progress</h3>
            <div className="space-y-0 relative">
              {/* Connecting Line */}
              <div className="absolute top-4 bottom-4 left-3 w-px bg-gray-200 dark:bg-zinc-800" />
              
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                
                return (
                  <div key={step} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                      isCompleted ? 'bg-green-500 border-green-500' : 
                      isCurrent ? 'bg-brand-amber border-brand-amber ring-4 ring-brand-amber/20' : 
                      'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : 
                       isCurrent ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : null}
                    </div>
                    <div className="flex-1 mt-0.5">
                      <p className={`text-sm font-bold transition-colors ${
                        isCompleted ? 'text-gray-900 dark:text-white' : 
                        isCurrent ? 'text-brand-amber' : 
                        'text-gray-400 dark:text-zinc-600'
                      }`}>{step}</p>
                      {isCurrent && (
                        <p className="text-xs text-gray-500 mt-1">In progress...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
