import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, TrendingUp, ShieldCheck, Camera, Search, Filter, 
  ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, CheckCircle2,
  Calendar, ShieldAlert, Award
} from 'lucide-react';

export default function RatingsReviews() {
  const [filter, setFilter] = useState('Latest');
  
  const reviews = [
    {
      id: 'RZH-24581',
      customerName: 'Mithun Kumar',
      image: 'https://i.pravatar.cc/150?u=mithun',
      rating: 5,
      date: '20 May 2026',
      text: 'Very professional and completed work before expected time. Highly recommended for electrical work.',
      hasPhotos: true,
      photos: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=150&q=80'],
      verified: true,
      categoryRatings: { quality: 5, behavior: 5, communication: 5, punctuality: 5 }
    },
    {
      id: 'RZH-24410',
      customerName: 'Anjali Sharma',
      image: 'https://i.pravatar.cc/150?u=anjali',
      rating: 4,
      date: '18 May 2026',
      text: 'Good work, but arrived 15 mins late. Rest everything was perfect.',
      hasPhotos: false,
      photos: [],
      verified: true,
      categoryRatings: { quality: 5, behavior: 5, communication: 4, punctuality: 3 }
    },
    {
      id: 'RZH-24305',
      customerName: 'Rahul Verma',
      image: 'https://i.pravatar.cc/150?u=rahul2',
      rating: 1,
      date: '15 May 2026',
      text: 'Worst service ever.',
      hasPhotos: false,
      photos: [],
      verified: false,
      isSuspicious: true,
      aiAnalysis: 'This review contains unusually short text and originates from an unverified booking account. Flagged by AI.'
    },
    {
      id: 'RZH-24299',
      customerName: 'Priya Das',
      image: 'https://i.pravatar.cc/150?u=priya',
      isCancellation: true,
      cancelledBy: 'Labour',
      rating: 3,
      date: '12 May 2026',
      text: 'Labour cancelled the booking at the last minute due to emergency, but informed properly.',
      categoryRatings: { reliability: 2, communication: 5, cancellationExp: 4 }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Top Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-center items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
          <p className="text-xs font-bold text-amber-100 uppercase tracking-wider mb-1">Overall Rating</p>
          <p className="text-4xl font-black flex items-center gap-2">
            4.8 <Star className="w-6 h-6 fill-white text-white" />
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center items-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Reviews</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            156 <MessageSquare className="w-5 h-5 text-indigo-500" />
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center items-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Reliability</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            96% <TrendingUp className="w-5 h-5 text-blue-500" />
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-[100px]"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Satisfaction</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            94% <CheckCircle2 className="w-5 h-5 text-green-500" />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Analytics Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Star Distribution */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Rating Breakdown</h3>
            <div className="space-y-3">
              {[
                { stars: 5, percent: 85, color: 'bg-green-500' },
                { stars: 4, percent: 10, color: 'bg-green-400' },
                { stars: 3, percent: 3, color: 'bg-amber-400' },
                { stars: 2, percent: 1, color: 'bg-orange-500' },
                { stars: 1, percent: 1, color: 'bg-red-500' },
              ].map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-sm">
                  <div className="w-8 flex items-center gap-1 font-bold text-gray-600 dark:text-zinc-400">
                    {r.stars} <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.percent}%` }}></div>
                  </div>
                  <div className="w-10 text-right font-bold text-gray-900 dark:text-white">{r.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Category-wise Performance */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-gray-900 dark:text-white">Category Performance</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Work Quality', rating: 4.9 },
                { label: 'Behaviour', rating: 4.8 },
                { label: 'Communication', rating: 4.7 },
                { label: 'Punctuality', rating: 4.5 },
                { label: 'Professionalism', rating: 4.8 }
              ].map(cat => (
                <div key={cat.label} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(cat.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white w-6 text-right">{cat.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Reviews List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {['Latest', 'Highest', 'Lowest', 'With Photos', 'Verified Only'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    filter === f 
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                      : 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors w-full md:w-auto justify-center">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img src={review.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-50 dark:border-zinc-800" alt="Customer" />
                        {review.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-zinc-900">
                            <ShieldCheck className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {review.customerName}
                          {review.isCancellation && <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Cancellation Rating</span>}
                        </h4>
                        
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <div className="flex text-amber-400">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`} />
                            ))}
                          </div>
                          <span className="text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-lg">
                        #{review.id}
                      </span>
                    </div>
                  </div>

                  {/* AI Analysis Warning */}
                  {review.isSuspicious && (
                    <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-0.5">AI Review Analysis Flag</p>
                        <p className="text-xs text-rose-600/80 dark:text-rose-300/80">{review.aiAnalysis}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-gray-700 dark:text-zinc-300 text-sm leading-relaxed mb-4">
                    "{review.text}"
                  </p>

                  {/* Attached Photos */}
                  {review.hasPhotos && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
                        <Camera className="w-4 h-4" /> Attached Photos (2)
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {review.photos?.map((photo, i) => (
                          <img key={i} src={photo} className="w-24 h-24 rounded-xl object-cover border border-gray-200 dark:border-zinc-700 cursor-pointer hover:opacity-80 transition-opacity" alt="Work" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Ratings Tags */}
                  {review.categoryRatings && !review.isCancellation && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <span className="text-[10px] bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-2 py-1 rounded-md font-medium border border-gray-100 dark:border-zinc-700">Quality: ⭐ {review.categoryRatings.quality}</span>
                      <span className="text-[10px] bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-2 py-1 rounded-md font-medium border border-gray-100 dark:border-zinc-700">Behavior: ⭐ {review.categoryRatings.behavior}</span>
                      <span className="text-[10px] bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-2 py-1 rounded-md font-medium border border-gray-100 dark:border-zinc-700">Punctuality: ⭐ {review.categoryRatings.punctuality}</span>
                    </div>
                  )}
                  {review.isCancellation && review.categoryRatings && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <span className="text-[10px] bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-md font-medium border border-rose-100 dark:border-rose-900/30">Reliability: ⭐ {review.categoryRatings.reliability}</span>
                      <span className="text-[10px] bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-md font-medium border border-rose-100 dark:border-rose-900/30">Communication: ⭐ {review.categoryRatings.communication}</span>
                    </div>
                  )}
                  
                  {/* Footer Actions */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" /> Helpful (12)
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-rose-600 transition-colors">
                        <ShieldAlert className="w-4 h-4" /> Report
                      </button>
                    </div>
                    {!review.isCancellation && !review.isSuspicious && (
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Reply to Review</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
