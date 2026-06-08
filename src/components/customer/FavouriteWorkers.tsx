import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Star, MapPin, Search, Filter, Phone, 
  MessageSquare, UserX, AlertTriangle, ShieldCheck,
  ChevronDown, CheckCircle2, UserPlus, Zap
} from 'lucide-react';
import api from '@/utils/api';

interface FavouriteWorkersProps {
  kycStatus?: string;
  setShowBookingKYC?: (v: boolean) => void;
}

const MOCK_FAVOURITES = [
  {
    id: '1',
    name: 'Ravi Kumar',
    category: 'Electrician',
    rating: 4.8,
    experience: '6 Years',
    distance: '2.3 km',
    reliability: '96%',
    lastBooked: '12 May 2026',
    status: 'available', // available, unavailable, area_changed
    image: 'https://i.pravatar.cc/150?u=ravi_e'
  },
  {
    id: '2',
    name: 'Aman Sharma',
    category: 'Plumber',
    rating: 4.9,
    experience: '8 Years',
    distance: '1.2 km',
    reliability: '98%',
    lastBooked: '20 April 2026',
    status: 'unavailable',
    image: 'https://i.pravatar.cc/150?u=aman_p'
  },
  {
    id: '3',
    name: 'Rohit Singh',
    category: 'Painter',
    rating: 4.7,
    experience: '5 Years',
    distance: '15 km',
    reliability: '92%',
    lastBooked: '05 Jan 2026',
    status: 'area_changed',
    image: 'https://i.pravatar.cc/150?u=rohit_p'
  }
];

const SUGGESTIONS = [
  {
    id: '4',
    name: 'Vikram Singh',
    category: 'Electrician',
    rating: 4.8,
    hiredCount: 4,
    image: 'https://i.pravatar.cc/150?u=vikram_e',
    reason: 'Frequently Hired'
  },
  {
    id: '5',
    name: 'Suresh Das',
    category: 'Plumber',
    rating: 4.6,
    hiredCount: 0,
    image: 'https://i.pravatar.cc/150?u=suresh_p',
    reason: 'Similar to Aman'
  }
];

export default function FavouriteWorkers({ kycStatus, setShowBookingKYC }: FavouriteWorkersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Added');
  const [favourites, setFavourites] = useState(MOCK_FAVOURITES);

  React.useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await api.get('/profiles/favourites');
        if (res.data && res.data.length > 0) {
          const mappedFavs = res.data.map((fav: any) => ({
            id: fav._id || fav.id,
            name: fav.user?.name || fav.name,
            category: fav.skills?.[0] || 'Worker',
            rating: fav.rating || 4.5,
            experience: `${fav.experienceYears || 0} Years`,
            distance: fav.distance || '2.0 km',
            reliability: '98%',
            lastBooked: 'Recently',
            status: fav.availabilityStatus === 'available' ? 'available' : 'unavailable',
            image: fav.user?.profilePic || 'https://i.pravatar.cc/150'
          }));
          setFavourites(mappedFavs);
        }
      } catch (err) {
        console.error('Failed to load favourites. Using mock fallback.', err);
      }
    };
    fetchFavourites();
  }, []);

  const handleBookAgain = (e: React.MouseEvent, status: string) => {
    if (status === 'unavailable') {
      alert('This worker is currently unavailable.');
      return;
    }
    if (kycStatus !== 'approved' && setShowBookingKYC) {
      e.preventDefault();
      setShowBookingKYC(true);
    } else {
      alert('Proceeding to booking flow...');
    }
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Remove from favourites?')) {
      setFavourites(favourites.filter(f => f.id !== id));
    }
  };

  const filteredFavs = favourites.filter(fav => 
    (activeCategory === 'All' || fav.category === activeCategory) &&
    (fav.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     fav.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> My Favourite Workers
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage and quickly re-book your preferred professionals.</p>
      </div>

      {/* AI Smart Suggestions Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900/50 p-6 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-brand-amber" /> Smart Suggestions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUGGESTIONS.map(sug => (
              <div key={sug.id} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur p-4 rounded-2xl flex items-center gap-4 border border-white/50 dark:border-zinc-800 shadow-sm">
                <img src={sug.image} alt={sug.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-zinc-700" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm dark:text-white truncate">{sug.name}</h4>
                  <p className="text-xs text-brand-amber font-semibold">{sug.reason}</p>
                </div>
                <button className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sorting Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-2 pl-4 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search favorites..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-transparent border-none focus:ring-0 text-sm font-medium outline-none dark:text-white"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-zinc-800">
          <select 
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm font-bold text-gray-700 dark:text-zinc-200 rounded-xl px-4 py-2 focus:outline-none"
          >
            <option>All Categories</option>
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Painter</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm font-bold text-gray-700 dark:text-zinc-200 rounded-xl px-4 py-2 focus:outline-none"
          >
            <option>Recently Added</option>
            <option>Highest Rating</option>
            <option>Nearest First</option>
          </select>
        </div>
      </div>

      {/* Favourites Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredFavs.map((worker) => (
            <motion.div
              key={worker.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-zinc-900 rounded-3xl border ${worker.status === 'unavailable' ? 'border-gray-200 opacity-75 dark:border-zinc-800' : 'border-gray-150 dark:border-zinc-800'} shadow-sm overflow-hidden flex flex-col group`}
            >
              <div className="p-6 pb-4 flex items-start gap-4 relative">
                
                {/* Status Badges */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  <button onClick={() => handleRemove(worker.id)} className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 rounded-full transition-colors tooltip-trigger relative">
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </button>
                </div>

                <div className="relative shrink-0">
                  <img src={worker.image} alt={worker.name} className={`w-20 h-20 rounded-2xl object-cover border-2 shadow-sm ${worker.status === 'unavailable' ? 'border-gray-300 grayscale' : 'border-white dark:border-zinc-800'}`} />
                  {worker.status === 'available' && <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-zinc-900"><CheckCircle2 className="w-3 h-3" /></div>}
                </div>
                
                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate mb-1">{worker.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mb-3">{worker.category}</p>
                  
                  {worker.status === 'unavailable' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-bold uppercase">
                      <UserX className="w-3.5 h-3.5" /> Currently Unavailable
                    </span>
                  )}
                  {worker.status === 'area_changed' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 rounded-lg text-xs font-bold uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" /> Service Area Changed
                    </span>
                  )}
                  {worker.status === 'available' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-500 rounded-lg text-xs font-bold uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Available Now
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50/50 dark:bg-zinc-950/50 border-y border-gray-100 dark:border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Rating</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {worker.rating}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1">{worker.experience}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Distance</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1"><MapPin className="w-4 h-4 text-brand-amber" /> {worker.distance}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Last Booked</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{worker.lastBooked}</p>
                </div>
              </div>

              <div className="p-4 mt-auto flex gap-3 bg-white dark:bg-zinc-900">
                <button className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                  <Phone className="w-4 h-4" /> <span className="hidden sm:inline">Call</span>
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex justify-center items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> <span className="hidden sm:inline">Chat</span>
                </button>
                <button 
                  onClick={(e) => handleBookAgain(e, worker.status)} 
                  disabled={worker.status === 'unavailable'}
                  className={`flex-[2] font-bold py-2.5 rounded-xl text-sm transition-all shadow-md flex justify-center items-center gap-2 ${worker.status === 'unavailable' ? 'bg-gray-300 dark:bg-zinc-700 text-gray-500 cursor-not-allowed' : 'bg-brand-amber hover:bg-brand-orange text-white'}`}
                >
                  Book Again
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredFavs.length === 0 && (
          <div className="col-span-full py-16 text-center bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
            <Heart className="w-16 h-16 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No favourites found</h3>
            <p className="text-sm text-gray-500">You haven't added any workers to your favourites yet, or they don't match your filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}
