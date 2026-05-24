import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/utils/api';
import { 
  Search, Filter, Calendar, MapPin, Clock, Tag, CreditCard, 
  ChevronDown, ChevronUp, Download, Star, MessageSquare, 
  Phone, AlertOctagon, RefreshCw, Heart, CheckCircle2, 
  XCircle, Clock4, Truck, Wrench
} from 'lucide-react';

type Role = 'customer' | 'labour';
type Status = 'Pending' | 'Accepted' | 'On The Way' | 'Work Started' | 'Completed' | 'Cancelled' | 'Rescheduled';

interface Booking {
  id: string;
  customerName: string;
  labourName: string;
  category: string;
  image: string;
  date: string;
  time: string;
  location: string;
  type: 'Hourly' | 'Daily' | 'Project';
  status: Status;
  payment: {
    labourFee: number;
    platformFee: number;
    taxes: number;
    totalPaid: number;
    method: string;
    status: string;
  };
  timeline: {
    requested?: string;
    accepted?: string;
    onTheWay?: string;
    arrived?: string;
    workStarted?: string;
    workCompleted?: string;
  };
  rating?: number;
}

const mockBookings: Booking[] = [
  {
    id: 'RZH-24581',
    customerName: 'Mithun Kumar',
    labourName: 'Vinay Kumar',
    category: 'Electrician',
    image: 'https://i.pravatar.cc/150?u=mithun',
    date: '20 May 2026',
    time: '10:00 AM - 12:00 PM',
    location: 'Shimla',
    type: 'Hourly',
    status: 'Completed',
    payment: {
      labourFee: 950,
      platformFee: 50,
      taxes: 0,
      totalPaid: 1000,
      method: 'Online',
      status: 'Paid',
    },
    timeline: {
      requested: '10:05 AM',
      accepted: '10:08 AM',
      onTheWay: '10:15 AM',
      arrived: '10:30 AM',
      workStarted: '10:35 AM',
      workCompleted: '11:45 AM',
    },
    rating: 4.8,
  },
  {
    id: 'RZH-24582',
    customerName: 'Priya Sharma',
    labourName: 'Suresh Singh',
    category: 'Plumber',
    image: 'https://i.pravatar.cc/150?u=suresh',
    date: '21 May 2026',
    time: '02:00 PM - 04:00 PM',
    location: 'House No 12, Sector 4, Noida',
    type: 'Daily',
    status: 'On The Way',
    payment: {
      labourFee: 800,
      platformFee: 40,
      taxes: 10,
      totalPaid: 850,
      method: 'Wallet',
      status: 'Pending',
    },
    timeline: {
      requested: '01:00 PM',
      accepted: '01:10 PM',
      onTheWay: '01:45 PM',
    },
    rating: 4.5,
  },
  {
    id: 'RZH-24583',
    customerName: 'Vikram Verma',
    labourName: 'Ajay Dev',
    category: 'Carpenter',
    image: 'https://i.pravatar.cc/150?u=ajay',
    date: '22 May 2026',
    time: '09:00 AM - 05:00 PM',
    location: 'Office 301, Tech Park, Gurugram',
    type: 'Project',
    status: 'Cancelled',
    payment: {
      labourFee: 5000,
      platformFee: 250,
      taxes: 50,
      totalPaid: 5300,
      method: 'UPI',
      status: 'Refunded',
    },
    timeline: {
      requested: '08:00 AM',
      accepted: '08:15 AM',
    },
    rating: 0,
  }
];

const statusConfig: Record<Status, { color: string, icon: any, bg: string }> = {
  'Pending': { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Clock4 },
  'Accepted': { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30', icon: CheckCircle2 },
  'On The Way': { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: Truck },
  'Work Started': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30', icon: Wrench },
  'Completed': { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30', icon: CheckCircle2 },
  'Cancelled': { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', icon: XCircle },
  'Rescheduled': { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30', icon: RefreshCw },
};

export default function BookingHistory({ initialRole = 'customer' }: { initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        if (res.status === 200 && res.data.length > 0) {
          // Map DB model to frontend structure
          const mappedBookings: Booking[] = res.data.map((b: any) => ({
            id: b._id.substring(0, 8).toUpperCase(), // Using short ID
            customerName: b.customer?.name || 'Customer',
            labourName: b.labour?.name || 'Worker',
            category: b.bookingType || 'General Service',
            image: b.labour?.profileImage || 'https://i.pravatar.cc/150?u=' + b._id,
            date: new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: b.timeSlot || '10:00 AM',
            location: b.address || 'Location not specified',
            type: b.bookingType === 'project' ? 'Project' : 'Hourly', // Simplification
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1).replace('_', ' '), // Formatting enum to UI status
            payment: {
              labourFee: b.totalAmount ? b.totalAmount * 0.9 : 0,
              platformFee: b.totalAmount ? b.totalAmount * 0.1 : 0,
              taxes: 0,
              totalPaid: b.totalAmount || 0,
              method: 'Online',
              status: b.status === 'completed' ? 'Paid' : 'Pending',
            },
            timeline: {
              requested: new Date(b.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            },
            rating: b.rating || 0,
          }));
          setBookings(mappedBookings);
        }
      } catch (err) {
        console.error('Failed to fetch bookings, using mock data fallback', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.labourName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchesType = typeFilter === 'All' || booking.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderTimelineStep = (label: string, time?: string, isActive = false, isLast = false) => {
    return (
      <div className={`relative flex items-start ${isLast ? '' : 'pb-6'}`}>
        {!isLast && (
          <div className={`absolute left-2.5 top-5 bottom-0 w-0.5 ${time ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-zinc-800'}`}></div>
        )}
        <div className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-900 ${
          time 
            ? 'border-indigo-600 dark:border-indigo-500' 
            : isActive 
              ? 'border-blue-500 dark:border-blue-400 animate-pulse' 
              : 'border-gray-300 dark:border-zinc-700'
        }`}>
          {time && <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-500" />}
        </div>
        <div className="ml-4 flex flex-col">
          <span className={`text-xs font-semibold ${time ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-500'}`}>{label}</span>
          {time && <span className="text-[10px] text-gray-500 dark:text-zinc-400">{time}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Labour Summary Cards */}
      {role === 'labour' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Completed Jobs</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">156</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Earnings</p>
            <p className="text-2xl font-black text-green-600">₹85,000</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Rating</p>
            <p className="text-2xl font-black text-amber-500">4.8</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Completion</p>
            <p className="text-2xl font-black text-blue-600">96%</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Cancellation</p>
            <p className="text-2xl font-black text-red-500">4%</p>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800/80 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID, name, category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-gray-700 dark:text-zinc-300 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Active">Active</option>
            <option value="On The Way">On The Way</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-gray-700 dark:text-zinc-300 font-medium"
          >
            <option value="All">All Types</option>
            <option value="Hourly">Hourly</option>
            <option value="Daily">Daily</option>
            <option value="Project">Project</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBookings.map((booking) => {
            const isExpanded = expandedId === booking.id;
            const StatusIcon = statusConfig[booking.status].icon;
            
            return (
              <motion.div 
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-950 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-150 dark:border-zinc-850 overflow-hidden"
              >
                {/* Compact Header (Always visible) */}
                <div 
                  className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row gap-5 items-start md:items-center relative"
                  onClick={() => toggleExpand(booking.id)}
                >
                  {/* Status Badge */}
                  <div className={`absolute top-5 right-5 sm:right-6 md:static flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${statusConfig[booking.status].bg} ${statusConfig[booking.status].color}`}>
                    <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {booking.status}
                  </div>

                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={booking.image} 
                      alt={role === 'customer' ? booking.labourName : booking.customerName} 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-100 dark:border-zinc-800 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-gray-400 font-semibold">{booking.id}</span>
                        {booking.rating && booking.rating > 0 && (
                          <span className="flex items-center text-[10px] text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> {booking.rating}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
                        {role === 'customer' ? booking.labourName : booking.customerName}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{booking.category}</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 text-xs text-gray-600 dark:text-zinc-400 w-full mt-2 md:mt-0">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{booking.date}</p>
                        <p className="text-[10px]">{booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{booking.type}</p>
                        <p className="text-[10px]">Contract</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 col-span-2 md:col-span-1">
                      <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">₹{role === 'customer' ? booking.payment.totalPaid : booking.payment.labourFee}</p>
                        <p className="text-[10px]">{booking.payment.method}</p>
                      </div>
                    </div>
                  </div>

                  <button className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="border-t border-gray-100 dark:border-zinc-850 bg-gray-50/50 dark:bg-zinc-900/20"
                    >
                      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Left Column: Location & Payment */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Service Details</h4>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-150 dark:border-zinc-800 flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                              <p className="text-sm text-gray-700 dark:text-zinc-300">{booking.location}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Summary</h4>
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-3">
                              {role === 'customer' ? (
                                <>
                                  <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400">
                                    <span>Labour Fee</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{booking.payment.labourFee}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400">
                                    <span>Platform Fee</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{booking.payment.platformFee}</span>
                                  </div>
                                  {booking.payment.taxes > 0 && (
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400">
                                      <span>Taxes</span>
                                      <span className="font-medium text-gray-900 dark:text-white">₹{booking.payment.taxes}</span>
                                    </div>
                                  )}
                                  <hr className="border-gray-100 dark:border-zinc-800" />
                                  <div className="flex justify-between text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                    <span>Total Paid</span>
                                    <span>₹{booking.payment.totalPaid}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-400">
                                    <span>Gross Earnings</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{booking.payment.totalPaid - booking.payment.platformFee}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-red-500 dark:text-red-400">
                                    <span>Commission Deducted</span>
                                    <span>- ₹{booking.payment.platformFee}</span>
                                  </div>
                                  <hr className="border-gray-100 dark:border-zinc-800" />
                                  <div className="flex justify-between text-sm font-bold text-green-600 dark:text-green-400">
                                    <span>Final Payout</span>
                                    <span>₹{booking.payment.labourFee}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Timeline & Actions */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Booking Timeline</h4>
                            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 pl-6">
                              {renderTimelineStep('Booking Requested', booking.timeline.requested)}
                              {renderTimelineStep('Accepted', booking.timeline.accepted)}
                              {renderTimelineStep('On The Way', booking.timeline.onTheWay, booking.status === 'On The Way')}
                              {renderTimelineStep('Arrived', booking.timeline.arrived)}
                              {renderTimelineStep('Work Started', booking.timeline.workStarted, booking.status === 'Work Started')}
                              {renderTimelineStep('Work Completed', booking.timeline.workCompleted, false, true)}
                            </div>
                          </div>
                        </div>

                        {/* Full Width Actions Bottom Bar */}
                        <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-200 dark:border-zinc-800 flex flex-wrap gap-3">
                          {role === 'customer' ? (
                            <>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors">
                                <RefreshCw className="w-3.5 h-3.5" /> Book Again
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-colors">
                                <Download className="w-3.5 h-3.5" /> Invoice
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-colors">
                                <Heart className="w-3.5 h-3.5 text-rose-500" /> Favourite
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-colors">
                                <MessageSquare className="w-3.5 h-3.5" /> Chat
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors ml-auto">
                                <AlertOctagon className="w-3.5 h-3.5" /> Complaint
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-colors">
                                <MessageSquare className="w-3.5 h-3.5" /> Chat
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-colors">
                                <Phone className="w-3.5 h-3.5" /> Call
                              </button>
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-colors ml-auto">
                                <Star className="w-3.5 h-3.5 text-amber-500" /> Rate Customer
                              </button>
                            </>
                          )}
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
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-zinc-400">No bookings found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
