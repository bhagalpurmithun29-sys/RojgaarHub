import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Filter, MoreVertical, Star, MapPin, 
  Briefcase, CheckCircle2, UserPlus, Upload, ShieldAlert
} from 'lucide-react';

export default function TeamManagement() {
  const [workers, setWorkers] = useState([
    {
      id: 'W-001',
      name: 'Ravi Kumar',
      image: 'https://i.pravatar.cc/150?u=ravi',
      skill: 'Master Electrician',
      experience: '5 Years',
      rating: 4.8,
      status: 'Available',
      currentProject: null,
      location: 'Shimla Sector 4'
    },
    {
      id: 'W-002',
      name: 'Amit Sharma',
      image: 'https://i.pravatar.cc/150?u=amit',
      skill: 'Plumber',
      experience: '3 Years',
      rating: 4.5,
      status: 'On Site',
      currentProject: 'City Mall Renovation',
      location: 'Mall Road'
    },
    {
      id: 'W-003',
      name: 'Sunil Das',
      image: 'https://i.pravatar.cc/150?u=sunil',
      skill: 'Carpenter',
      experience: '8 Years',
      rating: 4.9,
      status: 'On Break',
      currentProject: 'City Mall Renovation',
      location: 'Mall Road'
    },
    {
      id: 'W-004',
      name: 'Manoj Singh',
      image: 'https://i.pravatar.cc/150?u=manoj',
      skill: 'Mason',
      experience: '2 Years',
      rating: 4.2,
      status: 'Inactive',
      currentProject: null,
      location: 'Unknown'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search team members by name or skill..." 
            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber dark:text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-2xl text-sm font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-brand-amber hover:bg-brand-orange text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-amber/20 transition-colors">
            <UserPlus className="w-4 h-4" /> Add Worker
          </button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex gap-4 text-sm font-bold text-gray-500">
          <span className="text-gray-900 dark:text-white border-b-2 border-brand-amber pb-1">All Members (38)</span>
          <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">Available (12)</span>
          <span className="cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">On Site (26)</span>
        </div>
        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
          <Upload className="w-4 h-4" /> Bulk Import
        </button>
      </div>

      {/* Worker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {workers.map((worker) => (
            <motion.div 
              key={worker.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group relative"
            >
              <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-5">
                <div className="relative">
                  <img src={worker.image} alt={worker.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-50 dark:border-zinc-800" />
                  <div className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 border-2 border-white dark:border-zinc-900 rounded-full ${
                    worker.status === 'Available' ? 'bg-green-500' :
                    worker.status === 'On Site' ? 'bg-brand-amber' :
                    worker.status === 'On Break' ? 'bg-amber-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{worker.name}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> {worker.skill}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs font-bold">
                    <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center gap-1 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-current" /> {worker.rating}
                    </span>
                    <span className="text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                      Exp: {worker.experience}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-zinc-400">Current Status</span>
                  <span className={`font-bold ${
                    worker.status === 'Available' ? 'text-green-600' :
                    worker.status === 'On Site' ? 'text-brand-amber' :
                    worker.status === 'On Break' ? 'text-amber-600' : 'text-gray-500'
                  }`}>{worker.status}</span>
                </div>
                {worker.currentProject && (
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-gray-500 dark:text-zinc-400 shrink-0">Assigned To</span>
                    <span className="font-bold text-gray-900 dark:text-white text-right line-clamp-1">{worker.currentProject}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-zinc-400">Location</span>
                  <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-500" /> {worker.location}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-brand-amber hover:bg-brand-orange text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-sm">
                  Assign Job
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 py-3 rounded-xl font-bold text-sm transition-colors">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
