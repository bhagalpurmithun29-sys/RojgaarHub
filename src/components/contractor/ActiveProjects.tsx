import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Calendar, Users, ChevronRight, 
  Clock, CheckCircle2, AlertCircle, Plus, Search, Filter
} from 'lucide-react';

export default function ActiveProjects() {
  const [projects] = useState([
    {
      id: 'PRJ-8012',
      name: 'City Mall Renovation',
      type: 'Commercial',
      status: 'Active',
      progress: 65,
      startDate: '12 May 2026',
      endDate: '30 May 2026',
      teamAssigned: 8,
      budget: '₹4,50,000',
      address: 'Mall Road, Shimla',
      client: 'Retail Corp India'
    },
    {
      id: 'PRJ-8015',
      name: 'Villa Electrical Wiring',
      type: 'Residential',
      status: 'Pending',
      progress: 0,
      startDate: '26 May 2026',
      endDate: '05 Jun 2026',
      teamAssigned: 3,
      budget: '₹85,000',
      address: 'Sector 4, New Shimla',
      client: 'Mr. Ananya Singh'
    },
    {
      id: 'PRJ-7992',
      name: 'Office Plumbing Setup',
      type: 'Commercial',
      status: 'Completed',
      progress: 100,
      startDate: '01 May 2026',
      endDate: '10 May 2026',
      teamAssigned: 4,
      budget: '₹1,20,000',
      address: 'IT Park',
      client: 'Tech Solutions Ltd'
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber shadow-sm dark:text-white"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 rounded-2xl text-sm font-bold border border-gray-100 dark:border-zinc-800 shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02]">
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projects.map((project) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                    project.status === 'Active' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                    project.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                    'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-md">
                    {project.type}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{project.name}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">{project.client}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700">
                  {project.id}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Project Progress</span>
                <span className="text-lg font-black text-gray-900 dark:text-white">{project.progress}%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full rounded-full ${
                    project.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-brand-amber to-brand-orange'
                  }`}
                />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Start</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{project.startDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Deadline</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{project.endDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Team</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{project.teamAssigned} Workers</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">{project.budget}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                Manage Team
              </button>
              <button className="flex-1 bg-brand-amber hover:bg-brand-orange text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                Project Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
