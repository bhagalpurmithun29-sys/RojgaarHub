import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { 
  Search, Filter, Calendar, MapPin, Clock, Tag, CreditCard, 
  ChevronDown, ChevronUp, Download, Star, MessageSquare, 
  Phone, AlertOctagon, RefreshCw, Heart, CheckCircle2, 
  XCircle, Clock4, Truck, Wrench, Briefcase, ShieldCheck, 
  Map, Zap, Bot, Navigation, IndianRupee
} from 'lucide-react';

// For Razorpay TS support
declare global {
  interface Window {
    Razorpay: any;
  }
}

type Role = 'customer' | 'labour';
type Status = 'Pending' | 'Accepted' | 'On The Way' | 'Arrived' | 'Work Started' | 'Completed' | 'Cancelled' | 'Rescheduled';

interface Booking {
  id: string;
  shortId: string;
  labour: {
    name: string;
    category: string;
    image: string;
    experience: string;
    rating: number;
    verified: boolean;
  };
  details: {
    serviceType: string;
    bookingType: 'Hourly' | 'Daily' | 'Project' | 'Emergency';
    date: string;
    time: string;
    duration: string;
    isEmergency: boolean;
  };
  location: {
    address: string;
    area: string;
  };
  payment: {
    labourFee: number;
    platformFee: number;
    totalPaid: number;
    method: string;
    status: string;
  };
  status: Status;
  tracking?: {
    distance: string;
    eta: string;
  };
  suggestions?: string[];
}

const mockBookings: Booking[] = [
  {
    id: '64f1a2b3c4d5e6f7a8b9c0d1',
    shortId: 'RZH-24581',
    labour: {
      name: 'Ravi Kumar',
      category: 'Electrician',
      image: 'https://i.pravatar.cc/150?u=ravi',
      experience: '6 Years Experience',
      rating: 4.8,
      verified: true
    },
    details: {
      serviceType: 'Wiring Repair',
      bookingType: 'Hourly',
      date: 'Today',
      time: '10:00 AM',
      duration: '3 Hours',
      isEmergency: false
    },
    location: {
      address: 'House 42, Sector 17',
      area: 'Shimla Main Road'
    },
    payment: {
      labourFee: 1000,
      platformFee: 50,
      totalPaid: 1050,
      method: 'Online',
      status: 'Paid'
    },
    status: 'On The Way',
    tracking: {
      distance: '2.5 km',
      eta: '8 min'
    }
  },
  {
    id: '64f1a2b3c4d5e6f7a8b9c0d2',
    shortId: 'RZH-24582',
    labour: {
      name: 'Suresh Singh',
      category: 'Plumber',
      image: 'https://i.pravatar.cc/150?u=suresh',
      experience: '8 Years Experience',
      rating: 4.5,
      verified: true
    },
    details: {
      serviceType: 'Pipe Leakage',
      bookingType: 'Emergency',
      date: 'Today',
      time: '02:00 PM',
      duration: 'As per work',
      isEmergency: true
    },
    location: {
      address: 'Apt 304, Green Valley',
      area: 'Mall Road'
    },
    payment: {
      labourFee: 800,
      platformFee: 40,
      totalPaid: 840,
      method: 'Wallet',
      status: 'Pending'
    },
    status: 'Pending',
    suggestions: [
      'Similar labour available nearby.',
      'Faster response worker available (ETA 10 mins).'
    ]
  },
  {
    id: '64f1a2b3c4d5e6f7a8b9c0d3',
    shortId: 'RZH-24583',
    labour: {
      name: 'Ajay Dev',
      category: 'Carpenter',
      image: 'https://i.pravatar.cc/150?u=ajay',
      experience: '4 Years Experience',
      rating: 4.2,
      verified: false
    },
    details: {
      serviceType: 'Furniture Assembly',
      bookingType: 'Project',
      date: '22 May 2026',
      time: '09:00 AM',
      duration: 'Full Day',
      isEmergency: false
    },
    location: {
      address: 'Office 301, Tech Park',
      area: 'Gurugram'
    },
    payment: {
      labourFee: 5000,
      platformFee: 250,
      totalPaid: 5250,
      method: 'UPI',
      status: 'Refunded'
    },
    status: 'Completed'
  }
];

const statusConfig: Record<Status, { color: string, icon: any, bg: string, border: string }> = {
  'Pending': { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900/50', icon: Clock4 },
  'Accepted': { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900/50', icon: CheckCircle2 },
  'On The Way': { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-900/50', icon: Truck },
  'Arrived': { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/30', border: 'border-cyan-200 dark:border-cyan-900/50', icon: MapPin },
  'Work Started': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-900/50', icon: Wrench },
  'Completed': { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-900/50', icon: CheckCircle2 },
  'Cancelled': { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900/50', icon: XCircle },
  'Rescheduled': { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-900/50', icon: RefreshCw },
};

export default function BookingHistory({ initialRole = 'customer' }: { initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);

  // Fetch real data from Backend MongoDB
  useEffect(() => {
    const fetchRealBookings = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/bookings');
        if (res.data && res.data.length > 0) {
          const liveBookings: Booking[] = res.data.map((b: any) => {
            
            // Map raw DB status to UI Status
            let mappedStatus: Status = 'Pending';
            if (b.status === 'requested') mappedStatus = 'Pending';
            if (b.status === 'accepted') mappedStatus = 'Accepted';
            if (b.status === 'arrived') mappedStatus = 'Arrived';
            if (b.status === 'work_started') mappedStatus = 'Work Started';
            if (b.status === 'completed') mappedStatus = 'Completed';
            if (b.status === 'cancelled') mappedStatus = 'Cancelled';
            
            return {
              id: b._id,
              shortId: `RZH-${b._id.substring(b._id.length - 5).toUpperCase()}`,
              labour: {
                name: b.labour?.name || 'Assigned Worker',
                category: b.bookingType || 'General Service',
                image: b.labour?.profileImage || 'https://i.pravatar.cc/150?u=worker',
                experience: 'Verified Professional',
                rating: 4.5,
                verified: true
              },
              details: {
                serviceType: b.bookingType,
                bookingType: b.bookingType === 'Emergency' ? 'Emergency' : 'Hourly',
                date: new Date(b.date).toLocaleDateString(),
                time: b.timeSlot || '10:00 AM',
                duration: 'As per requirement',
                isEmergency: b.bookingType === 'Emergency'
              },
              location: {
                address: b.address || 'Address pending',
                area: 'Service Location'
              },
              payment: {
                labourFee: b.totalAmount - 50,
                platformFee: 50,
                totalPaid: b.totalAmount || 1000,
                method: 'Razorpay / Wallet',
                status: mappedStatus === 'Completed' ? 'Paid' : 'Pending'
              },
              status: mappedStatus
            };
          });
          
          setBookings(liveBookings);
        }
      } catch (err) {
        console.error('API Error: Failed to fetch live bookings. Falling back to mock data.', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRealBookings();
  }, []);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayPayment = async (booking: Booking) => {
    try {
      setIsProcessingPayment(booking.id);
      
      // Options for Razorpay Checkout
      const options = {
        key: 'rzp_test_TYpo9vrZWeP1Yp', // Dummy Test Key for demo
        amount: booking.payment.totalPaid * 100, // amount in paise
        currency: 'INR',
        name: 'RozgaarHub Payments',
        description: `Payment for Booking ${booking.shortId}`,
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Temporary generic icon
        handler: function (response: any) {
          // Success callback
          setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, payment: { ...b.payment, status: 'Paid', method: 'Razorpay' } } : b));
          alert(`Payment of ₹${booking.payment.totalPaid} successful via Razorpay! \nPayment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'Customer',
          email: 'customer@rozgaarhub.com',
          contact: '9999999999'
        },
        theme: {
          color: '#4F46E5' // Indigo 600
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          alert(`Payment Failed: ${response.error.description}`);
        });
        rzp.open();
      } else {
        alert('Razorpay SDK failed to load. Please check your connection.');
      }
    } catch (err) {
      console.error(err);
      alert('Error initiating payment');
    } finally {
      setIsProcessingPayment(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesTab = activeFilter === 'All' || 
                       (activeFilter === 'Active' && ['Accepted', 'On The Way', 'Arrived', 'Work Started'].includes(b.status)) ||
                       b.status === activeFilter;
    const matchesSearch = 
      b.shortId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.labour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.labour.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const summary = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    accepted: bookings.filter(b => b.status === 'Accepted').length,
    active: bookings.filter(b => ['On The Way', 'Arrived', 'Work Started'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Customer Summary Dashboard */}
      {role === 'customer' && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Requests</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{summary.total}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Pending</p>
            <p className="text-2xl font-black text-amber-500">{summary.pending}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Accepted</p>
            <p className="text-2xl font-black text-blue-500">{summary.accepted}</p>
          </div>
          <div className="bg-indigo-600 dark:bg-indigo-500 p-4 rounded-2xl shadow-md border border-indigo-500 text-white">
            <p className="text-[10px] uppercase tracking-wider text-indigo-200 font-bold mb-1">Active Bookings</p>
            <p className="text-2xl font-black">{summary.active}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Completed</p>
            <p className="text-2xl font-black text-green-500">{summary.completed}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Cancelled</p>
            <p className="text-2xl font-black text-red-500">{summary.cancelled}</p>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          {['All', 'Pending', 'Active', 'Completed', 'Cancelled'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300'}`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search bookings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredBookings.map((b) => {
            const isExpanded = expandedId === b.id;
            const statusStyle = statusConfig[b.status];
            const StatusIcon = statusStyle.icon;
            const isActive = ['Accepted', 'On The Way', 'Arrived', 'Work Started'].includes(b.status);
            
            return (
              <motion.div 
                key={b.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border shadow-sm transition-all ${
                  b.details.isEmergency && b.status === 'Pending' 
                    ? 'border-red-300 dark:border-red-900/50 shadow-red-100 dark:shadow-red-900/10' 
                    : isActive ? 'border-indigo-200 dark:border-indigo-900/50 shadow-indigo-100 dark:shadow-indigo-900/10' 
                    : 'border-gray-100 dark:border-zinc-800'
                }`}
              >
                {/* EMERGENCY BAR */}
                {b.details.isEmergency && b.status === 'Pending' && (
                  <div className="bg-red-500 text-white px-6 py-2 flex justify-between items-center text-xs font-bold uppercase tracking-wider animate-pulse">
                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 fill-white" /> Emergency Priority</span>
                    <span>Expected Response: &lt; 5 Minutes</span>
                  </div>
                )}

                {/* COMPACT VIEW */}
                <div 
                  className={`p-6 cursor-pointer flex flex-col md:flex-row gap-6 relative ${isExpanded ? 'bg-gray-50/50 dark:bg-zinc-800/30' : ''}`}
                  onClick={() => toggleExpand(b.id)}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
                    <StatusIcon className="w-4 h-4" />
                    {b.status}
                  </div>

                  {/* Labour Profile */}
                  <div className="flex items-start gap-4 md:w-1/3 mt-6 md:mt-0">
                    <div className="relative">
                      <img src={b.labour.image} alt="Labour" className="w-16 h-16 rounded-full border-2 border-white dark:border-zinc-800 shadow-md object-cover" />
                      {b.labour.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-500 font-bold bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700">{b.shortId}</span>
                        {b.labour.rating > 0 && (
                          <span className="flex items-center text-[10px] text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/30">
                            <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> {b.labour.rating}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{b.labour.name}</h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">{b.labour.category} • <span className="text-gray-500 dark:text-zinc-400 font-medium">{b.labour.experience}</span></p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="md:w-1/3 flex flex-col justify-center space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{b.details.date} at {b.details.time}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Est. Duration: {b.details.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{b.location.area}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{b.location.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Tracking */}
                  <div className="md:w-1/3 flex flex-col justify-center mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-zinc-800">
                    {b.tracking && isActive ? (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                        <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5" /> Live Tracking
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white">{b.tracking.distance}</p>
                            <p className="text-xs text-gray-500">Distance</p>
                          </div>
                          <div className="w-px h-8 bg-indigo-200 dark:bg-indigo-800"></div>
                          <div className="text-right">
                            <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{b.tracking.eta}</p>
                            <p className="text-xs text-gray-500">ETA</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Payable</p>
                          <p className="text-xl font-black text-green-600 dark:text-green-400">₹{b.payment.totalPaid}</p>
                        </div>
                        <button className="p-2 bg-white dark:bg-zinc-700 rounded-lg shadow-sm">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* EXPANDED CONTENT */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
                    >
                      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* 1. Payment Breakdown */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Breakdown</h4>
                          <div className="bg-gray-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400">
                              <span>Labour Fee</span>
                              <span className="font-bold text-gray-900 dark:text-white">₹{b.payment.labourFee}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400">
                              <span>Platform Fee</span>
                              <span className="font-bold text-gray-900 dark:text-white">₹{b.payment.platformFee}</span>
                            </div>
                            <div className="w-full h-px bg-gray-200 dark:bg-zinc-700 my-2"></div>
                            <div className="flex justify-between text-base font-black text-green-600 dark:text-green-400">
                              <span>Total Amount</span>
                              <span>₹{b.payment.totalPaid}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-500">
                              <CreditCard className="w-4 h-4" /> Paid via {b.payment.method} ({b.payment.status})
                            </div>
                          </div>
                        </div>

                        {/* 2. Timeline & Smart Suggestions */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Request Flow</h4>
                          <div className="bg-gray-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800">
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                                <div><p className="text-sm font-bold text-gray-900 dark:text-white">Request Sent</p></div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${b.status !== 'Pending' ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'}`}>
                                  {b.status !== 'Pending' && <CheckCircle2 className="w-3 h-3" />}
                                </div>
                                <div><p className={`text-sm font-bold ${b.status !== 'Pending' ? 'text-gray-900 dark:text-white' : 'text-amber-600'}`}>{b.status === 'Pending' ? 'Waiting for Acceptance...' : 'Labour Accepted'}</p></div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 ${b.status === 'Completed' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-zinc-600'}`}></div>
                                <div><p className={`text-sm font-bold ${b.status === 'Completed' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Work Completed</p></div>
                              </div>
                            </div>
                          </div>

                          {b.suggestions && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Bot className="w-3.5 h-3.5" /> Smart Suggestions
                              </p>
                              <ul className="space-y-1.5">
                                {b.suggestions.map((s, i) => (
                                  <li key={i} className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-1.5">
                                    <span className="text-blue-400">•</span> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* 3. Quick Actions */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Actions</h4>
                          <div className="grid grid-cols-2 gap-3">
                            
                            {/* Payment Button if Pending */}
                            {b.payment.status === 'Pending' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRazorpayPayment(b); }}
                                disabled={isProcessingPayment === b.id}
                                className="col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-xl font-black text-base transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 scale-[1.02] active:scale-95"
                              >
                                {isProcessingPayment === b.id ? (
                                  <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                  <IndianRupee className="w-5 h-5" /> 
                                )}
                                {isProcessingPayment === b.id ? 'Processing...' : `Pay ₹${b.payment.totalPaid} Securely via Razorpay`}
                              </button>
                            )}

                            <button className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl font-bold text-sm transition-colors border border-indigo-100 dark:border-indigo-900/30">
                              <MessageSquare className="w-4 h-4" /> Chat
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-400 p-3 rounded-xl font-bold text-sm transition-colors border border-green-100 dark:border-green-900/30">
                              <Phone className="w-4 h-4" /> Call
                            </button>
                            {b.tracking && isActive ? (
                              <button 
                                onClick={() => {
                                  // Dispatch a custom event to tell the dashboard to switch tabs
                                  window.dispatchEvent(new CustomEvent('changeTab', { detail: 'live' }));
                                }}
                                className="col-span-2 flex items-center justify-center gap-2 bg-brand-amber hover:bg-brand-orange text-white p-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg"
                              >
                                <Map className="w-4 h-4" /> Track Live on Map
                              </button>
                            ) : null}
                            <button className="col-span-2 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 p-3 rounded-xl font-bold text-sm transition-colors">
                              <RefreshCw className="w-4 h-4" /> Reschedule
                            </button>
                            {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                              <button className="col-span-2 flex items-center justify-center gap-2 bg-white hover:bg-rose-50 dark:bg-zinc-800 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-gray-200 dark:border-zinc-700 hover:border-rose-200 p-3 rounded-xl font-bold text-sm transition-colors">
                                <AlertOctagon className="w-4 h-4" /> Cancel Booking
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
            <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-zinc-700">
              <Briefcase className="w-10 h-10 text-gray-300 dark:text-zinc-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">No Bookings Found</h3>
            <p className="text-gray-500 text-sm font-medium">No requests match your current filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}
