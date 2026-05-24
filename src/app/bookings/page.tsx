'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BookingHistory from '@/components/booking/BookingHistory';

type FlowStep = 
  | 'search_select' 
  | 'booking_input' 
  | 'worker_decision' 
  | 'tracking' 
  | 'arrival_gate' 
  | 'start_gate' 
  | 'completion_gate' 
  | 'payment' 
  | 'feedback' 
  | 'done';

export default function BookingsDashboard() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'history'>('simulator');
  const [simulatorStep, setSimulatorStep] = useState<FlowStep>('search_select');

  // Booking Simulation States
  const [bookingId, setBookingId] = useState('BKG-1029');
  const [selectedWorker, setSelectedWorker] = useState('Ramesh Kumar');
  const [selectedCategory, setSelectedCategory] = useState('Electrician');
  const [bookingType, setBookingType] = useState<'hourly' | 'daily' | 'project'>('hourly');
  const [bookingDate, setBookingDate] = useState('2026-05-20');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingAddress, setBookingAddress] = useState('Flat 402, Block-A, Green Ridge Society, Delhi');
  const [enteredOtp, setEnteredOtp] = useState('');

  // Live Geolocation Tracking States
  const [etaMinutes, setEtaMinutes] = useState(5);
  const [gpsX, setGpsX] = useState(25); // Percentage of left position
  const [trackingStatus, setTrackingStatus] = useState('On the way - Worker heading to your location');

  // Reschedule Modal States
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('2026-05-21');
  const [rescheduleTime, setRescheduleTime] = useState('02:00 PM');

  // Cancellation, Warnings, Penalties & Suspension State
  const [approvalTimeLeft, setApprovalTimeLeft] = useState<number>(1800); // 30 mins in seconds (1800s)
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [cancellationStrikes, setCancellationStrikes] = useState<number>(1); // 1 out of 3 strikes
  const [accountStatus, setAccountStatus] = useState<'Good Standing' | 'Warning Alert' | 'Suspended'>('Good Standing');
  const [penaltyCharged, setPenaltyCharged] = useState<number>(0);

  // Two-Way Rating System States
  const [ratingReason, setRatingReason] = useState<'completion' | 'labour_cancel' | 'customer_cancel'>('completion');
  const [customerRatingForWorker, setCustomerRatingForWorker] = useState<number>(5);
  const [workerRatingForCustomer, setWorkerRatingForCustomer] = useState<number>(5);
  const [customerComment, setCustomerComment] = useState('');
  const [workerComment, setWorkerComment] = useState('');

  // Generated OTPs for validation
  const arrivalOTP = '4928';
  const startOTP = '7301';
  const completeOTP = '9185';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  // 30-Minute Cancellation Window countdown simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulatorStep === 'tracking' || simulatorStep === 'arrival_gate') {
      interval = setInterval(() => {
        setApprovalTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulatorStep]);

  // Geolocation Movement simulator effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simulatorStep === 'tracking') {
      setEtaMinutes(5);
      setGpsX(25);
      setTrackingStatus('On the way - Worker heading to your location');

      timer = setInterval(() => {
        setEtaMinutes((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGpsX(70); // Arrived location coordinate
            setTrackingStatus('Arrived - Professional at your doorstep!');
            return 0;
          }
          const nextMinutes = prev - 2;
          // Animate the worker icon closer to the home (which is located at left: 75%)
          setGpsX((x) => Math.min(x + 18, 70));
          return nextMinutes < 0 ? 0 : nextMinutes;
        });
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [simulatorStep]);

  // Draft Autosave System using LocalStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('rozgaar_booking_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setSelectedWorker(draft.worker || 'Ramesh Kumar');
        setSelectedCategory(draft.category || 'Electrician');
        setBookingType(draft.type || 'hourly');
        setBookingDate(draft.date || '2026-05-20');
        setBookingTime(draft.time || '10:00 AM');
        setBookingAddress(draft.address || 'Flat 402, Block-A, Green Ridge Society, Delhi');
      } catch (e) {
        console.error('Failed to parse autosave draft', e);
      }
    }
  }, []);

  // Save draft details automatically when changed
  const saveDraft = (updatedFields: any) => {
    const draft = {
      worker: selectedWorker,
      category: selectedCategory,
      type: bookingType,
      date: bookingDate,
      time: bookingTime,
      address: bookingAddress,
      ...updatedFields
    };
    localStorage.setItem('rozgaar_booking_draft', JSON.stringify(draft));
  };

  const handleFieldChange = (field: string, value: any) => {
    if (field === 'type') setBookingType(value);
    if (field === 'date') setBookingDate(value);
    if (field === 'time') setBookingTime(value);
    if (field === 'address') setBookingAddress(value);
    saveDraft({ [field]: value });
  };

  const resetSimulator = () => {
    setSimulatorStep('search_select');
    setEnteredOtp('');
    setApprovalTimeLeft(1800);
    setShowCancelWarning(false);
    setPenaltyCharged(0);
    setCustomerComment('');
    setWorkerComment('');
    setCustomerRatingForWorker(5);
    setWorkerRatingForCustomer(5);
    localStorage.removeItem('rozgaar_booking_draft');
  };

  // Reschedule trigger keeping SAME booking ID
  const handleRescheduleConfirm = () => {
    setBookingDate(rescheduleDate);
    setBookingTime(rescheduleTime);
    setIsRescheduling(false);
    setSimulatorStep('worker_decision'); // Reset to decision phase
    alert(`Success: Rescheduled Booking ${bookingId}! Preserved same Booking ID.`);
  };

  // Format cancellation time left mm:ss
  const formatTimeLeft = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Process Booking Cancellation with smart penalty/suspension logic
  const handleProcessCancellation = () => {
    setShowCancelWarning(false);
    
    // Check if cancellation is within 30 mins window
    const isWithin30Mins = approvalTimeLeft > 0;
    let penalty = 0;
    
    if (!isWithin30Mins) {
      penalty = 150;
      setPenaltyCharged(penalty);
    }

    // Recalculate strike limits
    const nextStrikes = cancellationStrikes + 1;
    setCancellationStrikes(nextStrikes);

    let statusUpdate = accountStatus;
    if (nextStrikes === 2) {
      statusUpdate = 'Warning Alert';
      setAccountStatus('Warning Alert');
    } else if (nextStrikes >= 3) {
      statusUpdate = 'Suspended';
      setAccountStatus('Suspended');
    }

    // Set ratingReason to customer_cancel so worker can rate customer
    setRatingReason('customer_cancel');
    setSimulatorStep('feedback'); // Transition to feedback rating screen
  };

  // Helper to determine status style of each timeline step
  const getTimelineStepStatus = (stepName: string) => {
    const sequence = [
      'requested',
      'accepted',
      'assigned',
      'on_the_way',
      'arrived',
      'work_started',
      'work_completed',
      'payment_completed'
    ];

    let currentIndex = 0;
    if (simulatorStep === 'search_select' || simulatorStep === 'booking_input') currentIndex = 0;
    else if (simulatorStep === 'worker_decision') currentIndex = 2;
    else if (simulatorStep === 'tracking') {
      currentIndex = etaMinutes === 0 ? 4 : 3;
    }
    else if (simulatorStep === 'arrival_gate') currentIndex = 4;
    else if (simulatorStep === 'start_gate') currentIndex = 5;
    else if (simulatorStep === 'completion_gate') currentIndex = 6;
    else if (simulatorStep === 'payment' || simulatorStep === 'feedback' || simulatorStep === 'done') currentIndex = 7;

    const targetIndex = sequence.indexOf(stepName);
    if (targetIndex < currentIndex) return 'completed';
    if (targetIndex === currentIndex) return 'active';
    return 'pending';
  };

  const renderTimelineNode = (stepName: string, title: string, subtitle: string) => {
    const status = getTimelineStepStatus(stepName);
    
    let circleStyle = 'bg-gray-200 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 text-transparent';
    let textStyle = 'text-gray-400 dark:text-zinc-500';
    
    if (status === 'completed') {
      circleStyle = 'bg-green-500 border-green-600 shadow text-white';
      textStyle = 'text-green-600 dark:text-green-400 font-semibold';
    } else if (status === 'active') {
      circleStyle = 'bg-indigo-600 border-indigo-700 shadow-md text-white ring-4 ring-indigo-500/20 animate-pulse';
      textStyle = 'text-indigo-600 dark:text-indigo-400 font-bold';
    }

    return (
      <div className="relative pl-8 pb-6 last:pb-0">
        <div className="absolute left-3.5 top-2.5 bottom-0 w-0.5 bg-gray-200 dark:bg-zinc-850"></div>
        <span className={`absolute left-0 top-1 h-7 w-7 rounded-full border-2 flex items-center justify-center text-[10px] transition-all ${circleStyle}`}>
          {status === 'completed' ? '✓' : '•'}
        </span>
        <div className="space-y-0.5">
          <p className={`text-xs uppercase tracking-wider ${textStyle}`}>{title}</p>
          <p className="text-[10px] text-gray-400">{subtitle}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Home Navigation */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rozgaar GPS Telemetry</span>
      </div>

      <div className="mx-auto max-w-6xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-150 dark:border-zinc-800/80 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-zinc-850">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'simulator'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🕹️ Live Geolocation & GPS Flow Simulator
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            📋 Booking History Logs
          </button>
        </div>

        {/* Tab 1: Live Simulator */}
        {activeTab === 'simulator' && (
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Interactive Simulation Screen */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Step Progress Visual Tracker */}
              <div className="flex justify-between items-center overflow-x-auto gap-4 py-3 border-b border-gray-100 dark:border-zinc-850 scrollbar-none">
                {[
                  { name: '1. Pro', key: ['search_select'] },
                  { name: '2. Setup', key: ['booking_input'] },
                  { name: '3. Decision', key: ['worker_decision'] },
                  { name: '4. Tracking', key: ['tracking'] },
                  { name: '5. OTP Arrival', key: ['arrival_gate'] },
                  { name: '6. OTP Started', key: ['start_gate'] },
                  { name: '7. OTP Finished', key: ['completion_gate'] },
                  { name: '8. Payment', key: ['payment'] },
                  { name: '9. Stars', key: ['feedback', 'done'] },
                ].map((step, idx) => {
                  const isActive = step.key.includes(simulatorStep);
                  return (
                    <span 
                      key={idx}
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md whitespace-nowrap transition-all ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-gray-100 text-gray-400 dark:bg-zinc-855 dark:text-zinc-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  );
                })}
              </div>

              {/* Account Status / Warning suspension bar */}
              <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs">🛡️</span>
                  <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-300">
                    Suspension Risk Index: <strong className="text-indigo-600 dark:text-indigo-400">{cancellationStrikes}/3 strikes</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Account status:</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    accountStatus === 'Good Standing' ? 'bg-green-50 text-green-700' :
                    accountStatus === 'Warning Alert' ? 'bg-amber-50 text-amber-700 animate-pulse' : 'bg-red-50 text-red-700'
                  }`}>
                    {accountStatus}
                  </span>
                </div>
              </div>

              {/* STEP 1: Search & Select */}
              {simulatorStep === 'search_select' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose a specialist to begin</h3>
                    <p className="text-xs text-gray-550">Pick a professional from search parameters to initiate the booking pipeline.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Ramesh Kumar', category: 'Electrician', rate: '₹400/hr' },
                      { name: 'Suresh Singh', category: 'Plumber', rate: '₹350/hr' },
                      { name: 'Amit Sharma', category: 'Carpenter', rate: '₹500/hr' },
                    ].map((worker, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-zinc-950 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{worker.name}</h4>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{worker.category} | {worker.rate}</p>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedWorker(worker.name);
                            setSelectedCategory(worker.category);
                            saveDraft({ worker: worker.name, category: worker.category });
                            setSimulatorStep('booking_input');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Select Pro →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Input booking details */}
              {simulatorStep === 'booking_input' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Choose Parameters & Confirm</h3>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">💾 Draft saved automatically!</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Booking Type</label>
                      <select 
                        value={bookingType}
                        onChange={(e) => handleFieldChange('type', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                      >
                        <option value="hourly">Hourly Contract (Rate base)</option>
                        <option value="daily">Daily Contract (Base rate per day)</option>
                        <option value="project">Project Fixed Contract (Milestone pay)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Select Date</label>
                        <input 
                          type="date" 
                          value={bookingDate}
                          onChange={(e) => handleFieldChange('date', e.target.value)}
                          className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Select Slot</label>
                        <input 
                          type="text" 
                          value={bookingTime}
                          onChange={(e) => handleFieldChange('time', e.target.value)}
                          className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Overlap Clash Trigger */}
                    <div className="bg-amber-50 dark:bg-amber-955/20 border border-amber-250 dark:border-amber-900/30 p-4 rounded-2xl flex justify-between items-center">
                      <span className="text-[11px] text-gray-505 font-semibold">Test auto overlap conflict guard:</span>
                      <button 
                        type="button"
                        onClick={() => alert('Auto Overlap Prevention Triggered! Reason: Plumber Suresh Singh has a Confirmed block on May 20 between 10:00 AM - 12:00 PM. Double booking rejected!')}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                      >
                        Trigger Conflict Check
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Work Address Location</label>
                      <textarea 
                        value={bookingAddress}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                      />
                    </div>

                    <button 
                      onClick={() => {
                        localStorage.removeItem('rozgaar_booking_draft');
                        setSimulatorStep('worker_decision');
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg"
                    >
                      Confirm Booking Assignment →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Worker Decision */}
              {simulatorStep === 'worker_decision' && (
                <div className="space-y-6 text-center max-w-md mx-auto">
                  <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                    📱
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Worker Review</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Booking ID: {bookingId}</p>
                    <p className="text-xs text-gray-500">
                      Waiting for <strong className="text-gray-900 dark:text-white">{selectedWorker}</strong> to accept your reservation.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">Date: {bookingDate}</span>
                      <button 
                        onClick={() => setIsRescheduling(true)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        ✏️ Reschedule Booking
                      </button>
                    </div>
                    <p className="text-xs text-gray-650 dark:text-zinc-400">Time: {bookingTime}</p>
                    <p className="text-xs text-gray-650 dark:text-zinc-400">Address: {bookingAddress}</p>
                  </div>

                  {/* Rating simulation on Labour Cancellation */}
                  <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl flex justify-between items-center text-xs">
                    <span className="font-semibold text-red-750">Test Labour Cancellation Rating loop:</span>
                    <button 
                      onClick={() => {
                        setRatingReason('labour_cancel');
                        setSimulatorStep('feedback'); // Customer can rate labour
                        alert('Simulating Labour Cancellation trigger! Customer redirected to rating console.');
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                    >
                      Labour Cancel
                    </button>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => {
                        alert('Simulated Worker Action: REJECTED. Returning to search select...');
                        setSimulatorStep('search_select');
                      }}
                      className="flex-1 bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200 dark:border-red-900/30 py-3.5 rounded-xl font-bold text-xs"
                    >
                      Worker Reject
                    </button>
                    <button 
                      onClick={() => {
                        alert('Simulated Worker Action: ACCEPTED. Initializing tracking coordinates...');
                        setSimulatorStep('tracking');
                        setApprovalTimeLeft(1800); // Start 30 min cancellation counter
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-xs"
                    >
                      Worker Accept
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Live Geolocation GPS Tracking Simulator */}
              {simulatorStep === 'tracking' && (
                <div className="space-y-6 text-center max-w-xl mx-auto">
                  
                  {/* Cancellation window countdown banner */}
                  <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/30 p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-left">
                      <span className="text-[10px] text-red-650 dark:text-red-400 uppercase font-bold tracking-widest block">30-Min Cancellation Window</span>
                      <p className="text-xs text-gray-500 font-medium">Cancel within 30 minutes after approval free of penalty.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono font-bold text-red-650 dark:text-red-400">
                        ⏱️ {formatTimeLeft(approvalTimeLeft)}
                      </span>
                      <button
                        onClick={() => setShowCancelWarning(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-[10px]"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                      <span>Step 4: Live Geolocation GPS Tracking</span>
                    </h3>
                    <p className="text-xs text-gray-505 font-medium text-indigo-600 dark:text-indigo-400">{trackingStatus}</p>
                  </div>

                  {/* Dynamic High-Quality Map Container */}
                  <div className="h-56 bg-zinc-100 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]"></div>
                    
                    <div className="h-3 w-full bg-indigo-500/10 absolute top-1/4"></div>
                    <div className="h-3 w-full bg-indigo-500/10 absolute top-3/4"></div>
                    <div className="w-3 h-full bg-indigo-500/10 absolute left-1/3"></div>
                    <div className="w-3 h-full bg-indigo-500/10 absolute left-2/3"></div>

                    {/* Geolocation Home Location Marker */}
                    <div className="absolute top-1/2 left-[75%] -translate-y-1/2 flex flex-col items-center">
                      <span className="text-3xl filter drop-shadow">🏠</span>
                      <span className="text-[9px] font-bold bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-1.5 py-0.5 rounded shadow mt-1">
                        HOME
                      </span>
                    </div>

                    {/* Animated GPS Worker Location Marker */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ease-out"
                      style={{ left: `${gpsX}%` }}
                    >
                      <span className="text-3xl filter drop-shadow animate-bounce">🛵</span>
                      <span className="text-[9px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                        {selectedWorker} (Pro)
                      </span>
                    </div>

                    {/* Dynamic ETA Overlay Badge */}
                    <span className="absolute bottom-4 left-4 bg-white/95 dark:bg-zinc-900/95 border border-gray-200 dark:border-zinc-800 text-[10px] font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                      <span>ETA: {etaMinutes > 0 ? `${etaMinutes} mins` : 'Arrived!'}</span>
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        setEtaMinutes(0);
                        setGpsX(70);
                        setTrackingStatus('Arrived - Professional at your doorstep!');
                        alert('Simulation Fast Forward: Worker has arrived at customer house.');
                      }}
                      className="flex-1 bg-white border border-gray-300 dark:border-zinc-700 dark:bg-zinc-805 text-gray-705 dark:text-zinc-300 text-xs font-bold py-3.5 rounded-xl hover:bg-gray-50"
                    >
                      Fast Forward ETA ⚡
                    </button>

                    <button 
                      onClick={() => {
                        if (etaMinutes > 0) {
                          alert('Please wait for the worker to arrive, or click Fast Forward ETA to skip.');
                          return;
                        }
                        setSimulatorStep('arrival_gate');
                      }}
                      disabled={etaMinutes > 0}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 transition-opacity"
                    >
                      Verify Check-in OTP →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Arrival OTP Verification */}
              {simulatorStep === 'arrival_gate' && (
                <div className="space-y-6 text-center max-w-md mx-auto">
                  <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    🔑
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 5: Arrival Verification (OTP 1/3)</h3>
                    <p className="text-xs text-gray-550">Provide the worker with the check-in OTP to verify their secure arrival.</p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/30 p-5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-widest">Your Private Check-in OTP</p>
                    <p className="text-2xl font-extrabold tracking-widest text-indigo-850 dark:text-white">{arrivalOTP}</p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-Digit OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full text-center rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-lg font-bold tracking-widest outline-none text-gray-900 dark:text-white"
                    />
                    <button 
                      onClick={() => {
                        if (enteredOtp === arrivalOTP) {
                          alert('Arrival OTP Verified successfully!');
                          setEnteredOtp('');
                          setSimulatorStep('start_gate');
                        } else {
                          alert('Invalid OTP. Please enter 4928');
                        }
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
                    >
                      Verify Arrival Code
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: Work Start OTP Verification */}
              {simulatorStep === 'start_gate' && (
                <div className="space-y-6 text-center max-w-md mx-auto">
                  <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ⚡
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 6: Work Commencement (OTP 2/3)</h3>
                    <p className="text-xs text-gray-500">Provide the worker with the Commencement OTP when you are ready for work to begin.</p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/30 p-5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-widest">Your Private Commencement OTP</p>
                    <p className="text-2xl font-extrabold tracking-widest text-indigo-850 dark:text-white">{startOTP}</p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-Digit OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full text-center rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-lg font-bold tracking-widest outline-none text-gray-900 dark:text-white"
                    />
                    <button 
                      onClick={() => {
                        if (enteredOtp === startOTP) {
                          alert('Commencement OTP Verified! Job state: IN_PROGRESS.');
                          setEnteredOtp('');
                          setSimulatorStep('completion_gate');
                        } else {
                          alert('Invalid OTP. Please enter 7301');
                        }
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
                    >
                      Verify Start Code
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: Work Completion OTP Verification */}
              {simulatorStep === 'completion_gate' && (
                <div className="space-y-6 text-center max-w-md mx-auto">
                  <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 7: Work Completion (OTP 3/3)</h3>
                    <p className="text-xs text-gray-500">Provide the completion OTP only after verifying that the work has been finished perfectly.</p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-900/30 p-5 rounded-2xl space-y-1">
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-widest">Your Private Completion OTP</p>
                    <p className="text-2xl font-extrabold tracking-widest text-indigo-850 dark:text-white">{completeOTP}</p>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-Digit OTP"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full text-center rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-lg font-bold tracking-widest outline-none text-gray-900 dark:text-white"
                    />
                    <button 
                      onClick={() => {
                        if (enteredOtp === completeOTP) {
                          alert('Completion OTP Verified successfully! Proceeding to Payment validation.');
                          setEnteredOtp('');
                          setSimulatorStep('payment');
                        } else {
                          alert('Invalid OTP. Please enter 9185');
                        }
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
                    >
                      Verify Completion Code
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 8: Payment Gateway Interface */}
              {simulatorStep === 'payment' && (
                <div className="space-y-6 text-center max-w-md mx-auto">
                  <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    💳
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 8: Payment Gateway</h3>
                    <p className="text-xs text-gray-500">Complete transaction securely via virtual wallet balance or Razorpay HMAC signature verification.</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-zinc-950 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 space-y-3 text-left">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Labour Base Rate</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹400.00</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Platform Commission Tax (10%)</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹40.00</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Platform Service Fee</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹49.00</span>
                    </div>
                    <hr className="border-gray-200 dark:border-zinc-800" />
                    <div className="flex justify-between text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Total Amount Paid</span>
                      <span>₹489.00</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      alert('Razorpay Signature Verified. platform commission transferred.');
                      setRatingReason('completion'); // Standard feedback completion
                      setSimulatorStep('feedback');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-md"
                  >
                    Pay ₹489.00 (Process Transaction)
                  </button>
                </div>
              )}

              {/* STEP 9: Two-Way Rating & Feedback System */}
              {simulatorStep === 'feedback' && (
                <div className="space-y-6 text-left max-w-lg mx-auto">
                  
                  <div className="text-center space-y-2">
                    <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                      ⭐
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {ratingReason === 'completion' && '🏆 Double Review: Customer ↔ Labour'}
                      {ratingReason === 'labour_cancel' && '⚠️ Labour Cancelled: Customer Rate Labour'}
                      {ratingReason === 'customer_cancel' && '⚠️ Customer Cancelled: Labour Rate Customer'}
                    </h3>
                    <p className="text-xs text-gray-500">Provide reviews matching the cancellation/work completion parameters.</p>
                  </div>

                  {/* Customer rating Labour section */}
                  {(ratingReason === 'completion' || ratingReason === 'labour_cancel') && (
                    <div className="bg-gray-50 dark:bg-zinc-950 p-5 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-3">
                      <span className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider block">Customer's Review for Worker ({selectedWorker})</span>
                      
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            onClick={() => setCustomerRatingForWorker(star)}
                            className="text-xl transition-all"
                          >
                            {star <= customerRatingForWorker ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>

                      <textarea 
                        placeholder={ratingReason === 'labour_cancel' ? 'Review labor cancellation behavior or response lag...' : 'Tell us about the quality of the work...'}
                        value={customerComment}
                        onChange={(e) => setCustomerComment(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-950 dark:text-white"
                      />
                    </div>
                  )}

                  {/* Labour rating Customer section */}
                  {(ratingReason === 'completion' || ratingReason === 'customer_cancel') && (
                    <div className="bg-gray-50 dark:bg-zinc-950 p-5 rounded-3xl border border-gray-150 dark:border-zinc-850 space-y-3">
                      <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider block">Worker's Review for Customer (You)</span>
                      
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            onClick={() => setWorkerRatingForCustomer(star)}
                            className="text-xl transition-all"
                          >
                            {star <= workerRatingForCustomer ? '⭐' : '☆'}
                          </button>
                        ))}
                      </div>

                      <textarea 
                        placeholder={ratingReason === 'customer_cancel' ? 'Review last-minute cancellation behavior / lack of communication...' : 'Rate the customer behavior, timeliness, and access to work area...'}
                        value={workerComment}
                        onChange={(e) => setWorkerComment(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-955 dark:text-white"
                      />
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      alert('Feedback successfully locked! Ratings processed & saved.');
                      setSimulatorStep('done');
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-center text-xs"
                  >
                    Submit Two-Way Feedback & Finish
                  </button>
                </div>
              )}

              {/* DONE STEP */}
              {simulatorStep === 'done' && (
                <div className="space-y-6 text-center max-w-sm mx-auto py-8">
                  <div className="h-16 w-16 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                    🏆
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Workflow Completed!</h3>
                    <p className="text-xs text-gray-500">You have successfully walked through 100% of the premium booking pipeline step-by-step.</p>
                  </div>
                  <button 
                    onClick={resetSimulator}
                    className="bg-indigo-55 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 text-xs font-bold px-6 py-3 rounded-xl"
                  >
                    🔄 Restart Flow Simulator
                  </button>
                </div>
              )}

            </div>

            {/* Right Column: Exact Chronological Timeline Visualizer */}
            <div className="bg-gray-50 dark:bg-zinc-950/40 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 space-y-6 self-start">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">📋 Chronological Timeline</h4>
                <p className="text-[10px] text-gray-400">Live booking progression checkpoints</p>
              </div>

              <div className="space-y-1">
                {renderTimelineNode('requested', 'Booking Requested', 'Customer creates booking transaction')}
                {renderTimelineNode('accepted', 'Accepted', 'Worker clicks accept response')}
                {renderTimelineNode('assigned', 'Assigned', 'System locks slot allocation')}
                {renderTimelineNode('on_the_way', 'Labour On The Way', 'Live geolocation routing coordinates active')}
                {renderTimelineNode('arrived', 'Arrived', 'Worker arrives and enters arrival check-in OTP')}
                {renderTimelineNode('work_started', 'Work Started', 'Worker enters Commencement OTP to begin work')}
                {renderTimelineNode('work_completed', 'Work Completed', 'Worker enters completion verification OTP')}
                {renderTimelineNode('payment_completed', 'Payment Completed', 'Razorpay & Wallet transaction securely closed')}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Dashboard list */}
        {activeTab === 'history' && (
          <div className="p-4 sm:p-8 space-y-4">
            
            {penaltyCharged > 0 && (
              <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl flex items-center justify-between text-xs mb-4">
                <span className="font-semibold text-red-750">⚠️ Cancellation Penalty Charged on Wallet:</span>
                <span className="font-extrabold text-red-600">- ₹{penaltyCharged}</span>
              </div>
            )}

            <BookingHistory />
          </div>
        )}

      </div>

      {/* Elegant Reschedule Modal */}
      {isRescheduling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl border border-gray-150 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">📅 Reschedule Booking</h3>
              <p className="text-xs text-gray-500">Preserves ID: <strong className="text-gray-700 dark:text-zinc-300">{bookingId}</strong> intact.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">New Date</label>
                <input 
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">New Time Slot</label>
                <input 
                  type="text"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsRescheduling(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-300 py-3 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleRescheduleConfirm}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Warning & Penalty Cancellation Modal Dialog */}
      {showCancelWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-gray-200 dark:border-zinc-800 animate-in fade-in duration-200">
            
            <div className="space-y-2 text-center">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cancel Your Active Reservation?</h3>
              <p className="text-xs text-gray-550">Please review platform cancellation compliance rules below:</p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850 space-y-3 text-xs">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-gray-500">CANCELLATION WINDOW TIME LEFT:</span>
                <span className="text-red-500 font-mono">{formatTimeLeft(approvalTimeLeft)} mins</span>
              </div>
              
              <hr className="border-gray-200 dark:border-zinc-850" />

              <div className="space-y-2">
                <p className="font-semibold text-gray-800 dark:text-zinc-350">
                  {approvalTimeLeft > 0 
                    ? '🟢 Free Cancellation: Since you are cancelling within 30 minutes of approval, ₹0 penalty will be charged.' 
                    : '🔴 Late Cancellation: Since the 30-minute window has expired, ₹150 penalty will be charged to your wallet.'
                  }
                </p>
                
                <p className="text-red-500 font-semibold leading-relaxed">
                  ⚠️ Warning: Cancellation adds 1 STRIKE to your profile risk score. If you reach 3/3 strikes, your account will be immediately Suspended for 48 Hours!
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelWarning(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-gray-700 dark:text-zinc-300 py-3.5 rounded-xl text-xs font-bold"
              >
                Go Back (Don't Cancel)
              </button>
              <button 
                onClick={handleProcessCancellation}
                className="flex-1 bg-red-650 hover:bg-red-700 text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-red-500/10"
              >
                Confirm Cancellation
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
