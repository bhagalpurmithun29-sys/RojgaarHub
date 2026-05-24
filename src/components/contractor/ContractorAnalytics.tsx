import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BarChart3, Users, Star, 
  Briefcase, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function ContractorAnalytics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> 12%
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">156</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Projects</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> 8%
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">₹12.4L</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Revenue</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-brand-amber/10 text-brand-amber rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> 24%
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">38</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Active Team</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl">
              <Star className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
              - 0%
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">4.8</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Avg Rating</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Trend Chart Mockup */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Revenue Trend
            </h3>
            <select className="bg-gray-50 dark:bg-zinc-800 border-none text-xs font-bold px-3 py-1.5 rounded-lg focus:ring-0 dark:text-white">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 95].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full relative flex items-end justify-center h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-xl group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors relative"
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-indigo-500 rounded-t-xl" style={{ height: '10%' }}></div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-bold text-gray-400">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Success Rate */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Project Success Rate</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Completed
                  </span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">94%</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-rose-500" /> Cancelled
                  </span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">6%</span>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '6%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Workers */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              Top Performers
              <span className="text-[10px] bg-brand-amber/10 text-brand-amber px-2 py-1 rounded-md">This Month</span>
            </h3>
            
            <div className="space-y-4">
              {[
                { name: 'Ravi Kumar', jobs: 42, score: 98, img: 'https://i.pravatar.cc/150?u=ravi' },
                { name: 'Sunil Das', jobs: 38, score: 96, img: 'https://i.pravatar.cc/150?u=sunil' },
                { name: 'Amit Sharma', jobs: 35, score: 95, img: 'https://i.pravatar.cc/150?u=amit' }
              ].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 font-black text-gray-300 dark:text-zinc-700">#{i+1}</div>
                  <img src={w.img} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{w.name}</h4>
                    <p className="text-[10px] text-gray-500">{w.jobs} Jobs Completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-brand-amber">{w.score}</p>
                    <p className="text-[10px] text-gray-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
