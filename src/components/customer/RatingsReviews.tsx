import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Image as ImageIcon, AlertTriangle, ShieldCheck, 
  ThumbsUp, Flag, CheckCircle2, Award, TrendingUp,
  MessageSquare, Camera, XCircle, Search, Filter
} from 'lucide-react';

type Role = 'customer' | 'labour';
type SubTab = 'write' | 'read';
type RatingType = 'completion' | 'cancellation';

const MOCK_REVIEWS = [
  {
    id: 'R1',
    author: 'Mithun Kumar',
    rating: 5,
    date: '20 May 2026',
    text: 'Very professional and completed work before expected time. Quality was excellent.',
    images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=150', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150'],
    helpfulCount: 12,
    verified: true,
    isSuspicious: false
  },
  {
    id: 'R2',
    author: 'Neha Sharma',
    rating: 2,
    date: '18 May 2026',
    text: 'He came late and didn\'t clean up after painting. Not recommended.',
    images: [],
    helpfulCount: 4,
    verified: true,
    isSuspicious: false
  },
  {
    id: 'R3',
    author: 'Anonymous',
    rating: 5,
    date: '15 May 2026',
    text: 'Best service ever!!!! Buy now link: http://spam.com',
    images: [],
    helpfulCount: 0,
    verified: false,
    isSuspicious: true
  }
];

export default function RatingsReviews() {
  const [role, setRole] = useState<Role>('customer');
  const [activeTab, setActiveTab] = useState<SubTab>('read');
  const [ratingType, setRatingType] = useState<RatingType>('completion');
  
  // Form state
  const [overallRating, setOverallRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Sub-ratings
  const [subRatings, setSubRatings] = useState({
    workQuality: 0, behaviour: 0, communication: 0, punctuality: 0, payment: 0, availability: 0
  });

  const handleSubRating = (key: string, val: number) => {
    setSubRatings(prev => ({ ...prev, [key]: val }));
  };

  const StarInput = ({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) => (
    <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-150 dark:border-zinc-800">
      <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star} 
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
          >
            <Star className={`w-5 h-5 ${value >= star ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-zinc-700'}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header & Toggles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Ratings & Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">Build trust, read feedback, and grow your reliability score.</p>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl inline-flex shadow-inner w-full md:w-auto">
          <button onClick={() => setRole('customer')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'customer' ? 'bg-white dark:bg-zinc-800 text-brand-amber shadow-sm' : 'text-gray-500'}`}>Customer View</button>
          <button onClick={() => setRole('labour')} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'labour' ? 'bg-white dark:bg-zinc-800 text-brand-amber shadow-sm' : 'text-gray-500'}`}>Labour View</button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-zinc-800 mb-6">
        <button onClick={() => setActiveTab('read')} className={`font-semibold pb-3 border-b-2 px-2 transition-all ${activeTab === 'read' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Public Reviews & Impact</button>
        <button onClick={() => setActiveTab('write')} className={`font-semibold pb-3 border-b-2 px-2 transition-all ${activeTab === 'write' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Write a Review (Pending: 1)</button>
      </div>

      {/* TAB 1: READ PUBLIC REVIEWS & IMPACT */}
      {activeTab === 'read' && (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Col: Impact System */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-gradient-to-br from-brand-amber to-brand-orange p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex items-center gap-4 mb-6">
                <img src={role === 'customer' ? 'https://i.pravatar.cc/150?u=customer' : 'https://i.pravatar.cc/150?u=ravi_e'} className="w-16 h-16 rounded-full border-2 border-white/50 object-cover" />
                <div>
                  <h3 className="font-bold text-xl">{role === 'customer' ? 'Mithun Kumar' : 'Ravi Kumar'}</h3>
                  <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm mt-1">
                    <Award className="w-3 h-3" /> {role === 'customer' ? 'Verified Member' : 'Top Rated Expert'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-black/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">Overall Rating</p>
                  <p className="text-2xl font-black flex items-center gap-1">4.8 <Star className="w-5 h-5 fill-white" /></p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">Total Reviews</p>
                  <p className="text-2xl font-black flex items-center gap-1">154 <MessageSquare className="w-4 h-4" /></p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-wider font-bold opacity-80 mb-1">Reliability Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-green-300">96%</p>
                    <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">Rating Breakdown</h4>
              {[5,4,3,2,1].map(stars => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-600 dark:text-zinc-400 w-4">{stars}</span>
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-amber rounded-full" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : 2}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Reviews Feed */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white dark:bg-zinc-900 p-2 pl-4 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm">
              <span className="text-sm font-bold text-gray-500 dark:text-zinc-400 flex items-center">
                Review Filters
              </span>
              <div className="flex items-center gap-2">
                <select className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-sm font-bold text-gray-700 dark:text-zinc-200 rounded-xl px-4 py-2.5 outline-none">
                  <option>Latest Reviews</option>
                  <option>Highest Rating</option>
                  <option>Lowest Rating</option>
                </select>
                <button className="p-2.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-500 hover:text-brand-amber transition-colors"><Filter className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_REVIEWS.map(review => (
                <div key={review.id} className={`bg-white dark:bg-zinc-900 p-6 rounded-3xl border shadow-sm transition-all ${review.isSuspicious ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10' : 'border-gray-150 dark:border-zinc-800'}`}>
                  {review.isSuspicious && (
                    <div className="flex items-center gap-2 text-rose-600 bg-rose-100 dark:bg-rose-950/50 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 w-fit">
                      <AlertTriangle className="w-4 h-4" /> Suspicious Review Detected by AI
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-amber/10 text-brand-amber rounded-full flex items-center justify-center font-black text-lg">
                        {review.author[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          {review.author} 
                          {review.verified && <span title="Verified Booking"><ShieldCheck className="w-4 h-4 text-blue-500" /></span>}
                        </h4>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${review.rating >= star ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-zinc-700'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-zinc-300 text-sm leading-relaxed mb-4">{review.text}</p>

                  {review.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt="Review attachment" className="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-zinc-700 cursor-pointer hover:opacity-80 transition-opacity" />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-amber transition-colors">
                      <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpfulCount})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors ml-auto">
                      <Flag className="w-4 h-4" /> Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WRITE A REVIEW FORM */}
      {activeTab === 'write' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm overflow-hidden">
            
            <div className="p-6 md:p-8 border-b border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rate your experience</h3>
                  <p className="text-sm text-gray-500">Booking: #RZH-24581</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setRatingType('completion')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${ratingType === 'completion' ? 'bg-brand-amber text-white border-brand-amber' : 'bg-white dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700'}`}>Work Completed</button>
                  <button onClick={() => setRatingType('cancellation')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${ratingType === 'cancellation' ? 'bg-rose-500 text-white border-rose-500' : 'bg-white dark:bg-zinc-800 text-gray-500 border-gray-200 dark:border-zinc-700'}`}>Cancellation</button>
                </div>
              </div>

              {/* Huge Overall Rating Stars */}
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Overall Rating</p>
                <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="focus:outline-none transition-transform hover:scale-125"
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setOverallRating(star)}
                    >
                      <Star className={`w-12 h-12 transition-colors ${
                        (hoverRating || overallRating) >= star ? 'text-amber-500 fill-amber-500 drop-shadow-md' : 'text-gray-300 dark:text-zinc-700'
                      }`} />
                    </button>
                  ))}
                </div>
                <div className="mt-4 h-6">
                  {overallRating > 0 && (
                     <span className="text-lg font-black text-brand-amber animate-in zoom-in">
                       {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][overallRating - 1]}
                     </span>
                  )}
                </div>
              </div>
            </div>

            <form className="p-6 md:p-8 space-y-8" onSubmit={e => { e.preventDefault(); alert('Review Submitted Successfully!'); setActiveTab('read'); }}>
              
              {/* Detailed Sub-ratings */}
              <section>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Filter className="w-5 h-5 text-brand-amber" /> Rate specific areas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ratingType === 'completion' && role === 'customer' && (
                    <>
                      <StarInput label="Work Quality" value={subRatings.workQuality} onChange={v => handleSubRating('workQuality', v)} />
                      <StarInput label="Behaviour" value={subRatings.behaviour} onChange={v => handleSubRating('behaviour', v)} />
                      <StarInput label="Communication" value={subRatings.communication} onChange={v => handleSubRating('communication', v)} />
                      <StarInput label="Punctuality" value={subRatings.punctuality} onChange={v => handleSubRating('punctuality', v)} />
                    </>
                  )}
                  {ratingType === 'completion' && role === 'labour' && (
                    <>
                      <StarInput label="Customer Behaviour" value={subRatings.behaviour} onChange={v => handleSubRating('behaviour', v)} />
                      <StarInput label="Payment Reliability" value={subRatings.payment} onChange={v => handleSubRating('payment', v)} />
                      <StarInput label="Communication" value={subRatings.communication} onChange={v => handleSubRating('communication', v)} />
                      <StarInput label="Work Clarity" value={subRatings.workQuality} onChange={v => handleSubRating('workQuality', v)} />
                    </>
                  )}
                  {ratingType === 'cancellation' && (
                    <>
                      <StarInput label="Reliability" value={subRatings.punctuality} onChange={v => handleSubRating('punctuality', v)} />
                      <StarInput label="Communication" value={subRatings.communication} onChange={v => handleSubRating('communication', v)} />
                      <div className="col-span-1 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cancellation Reason</label>
                        <select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium outline-none">
                          <option>Select primary reason</option>
                          <option>Did not show up</option>
                          <option>Unresponsive</option>
                          <option>Changed mind</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Written Review */}
              <section>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-brand-amber" /> Written Review</h4>
                <textarea 
                  required 
                  rows={5} 
                  placeholder="Share details of your experience..." 
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber outline-none transition-all"
                ></textarea>
              </section>

              {/* Media Upload */}
              {ratingType === 'completion' && role === 'customer' && (
                <section>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-brand-amber" /> Upload Photos (Optional)</h4>
                  <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer group">
                    <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-brand-amber transition-colors mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">Add Before/After Photos</p>
                    <p className="text-xs text-gray-500 mt-1">Upload images of the completed work</p>
                  </div>
                </section>
              )}

              <button type="submit" className="w-full py-4 bg-brand-amber hover:bg-brand-orange text-white font-black rounded-xl shadow-lg shadow-brand-amber/30 transition-all text-lg tracking-wide uppercase">
                Submit Review
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
