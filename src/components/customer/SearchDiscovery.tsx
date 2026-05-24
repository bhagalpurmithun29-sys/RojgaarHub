import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Mic, MapPin, Filter, Star, ShieldCheck, 
  Clock, TrendingUp, Zap, ChevronDown, CheckCircle2, 
  Heart, SlidersHorizontal, Map, UserPlus, X
} from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

interface SearchDiscoveryProps {
  kycStatus?: string;
  setShowBookingKYC?: (v: boolean) => void;
}

const TRENDING_CATEGORIES = [
  { name: 'Electrician', icon: '⚡' },
  { name: 'Plumber', icon: '🔧' },
  { name: 'Painter', icon: '🎨' },
  { name: 'Carpenter', icon: '🔨' },
  { name: 'Cleaner', icon: '🧹' },
];

const MOCK_RESULTS = [
  {
    id: '1',
    name: 'Ravi Kumar',
    category: 'Electrician',
    rating: 4.8,
    experience: '6 Years',
    verified: true,
    distance: '2.3 km',
    responseTime: '3 min',
    reliability: '96%',
    price: '₹500/day',
    image: 'https://i.pravatar.cc/150?u=ravi_e'
  },
  {
    id: '2',
    name: 'Aman Sharma',
    category: 'Plumber',
    rating: 4.9,
    experience: '8 Years',
    verified: true,
    distance: '1.2 km',
    responseTime: '5 min',
    reliability: '98%',
    price: '₹600/day',
    image: 'https://i.pravatar.cc/150?u=aman_p',
    isAiRecommended: true
  },
  {
    id: '3',
    name: 'Suresh Das',
    category: 'Painter',
    rating: 4.5,
    experience: '4 Years',
    verified: false,
    distance: '4.5 km',
    responseTime: '15 min',
    reliability: '88%',
    price: '₹400/day',
    image: 'https://i.pravatar.cc/150?u=suresh_p'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    category: 'Electrician',
    rating: 4.7,
    experience: '5 Years',
    verified: true,
    distance: '3.1 km',
    responseTime: '2 min',
    reliability: '94%',
    price: '₹450/day',
    image: 'https://i.pravatar.cc/150?u=vikram_e'
  }
];

export default function SearchDiscovery({ kycStatus, setShowBookingKYC }: SearchDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Shimla');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Highest rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter States
  const [priceRange, setPriceRange] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [maxDistance, setMaxDistance] = useState('All');

  const [workers, setWorkers] = useState<any[]>(MOCK_RESULTS);
  const [isLoading, setIsLoading] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    bookingType: 'hourly',
    date: '',
    timeSlot: '10:00 AM - 12:00 PM',
    address: '',
    totalAmount: 500
  });

  React.useEffect(() => {
    fetchWorkers();
  }, [activeCategory]);

  const fetchWorkers = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeCategory === 'All' 
        ? '/profiles/search' 
        : `/profiles/search?category=${activeCategory}`;
        
      const res = await api.get(endpoint);
      if (res.status === 200 && res.data.length > 0) {
        const mapped = res.data.map((p: any) => ({
          id: p.user?._id || 'unknown',
          name: p.user?.name || 'Worker',
          category: p.category || 'General',
          rating: p.ratings || 4.5,
          experience: `${p.experienceYears || 0} Years`,
          verified: p.user?.isVerified || true,
          distance: '2.3 km', // Mock distance
          responseTime: '15 min',
          reliability: '96%',
          price: `₹${p.hourlyRate || 500}/day`,
          image: p.user?.profileImage || `https://i.pravatar.cc/150?u=${p.user?._id}`,
          rawPrice: p.hourlyRate || 500
        }));
        setWorkers(mapped);
      } else {
        setWorkers(MOCK_RESULTS); // Fallback to mock if empty for demo
      }
    } catch (err) {
      console.error(err);
      setWorkers(MOCK_RESULTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (e: React.MouseEvent, worker: any) => {
    if (kycStatus !== 'approved' && setShowBookingKYC) {
      e.preventDefault();
      setShowBookingKYC(true);
    } else {
      setSelectedWorker(worker);
      setBookingForm(prev => ({ ...prev, totalAmount: worker.rawPrice || 500 }));
      setIsBookingModalOpen(true);
    }
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;

    try {
      const payload = {
        labourId: selectedWorker.id,
        ...bookingForm
      };

      const promise = api.post('/bookings', payload);
      
      toast.promise(promise, {
        loading: 'Creating your booking...',
        success: 'Booking request sent successfully!',
        error: 'Failed to create booking. Time slot might be taken.'
      });

      const res = await promise;
      if (res.status === 201) {
        setIsBookingModalOpen(false);
        // Optionally redirect to Active Booking or History
      }
    } catch (err) {
      console.error(err);
    }
  };

  const results = workers.filter(res => 
    (res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     res.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const aiRecommended = workers.find(r => r.isAiRecommended) || workers[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Header & Smart Search Bar */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Smart Discovery</h2>
        <p className="text-sm text-gray-500 mt-1">Find the perfect professional with AI-powered search & GPS routing.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-3 rounded-3xl shadow-lg border border-gray-150 dark:border-zinc-800 flex flex-col md:flex-row gap-3 relative z-20">
        <div className="flex-1 relative flex items-center bg-gray-50 dark:bg-zinc-950 rounded-2xl px-4 py-3 border border-transparent focus-within:border-brand-amber/30 transition-all">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="E.g. Electrician, 5 painters tomorrow..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none pl-3 pr-4 focus:ring-0 text-sm font-medium text-gray-900 dark:text-white placeholder:font-normal placeholder:text-gray-400"
          />
          <button className="p-2 text-brand-amber hover:bg-brand-amber/10 rounded-xl transition-colors shrink-0 tooltip-trigger relative group">
            <Mic className="w-5 h-5" />
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Voice Search</span>
          </button>
        </div>

        <div className="w-full md:w-64 relative flex items-center bg-gray-50 dark:bg-zinc-950 rounded-2xl px-4 py-3 border border-transparent focus-within:border-brand-amber/30 transition-all">
          <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent border-none pl-3 pr-4 focus:ring-0 text-sm font-medium text-gray-900 dark:text-white"
          />
          <button className="text-xs text-brand-amber font-bold shrink-0 hover:underline">Detect</button>
        </div>

        <button className="bg-brand-amber hover:bg-brand-orange text-white font-bold px-8 py-3 rounded-2xl shadow-md transition-all whitespace-nowrap">
          Search
        </button>
      </div>

      {/* 2. Trending Categories */}
      <div className="flex flex-col space-y-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-brand-amber" /> Trending Near You
        </h3>
        <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-none">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-bold whitespace-nowrap transition-all ${activeCategory === 'All' ? 'bg-gray-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-md' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'}`}
          >
            All Services
          </button>
          {TRENDING_CATEGORIES.map(cat => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.name ? 'bg-gray-900 dark:bg-white text-white dark:text-zinc-900 border-transparent shadow-md' : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 3. Left Sidebar: Advanced Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
            <button onClick={() => setShowMobileFilters(!showMobileFilters)} className="p-2 bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
              <SlidersHorizontal className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
            </button>
          </div>

          <div className={`space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Price Filter */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price Range</h4>
              <div className="space-y-2">
                {['All', '₹100–500', '₹500–1000', '₹1000+'].map(price => (
                  <label key={price} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${priceRange === price ? 'bg-brand-amber border-brand-amber' : 'bg-gray-50 dark:bg-zinc-950 border-gray-300 dark:border-zinc-700 group-hover:border-brand-amber'}`}>
                      {priceRange === price && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-zinc-300 font-medium">{price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Minimum Rating</h4>
              <div className="space-y-2">
                {['All', '4.0+', '4.5+', '5.0'].map(rating => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${minRating === rating ? 'border-4 border-brand-amber bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-950 border-gray-300 dark:border-zinc-700 group-hover:border-brand-amber'}`} />
                    <span className="text-sm text-gray-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                      {rating !== 'All' && <Star className="w-3.5 h-3.5 text-brand-amber fill-brand-amber" />} {rating}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Distance</h4>
              <select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber outline-none">
                <option>Within 2 km</option>
                <option>Within 5 km</option>
                <option>Within 10 km</option>
                <option>Any Distance</option>
              </select>
            </div>

            {/* Availability & Verification */}
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150 dark:border-zinc-800 cursor-pointer shadow-sm">
                <span className="text-sm font-bold text-gray-700 dark:text-zinc-200">Verified Only</span>
                <div className="relative w-10 h-6 bg-brand-amber rounded-full">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                </div>
              </label>
              <label className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150 dark:border-zinc-800 cursor-pointer shadow-sm">
                <span className="text-sm font-bold text-gray-700 dark:text-zinc-200">Available Now</span>
                <div className="relative w-10 h-6 bg-gray-200 dark:bg-zinc-700 rounded-full">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Right Main Area: AI Recs, Sorting, Results */}
        <div className="flex-1 space-y-6">
          
          {/* AI Recommendation Banner */}
          {aiRecommended && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-3xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <Zap className="w-3 h-3" /> AI Top Match
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Based on your previous bookings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>{aiRecommended.name}</strong> is highly rated in your area and usually responds within {aiRecommended.responseTime}.</p>
                </div>
                <div className="shrink-0 flex items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border border-white/50 dark:border-zinc-800 w-full md:w-auto">
                  <img src={aiRecommended.image} alt="AI Match" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sm dark:text-white">{aiRecommended.name}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{aiRecommended.price}</p>
                  </div>
                  <button onClick={(e) => handleBookNow(e, aiRecommended)} className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md">Book</button>
                </div>
              </div>
            </div>
          )}

          {/* Sorting Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-zinc-900 p-2 pl-4 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm">
            <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">
              Showing <strong>{results.length}</strong> results
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Sort By:</span>
              <div className="relative w-full sm:w-auto">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-48 appearance-none bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm font-bold text-gray-700 dark:text-zinc-200 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-amber/20"
                >
                  <option>Highest rating</option>
                  <option>Lowest price</option>
                  <option>Nearest first</option>
                  <option>Most experienced</option>
                  <option>Fastest response</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {results.map((worker) => (
                <motion.div
                  key={worker.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-brand-amber/30 transition-all overflow-hidden flex flex-col group"
                >
                  <div className="p-6 pb-4 flex items-start gap-4">
                    <div className="relative">
                      <img src={worker.image} alt={worker.name} className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-zinc-700 shadow-sm" />
                      {worker.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900" title="Verified Expert">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2 group-hover:text-brand-amber transition-colors">{worker.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">{worker.category}</p>
                        </div>
                        <button className="text-gray-300 hover:text-rose-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-zinc-300 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md">
                          <Star className="w-3 h-3 fill-amber-500" /> {worker.rating}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-zinc-400">
                          <MapPin className="w-3 h-3" /> {worker.distance}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50/50 dark:bg-zinc-950/50 border-y border-gray-100 dark:border-zinc-800 grid grid-cols-2 gap-y-3 gap-x-4">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Experience</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5 text-gray-400" /> {worker.experience}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Response Time</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" /> {worker.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Reliability</p>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {worker.reliability}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Base Rate</p>
                      <p className="text-sm font-black text-brand-amber">{worker.price}</p>
                    </div>
                  </div>

                  <div className="p-4 mt-auto flex gap-3">
                    <button className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                      View Profile
                    </button>
                    <button onClick={(e) => handleBookNow(e, worker)} className="flex-1 bg-brand-amber hover:bg-brand-orange text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-md">
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {results.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
                <Search className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No professionals found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-brand-amber font-bold hover:underline">Clear all filters</button>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && selectedWorker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Book {selectedWorker.name}</h3>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitBooking} className="p-6 space-y-6">
                <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                  <img src={selectedWorker.image} className="w-14 h-14 rounded-full object-cover shadow-sm" alt="Worker" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{selectedWorker.category} Service</h4>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Rate: {selectedWorker.price}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Booking Type</label>
                    <select 
                      required
                      value={bookingForm.bookingType}
                      onChange={e => setBookingForm({...bookingForm, bookingType: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 outline-none"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Date</label>
                    <input 
                      type="date" 
                      required
                      value={bookingForm.date}
                      onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 outline-none text-gray-700 dark:text-zinc-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Time Slot</label>
                  <select 
                    required
                    value={bookingForm.timeSlot}
                    onChange={e => setBookingForm({...bookingForm, timeSlot: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 outline-none"
                  >
                    <option>09:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 01:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                    <option>04:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Service Address</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter full address"
                    value={bookingForm.address}
                    onChange={e => setBookingForm({...bookingForm, address: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 outline-none"
                  />
                </div>

                <button type="submit" className="w-full bg-brand-amber hover:bg-brand-orange text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2">
                  Confirm Booking <CheckCircle2 className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
