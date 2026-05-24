import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, Users, MapPin, Calendar, Clock, 
  IndianRupee, UploadCloud, AlertCircle, Image as ImageIcon,
  MessageSquare, Phone, CheckCircle2, XCircle, FileText,
  Search, Filter, ChevronRight, UserCircle2, Briefcase, Zap
} from 'lucide-react';

interface PostRequirementProps {
  kycStatus?: string;
  setShowBookingKYC?: (v: boolean) => void;
}

type Role = 'customer' | 'labour';
type SubTab = 'create' | 'manage' | 'marketplace';

const MOCK_REQUIREMENTS = [
  {
    id: 'REQ-001',
    title: 'Need 5 Painters',
    category: 'Painter',
    description: 'Need experienced painters for exterior house painting work.',
    labourRequired: 5,
    bookingType: 'Project',
    duration: '7 days',
    minBudget: 5000,
    maxBudget: 10000,
    startDate: '25 May 2026',
    location: 'Shimla, HP',
    priority: 'Normal',
    status: 'Open',
    applications: 3
  },
  {
    id: 'REQ-002',
    title: 'Urgent Plumber Required',
    category: 'Plumber',
    description: 'Major pipe burst in society basement. Need immediate fixing.',
    labourRequired: 1,
    bookingType: 'Hourly',
    duration: '2 hours',
    minBudget: 500,
    maxBudget: 1200,
    startDate: 'Today',
    location: 'Sector 14, Noida',
    priority: 'Emergency',
    status: 'In Review',
    applications: 5
  }
];

const MOCK_APPLICATIONS = [
  {
    id: 'APP-1',
    applicantName: 'Ravi Contractor',
    quote: 8500,
    estimatedTime: '5 days',
    teamSize: 6,
    message: 'We have a professional team ready to start immediately.',
    rating: 4.8
  },
  {
    id: 'APP-2',
    applicantName: 'Suresh Painters',
    quote: 9000,
    estimatedTime: '6 days',
    teamSize: 5,
    message: 'High quality materials included in the quote.',
    rating: 4.5
  }
];

export default function PostRequirement({ kycStatus, setShowBookingKYC }: PostRequirementProps) {
  const [role, setRole] = useState<Role>('customer');
  const [activeTab, setActiveTab] = useState<SubTab>('create');
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Normal');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kycStatus !== 'approved' && setShowBookingKYC) {
      setShowBookingKYC(true);
      return;
    }
    alert('Requirement Posted Successfully! It is now live on the marketplace.');
    setActiveTab('manage');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application Submitted Successfully!');
    setIsApplying(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Requirement Marketplace</h2>
          <p className="text-sm text-gray-500 mt-1">Post bulk requirements or browse open jobs in your area.</p>
        </div>
        <div className="bg-gray-100 dark:bg-zinc-900 p-1 rounded-xl inline-flex shadow-inner w-full md:w-auto">
          <button onClick={() => {setRole('customer'); setActiveTab('create');}} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'customer' ? 'bg-white dark:bg-zinc-800 text-brand-amber shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'}`}>Customer View</button>
          <button onClick={() => {setRole('labour'); setActiveTab('marketplace');}} className={`flex-1 md:px-6 py-2 rounded-lg text-sm font-bold transition-all ${role === 'labour' ? 'bg-white dark:bg-zinc-800 text-brand-amber shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-zinc-300'}`}>Labour/Contractor View</button>
        </div>
      </div>

      {role === 'customer' && (
        <div className="flex gap-4 border-b border-gray-200 dark:border-zinc-800 mb-6">
          <button onClick={() => setActiveTab('create')} className={`font-semibold pb-3 border-b-2 px-2 transition-all ${activeTab === 'create' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Create Requirement</button>
          <button onClick={() => setActiveTab('manage')} className={`font-semibold pb-3 border-b-2 px-2 transition-all ${activeTab === 'manage' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Manage My Requirements</button>
        </div>
      )}

      {/* CUSTOMER: CREATE REQUIREMENT FORM */}
      {role === 'customer' && activeTab === 'create' && (
        <form onSubmit={handlePostSubmit} className="max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-150 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            
            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-brand-amber" /> Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Requirement Title</label>
                  <input type="text" required placeholder="e.g. Need 5 Painters for exterior painting" className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Category</label>
                  <select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber outline-none">
                    <option>Electrician</option>
                    <option>Plumber</option>
                    <option>Painter</option>
                    <option>Carpenter</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Priority Level</label>
                  <div className="flex gap-2">
                    {['Normal', 'Urgent', 'Emergency'].map(p => (
                      <button type="button" key={p} onClick={() => setPriority(p)} className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${priority === p ? (p === 'Emergency' ? 'bg-red-50 border-red-500 text-red-600' : p === 'Urgent' ? 'bg-amber-50 border-amber-500 text-amber-600' : 'bg-blue-50 border-blue-500 text-blue-600') : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Detailed Description</label>
                  <textarea required rows={4} placeholder="Describe the work in detail..." className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber outline-none"></textarea>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-zinc-800" />

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-brand-amber" /> Work Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Workers Required</label>
                  <input type="number" min="1" required placeholder="e.g. 5" className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Booking Type</label>
                  <select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm">
                    <option>Hourly</option><option>Daily</option><option>Project</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Estimated Duration</label>
                  <input type="text" required placeholder="e.g. 7 days" className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm" />
                </div>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-zinc-800" />

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-brand-amber" /> Budget & Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Min Budget (₹)</label>
                    <input type="number" required placeholder="Min" className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Max Budget (₹)</label>
                    <input type="number" required placeholder="Max" className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Start Date</label>
                    <input type="date" required className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Location Mode</label>
                    <select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm">
                      <option>Current Location</option><option>Saved Address</option><option>Custom Location</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-zinc-800" />

            <section>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><UploadCloud className="w-5 h-5 text-brand-amber" /> Media & Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">Upload Images/Documents</p>
                  <p className="text-xs text-gray-500 mt-1">Drag and drop or click to browse</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Contact Preference</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-950">
                      <input type="radio" name="contact" className="w-4 h-4 text-brand-amber focus:ring-brand-amber" />
                      <MessageSquare className="w-4 h-4 text-gray-500" /> <span className="text-sm font-medium">Chat Only</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-950">
                      <input type="radio" name="contact" className="w-4 h-4 text-brand-amber focus:ring-brand-amber" />
                      <Phone className="w-4 h-4 text-gray-500" /> <span className="text-sm font-medium">Call Only</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-950">
                      <input type="radio" name="contact" defaultChecked className="w-4 h-4 text-brand-amber focus:ring-brand-amber" />
                      <UserCircle2 className="w-4 h-4 text-gray-500" /> <span className="text-sm font-medium">Both Chat & Call</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

          </div>
          <div className="p-6 md:p-8 bg-gray-50 dark:bg-zinc-950 border-t border-gray-150 dark:border-zinc-800 flex justify-end gap-4">
            <button type="button" className="px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-bold text-gray-700 dark:text-zinc-300">Save Draft</button>
            <button type="submit" className="px-8 py-3 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl shadow-md transition-all">Publish Requirement</button>
          </div>
        </form>
      )}

      {/* CUSTOMER: MANAGE REQUIREMENTS */}
      {role === 'customer' && activeTab === 'manage' && (
        <div className="space-y-6">
          {!selectedReq ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_REQUIREMENTS.map(req => (
                <div key={req.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-brand-amber/30 transition-all group" onClick={() => setSelectedReq(req)}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-amber transition-colors">{req.title}</h3>
                      <p className="text-sm text-gray-500 font-medium">{req.id} • {req.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'Open' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{req.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-zinc-400 mb-6">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {req.location}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {req.startDate}</div>
                    <div className="flex items-center gap-2"><IndianRupee className="w-4 h-4" /> ₹{req.minBudget}-₹{req.maxBudget}</div>
                    <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {req.labourRequired} Workers</div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <span className="text-sm font-bold text-brand-amber">{req.applications} Applications Received</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-150 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-950">
                <div>
                  <button onClick={() => setSelectedReq(null)} className="text-xs font-bold text-gray-500 hover:text-brand-amber mb-2 block">← Back to all requirements</button>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReq.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-bold">Edit</button>
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold">Close Post</button>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Applications Received ({selectedReq.applications})</h4>
                <div className="space-y-4">
                  {MOCK_APPLICATIONS.map(app => (
                    <div key={app.id} className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-lg dark:text-white">{app.applicantName}</h5>
                          <span className="font-black text-lg text-brand-amber">₹{app.quote}</span>
                        </div>
                        <div className="flex gap-4 text-xs font-medium text-gray-500 mb-4">
                          <span>Team: {app.teamSize} members</span>
                          <span>Est. Time: {app.estimatedTime}</span>
                          <span className="flex items-center text-amber-500"><Star className="w-3 h-3 fill-amber-500 mr-1" /> {app.rating}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-150 dark:border-zinc-800">
                          <p className="text-sm italic text-gray-600 dark:text-zinc-400">"{app.message}"</p>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 justify-center">
                        <button className="flex-1 md:flex-none px-6 py-2 bg-green-50 text-green-700 font-bold rounded-xl text-sm border border-green-200 hover:bg-green-100 transition-colors">Accept</button>
                        <button className="flex-1 md:flex-none px-6 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 font-bold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-zinc-950 transition-colors">Chat</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LABOUR: MARKETPLACE VIEW */}
      {role === 'labour' && activeTab === 'marketplace' && (
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Job Filters</h3>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-150 dark:border-zinc-800 space-y-4">
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Category</label><select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm"><option>All Categories</option><option>Painter</option><option>Plumber</option></select></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Budget Range</label><select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm"><option>Any Budget</option><option>₹1000 - ₹5000</option><option>₹5000+</option></select></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Distance</label><select className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm"><option>Within 10 km</option><option>Within 20 km</option></select></div>
              <label className="flex items-center gap-2 mt-4 cursor-pointer"><input type="checkbox" className="rounded text-brand-amber focus:ring-brand-amber w-4 h-4" /><span className="text-sm font-bold text-gray-700 dark:text-zinc-300">Urgent Only 🚨</span></label>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search available jobs..." className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-brand-amber/20 shadow-sm outline-none" />
            </div>

            {!isApplying ? (
              <div className="grid grid-cols-1 gap-6">
                {MOCK_REQUIREMENTS.map(req => (
                  <div key={req.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800 shadow-sm overflow-hidden group">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider`}>{req.category}</span>
                          {req.priority === 'Emergency' && <span className="px-2.5 py-1 rounded bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Emergency</span>}
                        </div>
                        <span className="text-sm font-black text-brand-amber">₹{req.minBudget} - ₹{req.maxBudget}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{req.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">{req.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800">
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Location</p><p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {req.location}</p></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Start Date</p><p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {req.startDate}</p></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Workers Req</p><p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {req.labourRequired}</p></div>
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Duration</p><p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {req.duration}</p></div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50/50 dark:bg-zinc-950/50 border-t border-gray-150 dark:border-zinc-800 flex gap-3">
                      <button className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 text-gray-700 dark:text-white font-bold rounded-xl text-sm transition-colors shadow-sm">View Details</button>
                      <button className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 text-gray-700 dark:text-white font-bold rounded-xl text-sm transition-colors shadow-sm">Chat with Client</button>
                      <button onClick={() => { setSelectedReq(req); setIsApplying(true); }} className="px-8 py-2.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl text-sm transition-all shadow-md ml-auto">Apply Now</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-150 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-150 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Submit Proposal</h3>
                    <p className="text-sm text-gray-500">For: <strong className="text-brand-amber">{selectedReq?.title}</strong></p>
                  </div>
                  <button type="button" onClick={() => setIsApplying(false)} className="p-2 text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full"><XCircle className="w-6 h-6" /></button>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Your Quote Amount (₹)</label>
                      <input type="number" required placeholder={`Client budget: ₹${selectedReq?.minBudget}-₹${selectedReq?.maxBudget}`} className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-brand-amber outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Est. Completion Time</label>
                      <input type="text" required placeholder="e.g. 5 days" className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Team Size (if applicable)</label>
                      <input type="number" placeholder="Number of members" className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Cover Message</label>
                    <textarea required rows={4} placeholder="Why should the client hire you? Mention your experience..." className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none"></textarea>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-zinc-950 border-t border-gray-150 dark:border-zinc-800">
                  <button type="submit" className="w-full py-3.5 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl shadow-md transition-all">Submit Application</button>
                </div>
              </form>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
