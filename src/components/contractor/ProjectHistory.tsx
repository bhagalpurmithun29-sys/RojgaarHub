import React, { useState } from 'react';
import { 
  Briefcase, CheckCircle2, XCircle, Search, Filter, 
  MapPin, Users, Star, IndianRupee, Clock, Calendar, 
  Download, FileText, RotateCcw, AlertTriangle, Image as ImageIcon,
  ChevronDown, ChevronUp, Map, ArrowRight, ShieldCheck
} from 'lucide-react';

// MOCK DATA FOR DEMO
const MOCK_STATS = {
  totalCompleted: 58,
  activeProjects: 12,
  cancelled: 3,
  totalRevenue: 580000,
  utilizationRate: 92
};

const MOCK_PROJECTS = [
  {
    id: "PRJ24581",
    title: "House Construction & Plastering",
    customer: "Mithun Kumar",
    category: "Construction",
    type: "Full Contract",
    startDate: "20 May 2026",
    endDate: "28 May 2026",
    status: "Completed",
    progress: 100,
    teamSize: 8,
    team: [
      { name: "Ravi Kumar", rating: 4.8 },
      { name: "Aman Sharma", rating: 4.7 },
      { name: "Vijay Singh", rating: 4.5 }
    ],
    location: {
      address: "Shimla Main Road, Near Valley View",
      distance: "4.2 km",
      area: "2400 sq.ft"
    },
    finances: {
      customerPaid: 50000,
      platformFee: 2500,
      contractorEarnings: 47500,
      teamPayment: 35000,
      profit: 12500
    },
    feedback: {
      rating: 4.9,
      review: "Team completed work on time and professionally. Excellent finishing!"
    },
    media: { images: 12, documents: 3 },
    timeline: [
      { step: "Project Created", completed: true },
      { step: "Workers Assigned", completed: true },
      { step: "Work Started", completed: true },
      { step: "Work In Progress", completed: true },
      { step: "Project Completed", completed: true },
      { step: "Payment Completed", completed: true }
    ]
  },
  {
    id: "PRJ24582",
    title: "Interior Painting & Waterproofing",
    customer: "Neha Sharma",
    category: "Painting",
    type: "Labor Contract",
    startDate: "22 May 2026",
    endDate: "26 May 2026",
    status: "In Progress",
    progress: 75,
    teamSize: 4,
    team: [
      { name: "Suresh", rating: 4.6 },
      { name: "Kamlesh", rating: 4.2 }
    ],
    location: {
      address: "Koramangala Block 5, Bangalore",
      distance: "8.1 km",
      area: "1200 sq.ft"
    },
    finances: {
      customerPaid: 25000,
      platformFee: 1250,
      contractorEarnings: 23750,
      teamPayment: 15000,
      profit: 8750
    },
    feedback: null,
    media: { images: 5, documents: 1 },
    timeline: [
      { step: "Project Created", completed: true },
      { step: "Workers Assigned", completed: true },
      { step: "Work Started", completed: true },
      { step: "Work In Progress", completed: true },
      { step: "Project Completed", completed: false },
      { step: "Payment Completed", completed: false }
    ]
  }
];

export default function ProjectHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(MOCK_PROJECTS[0].id);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 📊 Project Summary (Top Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Completed</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{MOCK_STATS.totalCompleted}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <Briefcase className="w-6 h-6 text-blue-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Active Projects</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{MOCK_STATS.activeProjects}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <XCircle className="w-6 h-6 text-red-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Cancelled</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{MOCK_STATS.cancelled}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <IndianRupee className="w-6 h-6 text-brand-amber mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white flex items-center">
            <span className="text-xl mr-1 text-brand-amber">₹</span>
            {MOCK_STATS.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
          <Users className="w-6 h-6 text-indigo-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Team Util.</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{MOCK_STATS.utilizationRate}%</p>
        </div>
      </div>

      {/* 🔎 Filters & Search */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID, Title, Customer..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/50 focus:border-brand-amber transition-all dark:text-white"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filter Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 transition-colors shrink-0">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 transition-colors shrink-0">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* 📁 Project History List */}
      <div className="space-y-4">
        {MOCK_PROJECTS.map((project) => {
          const isExpanded = expandedId === project.id;

          return (
            <div key={project.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300">
              {/* Header / Summary */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  
                  {/* Basic Details Info */}
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-zinc-700">
                      <Briefcase className="w-6 h-6 text-brand-amber" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{project.id}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <h3 className="font-black text-gray-900 dark:text-white text-lg">{project.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4" /> Customer: <span className="font-bold text-gray-700 dark:text-gray-300">{project.customer}</span>
                      </p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap lg:flex-nowrap gap-6 items-center">
                    <div className="hidden md:block">
                      <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-1">Progress</p>
                      <div className="w-32 bg-gray-100 dark:bg-zinc-800 rounded-full h-2 mb-1 overflow-hidden">
                        <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-brand-amber'}`} style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 text-right">{project.progress}%</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-1">Earnings</p>
                      <p className="font-black text-gray-900 dark:text-white flex items-center">
                        <span className="text-green-600 mr-1">₹</span>{project.finances.contractorEarnings.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-transform group-hover:bg-brand-amber group-hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 p-6 animate-in slide-in-from-top-2 duration-300">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    
                    {/* Basic Info Box */}
                    <div className="space-y-4 bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm">
                      <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-700">
                        <Briefcase className="w-5 h-5 text-blue-500" /> Project Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-zinc-400">Category</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{project.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-zinc-400">Type</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{project.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-zinc-400">Start Date</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{project.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-zinc-400">End Date</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{project.endDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Team Info Box */}
                    <div className="space-y-4 bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm">
                      <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-700">
                        <Users className="w-5 h-5 text-brand-amber" /> Team Information
                      </h4>
                      <div className="mb-2">
                        <span className="text-xs font-bold bg-brand-amber/10 text-brand-amber px-2 py-1 rounded-md">
                          Assigned: {project.teamSize} Workers
                        </span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {project.team.map((member, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-900 p-2 rounded-lg border border-gray-100 dark:border-zinc-700">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-amber to-brand-orange text-white flex items-center justify-center text-[10px]">{member.name.charAt(0)}</div>
                              {member.name}
                            </span>
                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {member.rating}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Revenue Breakdown */}
                    <div className="space-y-4 bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm">
                      <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-700">
                        <IndianRupee className="w-5 h-5 text-green-500" /> Revenue Breakdown
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-zinc-400">Customer Paid</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">₹{project.finances.customerPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-zinc-400">Platform Fee</span>
                          <span className="text-sm font-bold text-red-500">-₹{project.finances.platformFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-zinc-700">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Net Earnings</span>
                          <span className="text-sm font-black text-gray-900 dark:text-white">₹{project.finances.contractorEarnings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-zinc-400">Team Payout</span>
                          <span className="text-sm font-bold text-orange-500">-₹{project.finances.teamPayment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-zinc-700">
                          <span className="text-sm font-black text-gray-900 dark:text-white">Final Profit</span>
                          <span className="text-lg font-black text-green-600">₹{project.finances.profit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    
                    {/* Location & Media */}
                    <div className="space-y-4 lg:col-span-1">
                      <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm">
                        <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-700 mb-3">
                          <MapPin className="w-5 h-5 text-red-500" /> Location Info
                        </h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-bold leading-relaxed">{project.location.address}</p>
                        <div className="flex gap-4 mt-3">
                          <span className="text-xs bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded text-gray-500 flex items-center gap-1"><Map className="w-3 h-3"/> {project.location.distance}</span>
                          <span className="text-xs bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {project.location.area}</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm flex items-center justify-around">
                        <div className="text-center">
                          <div className="w-10 h-10 mx-auto bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-2">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <p className="font-black text-gray-900 dark:text-white">{project.media.images}</p>
                          <p className="text-[10px] uppercase font-bold text-gray-500">Images</p>
                        </div>
                        <div className="w-px h-12 bg-gray-100 dark:bg-zinc-700"></div>
                        <div className="text-center">
                          <div className="w-10 h-10 mx-auto bg-purple-50 dark:bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-2">
                            <FileText className="w-5 h-5" />
                          </div>
                          <p className="font-black text-gray-900 dark:text-white">{project.media.documents}</p>
                          <p className="text-[10px] uppercase font-bold text-gray-500">Docs</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Feedback */}
                    <div className="space-y-4 lg:col-span-2">
                      <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm flex flex-col h-full justify-between">
                        <div>
                          <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-700 mb-4">
                            <Clock className="w-5 h-5 text-indigo-500" /> Project Timeline
                          </h4>
                          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {project.timeline.map((item, idx) => (
                              <React.Fragment key={idx}>
                                <div className="flex flex-col items-center gap-2 shrink-0 w-24">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-400'}`}>
                                    {item.completed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                  </div>
                                  <p className={`text-[10px] font-bold text-center ${item.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{item.step}</p>
                                </div>
                                {idx < project.timeline.length - 1 && (
                                  <div className="w-8 h-px shrink-0 mt-4 bg-gray-200 dark:bg-zinc-700"></div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Customer Feedback section if exists */}
                        {project.feedback && (
                          <div className="mt-4 bg-amber-50 dark:bg-brand-amber/10 border border-amber-200 dark:border-brand-amber/20 rounded-xl p-4">
                            <h4 className="font-bold text-amber-900 dark:text-amber-500 text-sm flex items-center gap-2 mb-2">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Customer Feedback ({project.feedback.rating}/5.0)
                            </h4>
                            <p className="text-sm text-amber-800 dark:text-amber-400/80 italic">"{project.feedback.review}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 justify-end">
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm">
                      <Download className="w-4 h-4"/> Invoice
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm">
                      <FileText className="w-4 h-4"/> Report
                    </button>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 hover:border-red-200 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm">
                      <AlertTriangle className="w-4 h-4"/> Dispute
                    </button>
                    <button className="px-4 py-2 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm">
                      <RotateCcw className="w-4 h-4"/> Rehire Team
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
