import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Phone, Users, FileText, AlertTriangle, 
  MessageSquare, Mail, HelpCircle, CheckCircle2, X,
  Plus, Camera, Trash2, MapPin, Search
} from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function SafetySupport() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  
  // Complaint Form State
  const [issueCategory, setIssueCategory] = useState('Harassment / Abuse');
  const [bookingId, setBookingId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emergencyContacts = [
    { id: 1, name: 'Ravi Kumar', relation: 'Brother', phone: '+91 98765 43210' },
    { id: 2, name: 'Wife', relation: 'Spouse', phone: '+91 98765 43211' }
  ];

  const tickets = [
    { id: 'CMP2045', type: 'Complaint', issue: 'Customer did not cooperate', status: 'Under Review', date: 'Today' },
    { id: 'TKT1082', type: 'Support', issue: 'Withdrawal not received', status: 'In Progress', date: 'Yesterday' }
  ];

  const handleSOS = async () => {
    setShowSosConfirm(false);
    setSosActive(true);
    try {
      const res = await api.post('/support/sos', {
        coordinates: { lat: 28.6139, lng: 77.2090 }, // mock coords
        emergencyContacts: emergencyContacts.map(c => c.phone)
      });
      toast.success(res.data.message || 'SOS Triggered successfully!');
    } catch (err: any) {
      toast.error('Failed to trigger SOS');
    }
    
    setTimeout(() => setSosActive(false), 5000); // Auto reset for demo
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.post('/support/disputes', {
        bookingId: bookingId || null,
        reason: `${issueCategory}: ${description}`
      });
      toast.success(res.data.message || 'Report submitted successfully');
      setBookingId('');
      setDescription('');
      setActiveTab('overview');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Safety & Support</h2>
          <p className="text-sm text-gray-500">Your security is our priority. 24/7 Assistance available.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'complaints' ? 'bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
          >
            Complaints
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contacts' ? 'bg-white dark:bg-zinc-900 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
          >
            Contacts
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          
          {/* Main SOS & Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SOS Button Area */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-rose-500/5 dark:bg-rose-500/10 z-0"></div>
              
              <AnimatePresence mode="wait">
                {!showSosConfirm && !sosActive ? (
                  <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 w-full">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Emergency Help</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">Pressing SOS will alert admin, share live location, and notify contacts.</p>
                    
                    <button 
                      onClick={() => setShowSosConfirm(true)}
                      className="w-48 h-48 rounded-full bg-gradient-to-b from-rose-500 to-red-600 text-white font-black text-4xl shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:shadow-[0_0_60px_rgba(225,29,72,0.6)] hover:scale-105 transition-all flex flex-col items-center justify-center mx-auto border-8 border-rose-100 dark:border-zinc-800"
                    >
                      SOS
                      <span className="text-xs font-semibold opacity-80 mt-1 uppercase tracking-widest">Tap for Help</span>
                    </button>
                  </motion.div>
                ) : showSosConfirm ? (
                  <motion.div key="confirm" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full py-10">
                    <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Trigger SOS?</h3>
                    <p className="text-gray-500 text-sm mb-8">This action is for real emergencies only. It will instantly share your location with authorities and emergency contacts.</p>
                    
                    <div className="flex gap-4 max-w-xs mx-auto">
                      <button onClick={() => setShowSosConfirm(false)} className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleSOS} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transition-colors">
                        Yes, Help!
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="active" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full py-10">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-30"></div>
                      <div className="absolute inset-0 bg-rose-500 rounded-full animate-pulse opacity-50"></div>
                      <div className="w-full h-full bg-rose-600 rounded-full flex items-center justify-center relative z-10 text-white">
                        <MapPin className="w-10 h-10" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-rose-600 dark:text-rose-500 mb-2">SOS Active</h3>
                    <p className="text-gray-600 dark:text-zinc-300 font-medium">Live location shared. Admin is reviewing your status.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Metrics & AI Warning */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Safety History Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                  <ShieldAlert className="w-5 h-5 text-rose-500 mb-2" />
                  <p className="text-3xl font-black text-gray-900 dark:text-white">1</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">SOS Used</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                  <FileText className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="text-3xl font-black text-gray-900 dark:text-white">3</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Complaints</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-3xl font-black text-gray-900 dark:text-white">5</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Tickets</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mb-2" />
                  <p className="text-3xl font-black text-gray-900 dark:text-white">2</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Reports</p>
                </div>
              </div>

              {/* AI Safety Layer Alert */}
              <div className="bg-orange-50 dark:bg-orange-500/10 rounded-3xl p-6 border border-orange-200 dark:border-orange-500/20 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-500/20 p-3 rounded-2xl shrink-0">
                    <ShieldAlert className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900 dark:text-orange-300">AI Safety Alert</h4>
                    <p className="text-sm text-orange-800 dark:text-orange-400/80 mt-1 max-w-md">System detected a high-risk customer in your recent booking request based on past behavior patterns.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 text-sm font-bold rounded-xl border border-orange-200 dark:border-orange-500/30 hover:bg-orange-50 transition-colors whitespace-nowrap">
                  View Details
                </button>
              </div>

              {/* Quick Contact Center */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Support Contact Center</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors border border-gray-100 dark:border-zinc-700/50">
                    <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">Call Support</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors border border-gray-100 dark:border-zinc-700/50">
                    <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">Live Chat</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors border border-gray-100 dark:border-zinc-700/50">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">Email</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors border border-gray-100 dark:border-zinc-700/50">
                    <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-300">FAQs</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'complaints' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Raise Complaint Form */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Raise a Complaint / Report</h3>
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">Issue Category</label>
                  <select 
                    value={issueCategory} 
                    onChange={(e) => setIssueCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-amber text-gray-900 dark:text-white"
                  >
                    <option>Harassment / Abuse</option>
                    <option>Fraud Activity</option>
                    <option>Payment Issue</option>
                    <option>Unsafe Behavior</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">Booking ID (Optional)</label>
                  <input 
                    type="text" 
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="e.g. 64b3a... (ObjectId)" 
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-amber text-gray-900 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea 
                    rows={4} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe exactly what happened..." 
                    className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-amber text-gray-900 dark:text-white resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wider block mb-2">Upload Evidence (Images/Audio)</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">Tap to upload files</p>
                    <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, PDF</p>
                  </div>
                </div>
                <button disabled={isSubmitting} type="submit" className="w-full bg-brand-amber hover:bg-brand-orange text-white py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-brand-amber/20 mt-2 disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            </div>

            {/* Ticket History */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Recent Tickets & Reports</h3>
              <div className="flex-1 space-y-4">
                {tickets.map(t => (
                  <div key={t.id} className="p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                          t.type === 'Complaint' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {t.type}
                        </span>
                        <span className="text-xs font-bold text-gray-400">#{t.id}</span>
                      </div>
                      <span className="text-xs text-gray-500">{t.date}</span>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-3">{t.issue}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> {t.status}
                      </span>
                      <button className="text-indigo-600 hover:underline font-bold">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {activeTab === 'contacts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" /> Emergency Contacts
                </h3>
                <p className="text-xs text-gray-500 mt-1">These contacts will be notified when you trigger SOS.</p>
              </div>
              <button className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
                <Plus className="w-4 h-4" /> Add New
              </button>
            </div>

            <div className="space-y-4">
              {emergencyContacts.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-zinc-700/50 bg-gray-50 dark:bg-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-black text-lg">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{c.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium">{c.relation}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-600"></span>
                        <span className="font-mono">{c.phone}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-rose-600 transition-colors bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
