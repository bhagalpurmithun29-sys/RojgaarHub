import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Star, Clock, CheckCircle2, AlertTriangle, 
  MapPin, Award, Zap, Shield, Target, XCircle, ChevronRight, BarChart3, LineChart
} from 'lucide-react';

export default function PerformanceAnalytics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Hero Section - Performance Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900 to-indigo-700 dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center items-center text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
          
          <h3 className="text-indigo-200 dark:text-zinc-400 font-bold tracking-wider uppercase text-xs mb-4 relative z-10">Overall Performance Score</h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-4 z-10">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#4ade80" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="20.096" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black">92</span>
              <span className="text-xs text-indigo-200">/ 100</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full relative z-10">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-bold text-white">Excellent Standing</span>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Jobs Done</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">156</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-zinc-400">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">4.8</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-zinc-400">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Reliability</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">96%</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-zinc-400">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Response</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">3 <span className="text-sm font-medium text-gray-500">min</span></p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-zinc-400">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Cancel Rate</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">1.2%</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-zinc-400">
              <Target className="w-4 h-4 text-brand-amber" />
              <span className="text-xs font-bold uppercase tracking-wider">Trust Score</span>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">98/100</p>
          </div>
        </div>
      </div>

      {/* AI Suggestions & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">AI Performance Insights</h3>
              <p className="text-xs text-gray-500">Smart suggestions to grow your business</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 p-4 rounded-2xl flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 dark:text-green-400 font-medium">Your response time improved by 20% this week. Keep it up to rank higher in search results!</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">Add more portfolio images of your recent Electrician work. Profiles with images get 3x more bookings.</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-400 font-medium">Enable "Emergency Services" during weekends. Demand is currently high in Shimla for immediate fixes.</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Earned Badges</h3>
              <p className="text-xs text-gray-500">Showcased on your public profile</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-800/30 text-center">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-3">
                <Star className="w-6 h-6" fill="currentColor" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Top Rated</p>
              <p className="text-[10px] text-gray-500 mt-1">Consistently 4.8+ stars</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-800/30 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" fill="currentColor" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Fast Responder</p>
              <p className="text-[10px] text-gray-500 mt-1">Replies under 5 mins</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-800/30 text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6" fill="currentColor" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">Highly Reliable</p>
              <p className="text-[10px] text-gray-500 mt-1">95%+ Completion Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border border-brand-amber/30 dark:border-brand-amber/20 rounded-2xl bg-brand-amber/5 dark:bg-brand-amber/5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-amber/10 rounded-bl-full"></div>
              <div className="w-12 h-12 bg-brand-orange text-white rounded-full flex items-center justify-center mb-3 shadow-md shadow-brand-orange/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">100+ Jobs</p>
              <p className="text-[10px] text-gray-500 mt-1">Milestone Unlocked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Earnings Chart (Mock UI) */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">May Earnings</h3>
              <p className="text-xs text-gray-500">Weekly Breakdown</p>
            </div>
            <select className="bg-gray-50 dark:bg-zinc-800 text-xs font-bold px-3 py-1.5 rounded-lg border-none outline-none">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-2 pt-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-indigo-500/20 rounded-t-lg relative group h-[40%] hover:bg-indigo-500/30 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹4,500</div>
              </div>
              <span className="text-[10px] font-bold text-gray-500">Week 1</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-indigo-500/60 rounded-t-lg relative group h-[70%] hover:bg-indigo-500/70 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹6,200</div>
              </div>
              <span className="text-[10px] font-bold text-gray-500">Week 2</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-indigo-600 rounded-t-lg relative group h-[60%] hover:bg-indigo-700 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹5,800</div>
              </div>
              <span className="text-[10px] font-bold text-gray-900 dark:text-white">Week 3</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full bg-indigo-500/10 rounded-t-lg relative group h-[10%]"></div>
              <span className="text-[10px] font-bold text-gray-400">Week 4</span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Rating Analytics</h3>
              <p className="text-xs text-gray-500">Based on 142 reviews</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-3 py-1.5 rounded-lg font-bold text-sm">
              <Star className="w-4 h-4 fill-current" /> 4.8
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { stars: 5, percent: 85, count: 120 },
              { stars: 4, percent: 10, count: 15 },
              { stars: 3, percent: 3, count: 4 },
              { stars: 2, percent: 1, count: 2 },
              { stars: 1, percent: 1, count: 1 },
            ].map((rating) => (
              <div key={rating.stars} className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 w-12 text-gray-600 dark:text-zinc-400 font-medium text-xs">
                  {rating.stars} <Star className="w-3 h-3 fill-gray-400" />
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${rating.stars >= 4 ? 'bg-green-500' : rating.stars === 3 ? 'bg-amber-400' : 'bg-red-500'}`} 
                    style={{ width: `${rating.percent}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right text-xs font-bold text-gray-900 dark:text-white">{rating.percent}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bookings & Cancellations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Booking Stats */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Booking Lifecycle</h3>
          <div className="text-center mb-6">
            <p className="text-4xl font-black text-indigo-600">210</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Total Bookings</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-zinc-400"><CheckCircle2 className="w-4 h-4 text-green-500"/> Completed</span>
              <span className="font-bold text-gray-900 dark:text-white">156</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-zinc-400"><Clock className="w-4 h-4 text-amber-500"/> Pending</span>
              <span className="font-bold text-gray-900 dark:text-white">8</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-zinc-400"><AlertTriangle className="w-4 h-4 text-orange-500"/> Rescheduled</span>
              <span className="font-bold text-gray-900 dark:text-white">12</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-zinc-400"><XCircle className="w-4 h-4 text-red-500"/> Cancelled</span>
              <span className="font-bold text-gray-900 dark:text-white">5</span>
            </div>
          </div>
        </div>

        {/* Cancellation Reasons */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Cancellation Reasons</h3>
          <div className="text-center mb-6">
            <p className="text-4xl font-black text-rose-500">4</p>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Cancelled by you</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-zinc-400">Busy schedule</span>
              <span className="font-bold text-gray-900 dark:text-white">2</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 mb-2"><div className="bg-rose-400 h-1.5 rounded-full" style={{ width: '50%' }}></div></div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-zinc-400">Customer unavailable</span>
              <span className="font-bold text-gray-900 dark:text-white">1</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 mb-2"><div className="bg-rose-400 h-1.5 rounded-full" style={{ width: '25%' }}></div></div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-zinc-400">Personal reason</span>
              <span className="font-bold text-gray-900 dark:text-white">1</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5 mb-2"><div className="bg-rose-400 h-1.5 rounded-full" style={{ width: '25%' }}></div></div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Top Areas</h3>
              <p className="text-xs text-gray-500">Where you get most work</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold text-xs">1</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Shimla</p>
                  <p className="text-[10px] text-gray-500">Central Zone</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-600 dark:text-emerald-400">48</p>
                <p className="text-[10px] text-gray-500">Bookings</p>
              </div>
            </div>

            <div className="p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 font-bold text-xs">2</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Kufri</p>
                  <p className="text-[10px] text-gray-500">North Zone</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900 dark:text-white">26</p>
                <p className="text-[10px] text-gray-500">Bookings</p>
              </div>
            </div>

            <div className="p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 font-bold text-xs">3</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Solan</p>
                  <p className="text-[10px] text-gray-500">South Zone</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900 dark:text-white">14</p>
                <p className="text-[10px] text-gray-500">Bookings</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
