import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Phone, MessageSquare, AlertTriangle, 
  Camera, CheckCircle2, ShieldAlert, Navigation, Lock, 
  UploadCloud, Truck, Wrench, IndianRupee, ArrowRight
} from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

type Step = 'accepted' | 'journey' | 'arrived' | 'started' | 'completed';

export default function ActiveBooking() {
  const [currentStep, setCurrentStep] = useState<Step>('journey');
  const [otpInput, setOtpInput] = useState(['', '', '', '']);
  const [isUploading, setIsUploading] = useState(false);

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveBooking();
  }, []);

  const fetchActiveBooking = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.status === 200) {
        // Find the first active booking (accepted, arrived, work_started)
        const active = res.data.find((b: any) => 
          ['accepted', 'arrived', 'work_started'].includes(b.status)
        );

        if (active) {
          setBooking({
            id: active._id,
            displayId: active._id.substring(0, 8).toUpperCase(),
            customerName: active.customer?.name || 'Customer',
            category: active.bookingType || 'General Work',
            time: `${new Date(active.date).toLocaleDateString()} – ${active.timeSlot}`,
            distance: '2.5 km', // Mock
            eta: '8 min', // Mock
            location: active.address || 'Address hidden',
            payment: {
              customerPaid: active.totalAmount || 0,
              fee: active.totalAmount ? active.totalAmount * 0.1 : 0,
              earnings: active.totalAmount ? active.totalAmount * 0.9 : 0
            }
          });

          // Map DB status to UI step
          if (active.status === 'accepted') setCurrentStep('journey');
          else if (active.status === 'arrived') setCurrentStep('arrived');
          else if (active.status === 'work_started') setCurrentStep('started');
        } else {
          setBooking(null); // No active booking
        }
      }
    } catch (err) {
      console.error('Error fetching active booking', err);
    } finally {
      setIsLoading(false);
    }
  };

  const timelineSteps = [
    { id: 'accepted', label: 'Accepted', icon: CheckCircle2 },
    { id: 'journey', label: 'Start Journey', icon: Truck },
    { id: 'arrived', label: 'Arrived', icon: MapPin },
    { id: 'started', label: 'Work Started', icon: Wrench },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  ];

  const getStepIndex = (step: Step) => timelineSteps.findIndex(s => s.id === step);
  const currentIndex = getStepIndex(currentStep);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);
    
    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (!booking) return;

    let targetStatus = '';
    if (currentStep === 'journey') targetStatus = 'arrived';
    else if (currentStep === 'arrived') targetStatus = 'work_started';
    else if (currentStep === 'started') targetStatus = 'completed';

    const enteredOtp = otpInput.join('');

    try {
      const promise = api.put(`/bookings/${booking.id}/status`, {
        status: targetStatus,
        otp: enteredOtp
      });

      toast.promise(promise, {
        loading: 'Verifying OTP...',
        success: 'OTP Verified Successfully!',
        error: 'Invalid OTP. Please try again.'
      });

      const res = await promise;
      if (res.status === 200) {
        // Move to next step locally
        if (currentStep === 'journey') setCurrentStep('arrived');
        else if (currentStep === 'arrived') setCurrentStep('started');
        else if (currentStep === 'started') setCurrentStep('completed');
        
        setOtpInput(['', '', '', '']); // Reset OTP
      }
    } catch (err: any) {
      // Toast already handles error message
      setOtpInput(['', '', '', '']); // Clear failed OTP
    }
  };

  const getOtpPrompt = () => {
    if (currentStep === 'journey') return 'Enter Arrival OTP from Customer';
    if (currentStep === 'arrived') return 'Enter Start Work OTP';
    if (currentStep === 'started') return 'Enter Completion OTP';
    return '';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 animate-pulse">
        <div className="text-gray-500 font-bold flex items-center gap-2">
          <Truck className="w-5 h-5 animate-bounce" /> Loading active booking...
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
        <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <MapPin className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Booking</h3>
        <p className="text-gray-500 max-w-md mx-auto">You don't have any ongoing job right now. Accept a new job from the Incoming Requests tab to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="animate-pulse w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Live Booking</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Booking #{booking.displayId}</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 transition-colors shadow-sm">
            <MessageSquare className="w-4 h-4" /> Chat
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors shadow-sm">
            <Phone className="w-4 h-4" /> Call
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors shadow-sm">
            <ShieldAlert className="w-4 h-4" /> SOS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Map */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?u=mithun" alt="Customer" className="w-16 h-16 rounded-full border-4 border-gray-50 dark:border-zinc-800" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{booking.customerName}</h3>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-0.5">
                  <Wrench className="w-3.5 h-3.5" /> {booking.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Scheduled For</p>
              <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-brand-amber" />
                {booking.time}
              </div>
            </div>
          </div>

          {/* Location & Map UI */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm relative">
            {/* Fake Map Background */}
            <div className="h-48 bg-blue-50 dark:bg-zinc-800 relative w-full overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
              <div className="bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 flex flex-col items-center z-10">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Distance</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">{booking.distance}</span>
                <span className="text-indigo-600 font-bold text-sm mt-1">ETA: {booking.eta}</span>
              </div>
              
              {/* Fake route line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M10,90 Q40,50 90,10" stroke="#4f46e5" strokeWidth="4" fill="none" strokeDasharray="8 4" className="animate-[dash_20s_linear_infinite]" />
              </svg>
            </div>

            <div className="p-6 bg-white dark:bg-zinc-900 flex justify-between items-center">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Destination</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">{booking.location}</p>
                </div>
              </div>
              <button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shrink-0 shadow-md">
                <Navigation className="w-4 h-4" /> Track Live
              </button>
            </div>
          </div>

          {/* Earnings Preview */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Estimated Earnings</p>
                <p className="text-2xl font-black text-green-600">₹{booking.payment.earnings}</p>
              </div>
            </div>
            
            <div className="flex gap-4 text-xs font-medium bg-gray-50 dark:bg-zinc-800 px-4 py-3 rounded-xl w-full sm:w-auto justify-center">
              <div className="text-center border-r border-gray-200 dark:border-zinc-700 pr-4">
                <p className="text-gray-500 mb-1">Customer Pays</p>
                <p className="font-bold text-gray-900 dark:text-white">₹{booking.payment.customerPaid}</p>
              </div>
              <div className="text-center">
                <p className="text-red-400 mb-1">Platform Fee</p>
                <p className="font-bold text-red-500">-₹{booking.payment.fee}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Timeline & Action */}
        <div className="space-y-6">
          
          {/* Live Tracker */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-amber" /> Live Status
            </h3>
            
            <div className="space-y-0">
              {timelineSteps.map((step, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="relative flex items-start group">
                    {/* Vertical Line */}
                    {index !== timelineSteps.length - 1 && (
                      <div className={`absolute left-5 top-10 bottom-[-1rem] w-0.5 transition-colors duration-500 ${isCompleted ? 'bg-indigo-600' : 'bg-gray-100 dark:bg-zinc-800'}`}></div>
                    )}
                    
                    {/* Circle */}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                      isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 
                      isCurrent ? 'bg-white dark:bg-zinc-900 border-indigo-600 text-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)] scale-110' : 
                      'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-400'
                    }`}>
                      <Icon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                    </div>
                    
                    {/* Label */}
                    <div className={`ml-4 mt-2.5 pb-8 transition-colors duration-500 ${
                      isCompleted ? 'text-gray-900 dark:text-white font-bold' : 
                      isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-black text-lg' : 
                      'text-gray-500 font-medium'
                    }`}>
                      {step.label}
                      {isCurrent && (
                        <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse"></div>
                          In Progress
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Box (OTP / Upload) */}
          <AnimatePresence mode="wait">
            {currentStep !== 'completed' && (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                
                {/* Dynamic Content based on step */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-indigo-300" />
                    <h3 className="font-bold tracking-wide">{getOtpPrompt()}</h3>
                  </div>
                  
                  <div className="flex gap-3 justify-center mb-6">
                    {otpInput.map((val, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-12 h-14 bg-indigo-800/50 dark:bg-indigo-950/50 border border-indigo-500/50 rounded-xl text-center text-2xl font-black text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                      />
                    ))}
                  </div>

                  {currentStep === 'arrived' && (
                    <div className="mb-6">
                      <button 
                        onClick={() => setIsUploading(!isUploading)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-colors"
                      >
                        <Camera className="w-4 h-4" /> Upload Before Photo
                      </button>
                    </div>
                  )}

                  <button 
                    onClick={handleVerifyOtp}
                    disabled={otpInput.join('').length !== 4}
                    className="w-full bg-white text-indigo-900 py-3.5 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Verify & Proceed <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500 dark:bg-green-600 rounded-3xl p-8 text-white shadow-lg text-center"
              >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-2">Job Completed!</h3>
                <p className="text-green-100 font-medium mb-6">Payment of ₹950 has been added to your pending wallet.</p>
                <button className="bg-white text-green-700 font-bold py-3 px-6 rounded-xl w-full hover:bg-green-50 transition-colors">
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
}
