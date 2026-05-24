'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

interface Ticket {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'CRITICAL';
  status: 'Open' | 'Under Investigation' | 'Resolved';
  createdAt: string;
}

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export default function SafetySupportDashboard() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  // SOS & Emergency States
  const [isSosAlarmActive, setIsSosAlarmActive] = useState(false);
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: 28.6139, lng: 77.2090 }); // Delhi Base
  const [locationToken, setLocationToken] = useState('');
  const [gpsLogs, setGpsLogs] = useState<string[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Contacts States
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Police Helpline', relation: 'National Service', phone: '100' },
    { id: '2', name: 'Rozgaar Support Dispatch', relation: 'Platform Emergency', phone: '+91 99999 88888' },
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Ticket / Complaint States
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketCategory, setTicketCategory] = useState('Payment Dispute');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'CRITICAL'>('High');

  // Live Helpdesk Chat States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'agent', text: 'Hello! I am Rozgaar Care AI. How can I assist you with your booking, wallet, or safety concerns today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Offline Sync & Network states
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<Ticket[]>([]);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Sync state values for offline system
  useEffect(() => {
    // Check initial online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        triggerOfflineSync();
      };
      const handleOffline = () => {
        setIsOnline(false);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Load draft
      const draft = localStorage.getItem('rozgaar_ticket_draft');
      if (draft) {
        try {
          const data = JSON.parse(draft);
          setTicketTitle(data.title || '');
          setTicketDescription(data.description || '');
          setTicketCategory(data.category || 'Payment Dispute');
        } catch (e) {
          console.error(e);
        }
      }

      // Load offline queue
      const queued = localStorage.getItem('rozgaar_offline_sync_queue');
      if (queued) {
        try {
          setOfflineQueue(JSON.parse(queued));
        } catch (e) {
          console.error(e);
        }
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Save draft as the user types
  const handleUpdateDraft = (title: string, desc: string, cat: string) => {
    setTicketTitle(title);
    setTicketDescription(desc);
    setTicketCategory(cat);
    localStorage.setItem('rozgaar_ticket_draft', JSON.stringify({ title, description: desc, category: cat }));
  };

  const triggerOfflineSync = () => {
    const queuedStr = localStorage.getItem('rozgaar_offline_sync_queue');
    if (queuedStr) {
      try {
        const queued: Ticket[] = JSON.parse(queuedStr);
        if (queued.length > 0) {
          setSyncToast('🔌 Connected! Automatically synchronizing queued offline drafts to database...');
          setTimeout(() => {
            const currentTickets = localStorage.getItem('rozgaar_tickets');
            let parsedCurrent: Ticket[] = [];
            if (currentTickets) {
              parsedCurrent = JSON.parse(currentTickets);
            }
            // Append offline queued tickets
            const merged = [...queued, ...parsedCurrent];
            setTickets(merged);
            localStorage.setItem('rozgaar_tickets', JSON.stringify(merged));
            
            // Clear queue and draft
            localStorage.removeItem('rozgaar_offline_sync_queue');
            localStorage.removeItem('rozgaar_ticket_draft');
            setOfflineQueue([]);
            setSyncToast('🎉 Sync success! All offline drafts synced with live Admin dispute queue.');
            
            setTimeout(() => setSyncToast(null), 3000);
          }, 1500);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const toggleSimulationNetwork = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      // Simulate reconnect trigger
      const queuedStr = localStorage.getItem('rozgaar_offline_sync_queue');
      if (queuedStr && JSON.parse(queuedStr).length > 0) {
        triggerOfflineSync();
      } else {
        setSyncToast('🔌 Network connected. Operational logs active.');
        setTimeout(() => setSyncToast(null), 2500);
      }
    } else {
      setSyncToast('🔌 Network offline. Local drafts and automatic queueing active.');
      setTimeout(() => setSyncToast(null), 2500);
    }
  };

  // LocalStorage sync for tickets & SOS
  useEffect(() => {
    const savedTickets = localStorage.getItem('rozgaar_tickets');
    if (savedTickets) {
      try { setTickets(JSON.parse(savedTickets)); } catch (e) { console.error(e); }
    } else {
      const defaultTickets: Ticket[] = [
        { id: 'TKT-7701', category: 'Payment Dispute', title: 'Late cancellation penalty charged by mistake', description: 'Simulated automatic strike triggered penalty fee ₹150. Request refund.', priority: 'High', status: 'Open', createdAt: '2026-05-20' },
        { id: 'TKT-2983', category: 'Worker Behaviour', title: 'Worker did not wear security gear', description: 'Safety compliance concern regarding helmet and gloves.', priority: 'Medium', status: 'Resolved', createdAt: '2026-05-18' }
      ];
      setTickets(defaultTickets);
      localStorage.setItem('rozgaar_tickets', JSON.stringify(defaultTickets));
    }

    const savedContacts = localStorage.getItem('rozgaar_contacts');
    if (savedContacts) {
      try { setContacts(JSON.parse(savedContacts)); } catch (e) { console.error(e); }
    }

    const activeSos = localStorage.getItem('rozgaar_sos_active');
    if (activeSos === 'true') {
      setIsSosAlarmActive(true);
    }
  }, []);

  // Save tickets
  const saveTicketsList = (updated: Ticket[]) => {
    setTickets(updated);
    localStorage.setItem('rozgaar_tickets', JSON.stringify(updated));
  };

  // Save contacts
  const saveContactsList = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem('rozgaar_contacts', JSON.stringify(updated));
  };

  // Simulated GPS tracker updates during SOS
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSosAlarmActive) {
      // Simulate minor shifts in Delhi GPS coords
      interval = setInterval(() => {
        const nextLat = gpsCoordinates.lat + (Math.random() - 0.5) * 0.002;
        const nextLng = gpsCoordinates.lng + (Math.random() - 0.5) * 0.002;
        setGpsCoordinates({ lat: nextLat, lng: nextLng });
        
        const timestamp = new Date().toLocaleTimeString();
        setGpsLogs(prev => [`[${timestamp}] GPS telemetry broadcast lat: ${nextLat.toFixed(5)}, lng: ${nextLng.toFixed(5)}`, ...prev.slice(0, 4)]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isSosAlarmActive, gpsCoordinates]);

  // Audio Siren Synthesis using Web Audio API for WOW factor
  const startSirenAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // We will modulate a frequency oscillator between 600Hz and 1200Hz to make a high quality siren sound!
      let timeCount = 0;
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        // Modulate frequency
        const frequency = 600 + Math.sin(timeCount) * 400;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        
        // Soft volume envelope
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        
        timeCount += 0.8;
      }, 400);

    } catch (e) {
      console.error('Audio Context not allowed or initialized', e);
    }
  };

  const stopSirenAudio = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
  };

  // Toggle SOS function
  const handleToggleSOS = () => {
    const nextState = !isSosAlarmActive;
    setIsSosAlarmActive(nextState);
    localStorage.setItem('rozgaar_sos_active', nextState ? 'true' : 'false');

    if (nextState) {
      setIsHighPriority(true);
      // Generate a dynamic secure locator sharing token
      const token = 'SOS-' + Math.floor(1000 + Math.random() * 9000) + '-DISPATCH';
      setLocationToken(token);
      
      // Store in localStorage for Admin view access
      localStorage.setItem('rozgaar_admin_sos_alert', JSON.stringify({
        active: true,
        token: token,
        lat: gpsCoordinates.lat.toFixed(5),
        lng: gpsCoordinates.lng.toFixed(5),
        priority: 'CRITICAL_DISPATCH',
        timestamp: new Date().toLocaleTimeString()
      }));

      setGpsLogs([`🚨 Critical Alert! SOS broadcast initialized. Token generated: ${token}`]);
      startSirenAudio();
      alert('🚨 EMERGENCY SOS ACTIVATED! Platform Dispatch notified. Siren sound initialized, location coordinates shared in high priority mode.');
    } else {
      stopSirenAudio();
      localStorage.removeItem('rozgaar_admin_sos_alert');
      alert('SOS Cancelled. Returning system status to standard operating mode.');
    }
  };

  // Contacts Handlers
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) {
      alert('Please fill out Name and Phone number fields.');
      return;
    }
    const newContact: Contact = {
      id: 'contact_' + Date.now(),
      name: newContactName,
      relation: newContactRelation || 'Friend',
      phone: newContactPhone
    };
    const updated = [...contacts, newContact];
    saveContactsList(updated);
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    saveContactsList(updated);
  };

  // Ticket Submissions Handler
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDescription) {
      alert('Please provide a short summary title and detailed description.');
      return;
    }
    const newTicket: Ticket = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      category: ticketCategory,
      title: ticketTitle,
      description: ticketDescription,
      priority: ticketPriority,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (!isOnline) {
      const nextQueue = [newTicket, ...offlineQueue];
      setOfflineQueue(nextQueue);
      localStorage.setItem('rozgaar_offline_sync_queue', JSON.stringify(nextQueue));
      
      setTicketTitle('');
      setTicketDescription('');
      localStorage.removeItem('rozgaar_ticket_draft');
      
      alert(`🔌 OFFLINE MODE ACTIVE: Draft Ticket ${newTicket.id} has been safely saved to your local offline queue! It will sync automatically as soon as internet connection is restored.`);
    } else {
      const updated = [newTicket, ...tickets];
      saveTicketsList(updated);
      setTicketTitle('');
      setTicketDescription('');
      localStorage.removeItem('rozgaar_ticket_draft');
      alert(`Success! Complaint Ticket ${newTicket.id} has been created and synced with the Admin Dispute Panel.`);
    }
  };

  // Chatbot Auto-Response logic
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput('');

    // Generate responsive bot comments based on trigger terms
    setTimeout(() => {
      let botText = "I see your message. Let me transfer you to our dedicated support agent or you can submit an official Ticket Complaint directly above.";
      
      if (query.includes('cancellation') || query.includes('strike') || query.includes('cancel')) {
        botText = "RozgaarHub offers a 30-minute free cancellation window upon booking approval. Cancellations outside this grace period trigger a ₹150 penalty and add a strike. If this was a mistake, please file a 'Payment Dispute' ticket above for refund processing.";
      } else if (query.includes('wallet') || query.includes('money') || query.includes('refund')) {
        botText = "Any refund processed by the Admin panel will instantly credit to your Rozgaar Wallet. You can check your dashboard balance at /wallet.";
      } else if (query.includes('sos') || query.includes('emergency') || query.includes('safety')) {
        botText = "If you feel unsafe, click the red SOS button immediately! This broadcasts your live coordinates to our security team and activates premium priority assistance dispatch.";
      } else if (query.includes('electrician') || query.includes('plumber') || query.includes('hire')) {
        botText = "You can search for nearby certified professionals at /search and apply custom experience or rating filters!";
      }

      setChatMessages(prev => [...prev, {
        sender: 'agent',
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
      isSosAlarmActive ? 'bg-red-950/20 dark:bg-red-950/30' : 'bg-gray-50 dark:bg-zinc-950'
    }`}>
      
      {/* SOS Screen Overlay flash */}
      {isSosAlarmActive && (
        <div className="fixed inset-0 pointer-events-none border-[12px] border-red-600/50 animate-pulse z-50"></div>
      )}

      {/* 🔌 OFFLINE SYNC NOTIFICATION TOAST */}
      {syncToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-zinc-900/90 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-indigo-500/50 backdrop-blur-md z-[100] transition-all text-xs font-black tracking-wide animate-bounce flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span>{syncToast}</span>
        </div>
      )}

      {/* Navigation Headers */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          {isSosAlarmActive && <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>}
          <span>Rozgaar Security & Support Hub</span>
        </span>
      </div>

      {/* Network Connection status banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className={`p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 border transition-all ${
          isOnline 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-400'
        }`}>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-ping'}`}></span>
            <span>
              {isOnline 
                ? '🔌 ONLINE: Connected to platform database. Automatic offline sync filters activated.' 
                : '🔌 OFFLINE MODE: Platform unreachable. Support tickets will queue locally in browser cache.'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {offlineQueue.length > 0 && (
              <span className="text-[10px] bg-red-100 text-red-805 font-extrabold px-2.5 py-1 rounded-lg border border-red-200 animate-pulse">
                🚨 {offlineQueue.length} Queued Draft Tickets
              </span>
            )}
            
            <button
              onClick={toggleSimulationNetwork}
              className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl border border-zinc-700 transition-all uppercase tracking-wider"
            >
              {isOnline ? '🔌 Simulate Offline' : '🔌 Reconnect Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: SAFETY CONTROLS DECK (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SOS EMERGENCIES CONTROL BOX */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-zinc-850 pb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>🚨 Safety SOS Command Center</span>
                    {isSosAlarmActive && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-red-500 text-white rounded-md animate-pulse">
                        EMERGENCY LIVE
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Instant platform alert mechanism, live GPS broadcast, and priority siren alarms.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Emergency Priority:</span>
                  <button
                    onClick={() => {
                      setIsHighPriority(!isHighPriority);
                      alert(`Emergency Priority set to: ${!isHighPriority ? 'HIGH PRIORITY DISPATCH' : 'STANDARD'}`);
                    }}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all ${
                      isHighPriority 
                        ? 'bg-amber-600 text-white shadow shadow-amber-500/20' 
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                    }`}
                  >
                    {isHighPriority ? '⚠️ CRITICAL DISPATCH ON' : 'STANDARD'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 items-center">
                
                {/* Circular Glassmorphic SOS Trigger */}
                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={handleToggleSOS}
                    className={`h-40 w-40 rounded-full flex flex-col items-center justify-center font-black tracking-widest text-lg transition-all duration-300 transform active:scale-95 ${
                      isSosAlarmActive
                        ? 'bg-gradient-to-tr from-red-600 to-red-500 text-white ring-8 ring-red-500/30 shadow-2xl shadow-red-500 animate-pulse'
                        : 'bg-gradient-to-tr from-gray-100 to-white hover:from-red-50 dark:from-zinc-800 dark:to-zinc-850 text-red-600 hover:text-red-500 border border-gray-200 dark:border-zinc-700 shadow-lg hover:shadow-red-500/10'
                    }`}
                  >
                    <span className="text-4xl mb-1">{isSosAlarmActive ? '🔔' : '🚨'}</span>
                    <span>{isSosAlarmActive ? 'STOP SOS' : 'PRESS SOS'}</span>
                  </button>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase text-center tracking-wider max-w-[200px]">
                    {isSosAlarmActive ? 'Click to silence sirens and clear alerts.' : 'Triggers police alerts, plays loud sound & coordinates telemetry.'}
                  </p>
                </div>

                {/* Live Location Telemetry sharing */}
                <div className="space-y-4">
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800/80 space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">🛰️ Active GPS Telemetry Broadcast</h4>
                    
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500">Latitude:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{gpsCoordinates.lat.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-500">Longitude:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{gpsCoordinates.lng.toFixed(6)}</span>
                    </div>

                    {isSosAlarmActive && (
                      <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-red-550 block">🔗 SECURE SHAREABLE LOCATION LINK</span>
                        <div className="flex gap-1.5">
                          <input 
                            type="text"
                            readOnly
                            value={`https://rozgaarhub.com/live/${locationToken}`}
                            className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-2 py-1 text-[10px] text-gray-600 dark:text-zinc-300 flex-1 outline-none font-mono"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`https://rozgaarhub.com/live/${locationToken}`);
                              alert('Copied SOS Shareable link to clipboard!');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-2 py-1 rounded-lg font-bold"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Telemetry log outputs */}
                  <div className="h-28 bg-gray-950 text-green-400 p-3.5 rounded-2xl font-mono text-[9px] overflow-y-auto space-y-1.5 shadow-inner">
                    <p className="text-white border-b border-zinc-850 pb-1">📡 Telemetry Stream Output Console:</p>
                    {gpsLogs.length === 0 ? (
                      <p className="text-zinc-500">Waiting for active telemetry trigger stream...</p>
                    ) : (
                      gpsLogs.map((log, idx) => <p key={idx}>{log}</p>)
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* EMERGENCY CONTACTS VAULT SECTION */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">📞 Emergency Contacts Vault</h3>
              <p className="text-xs text-gray-500 mb-6">Store trusted numbers to automatically receive safety alerts and SMS updates during SOS triggers.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Form to add contacts */}
                <form onSubmit={handleAddContact} className="space-y-4">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Add Trusted Contact</span>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Kumar"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs text-gray-950 dark:text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Relation</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Spouse / Brother"
                        value={newContactRelation}
                        onChange={(e) => setNewContactRelation(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs text-gray-955 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. +91 98300 12345"
                        value={newContactPhone}
                        onChange={(e) => setNewContactPhone(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs text-gray-955 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl transition-all"
                  >
                    Register Emergency Contact +
                  </button>
                </form>

                {/* List of active contacts */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Active Contact Registry</span>
                  
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white">{contact.name}</h4>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{contact.relation} | {contact.phone}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert(`Initiating direct audio call with privacy mask to ${contact.phone}...`)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-xs"
                          title="Simulate Masqued Call"
                        >
                          📞
                        </button>
                        {contact.id !== '1' && contact.id !== '2' && (
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-650 p-2 rounded-lg text-xs border border-red-200"
                            title="Remove Contact"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SECTION: SUPPORT SYSTEMS DECK (1 Col) */}
          <div className="space-y-8">
            
            {/* SUPPORT HELPDESK CHAT PORTAL */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-150 dark:border-zinc-800/80 flex flex-col h-[400px]">
              <div className="border-b border-gray-100 dark:border-zinc-850 pb-4 mb-4">
                <h3 className="font-bold text-sm text-gray-905 dark:text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>💬 Live Rozgaar Helpdesk Support</span>
                </h3>
                <p className="text-[10px] text-gray-400">Ask safety protocols, refund policies, or penalty fee information.</p>
              </div>

              {/* Message History area */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
                {chatMessages.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                        isUser 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-gray-400 mt-1 px-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Message inputs */}
              <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-4 border-t border-gray-100 dark:border-zinc-850 mt-4">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask: 'cancellation penalty' or 'safety'..."
                  className="flex-1 bg-gray-50 dark:bg-zinc-950 text-xs rounded-xl border border-gray-300 dark:border-zinc-700 px-3.5 py-2.5 text-gray-900 dark:text-white outline-none"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-bold"
                >
                  Send
                </button>
              </form>
            </div>

            {/* QUICK LINK TO WALLET FOR VERIFICATIONS */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-950 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs">Verify Wallet Transaction Logs</h4>
                <p className="text-[10px] text-indigo-200 mt-0.5">Penalties and processed dispute refunds update instantly.</p>
              </div>
              <Link href="/wallet" className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-all">
                Wallet →
              </Link>
            </div>

            {/* QUICK LINK TO ADMIN DISPUTE SETTLEMENT */}
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-6 border border-gray-200 dark:border-zinc-850 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">Admin dispute desk</h4>
                <p className="text-[10px] text-gray-400">Resolve raised tickets and trigger user refunds.</p>
              </div>
              <Link href="/admin" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-all">
                Admin Console
              </Link>
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: SUPPORT COMPLAINT TICKET LOGGER */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80">
          <div className="border-b border-gray-100 dark:border-zinc-850 pb-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎫 Secure Dispute & Support Ticket Engine</h3>
            <p className="text-xs text-gray-505">File an official complaint or dispute. Platform administrators review tickets with highest priority.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form */}
            <form onSubmit={handleCreateTicket} className="space-y-4 lg:col-span-1">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Submit A New Complaint Ticket</span>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Issue Category</label>
                <select 
                  value={ticketCategory}
                  onChange={(e) => handleUpdateDraft(ticketTitle, ticketDescription, e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs text-gray-955 dark:text-white outline-none"
                >
                  <option value="Payment Dispute">Payment Dispute (Refund Request)</option>
                  <option value="Worker Behaviour">Worker Behaviour Compliance</option>
                  <option value="Damaged Property">Damaged Property / Insurance Claim</option>
                  <option value="App Glitch">App Technical Glitch / OTP Bug</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Priority Tier</label>
                <select 
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs text-gray-955 dark:text-white outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="CRITICAL">🚨 CRITICAL EMERGENCY</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Brief Title / Topic</label>
                <input 
                  type="text"
                  placeholder="e.g. ₹150 cancellation charge refund request"
                  value={ticketTitle}
                  onChange={(e) => handleUpdateDraft(e.target.value, ticketDescription, ticketCategory)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs text-gray-955 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detailed description</label>
                <textarea 
                  rows={3}
                  placeholder="Provide precise details, booking reference ID, or date/time slot..."
                  value={ticketDescription}
                  onChange={(e) => handleUpdateDraft(ticketTitle, e.target.value, ticketCategory)}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs text-gray-955 dark:text-white outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 rounded-xl shadow transition-all"
              >
                File Dispute / Submit Ticket →
              </button>
            </form>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Active Ticket Registry logs</span>
              
              <div className="overflow-x-auto border border-gray-150 dark:border-zinc-800 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 border-b border-gray-200 dark:border-zinc-800">
                    <tr>
                      <th className="px-4 py-3 font-bold">Ticket ID</th>
                      <th className="px-4 py-3 font-bold">Category</th>
                      <th className="px-4 py-3 font-bold">Title</th>
                      <th className="px-4 py-3 font-bold">Priority</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 dark:divide-zinc-850">
                    {tickets.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                          No tickets submitted yet. Fill out the form to file your first complaint.
                        </td>
                      </tr>
                    ) : (
                      tickets.map((tkt) => (
                        <tr key={tkt.id} className="hover:bg-gray-50 dark:hover:bg-zinc-850/50">
                          <td className="px-4 py-3 font-mono font-bold text-indigo-650 dark:text-indigo-400">{tkt.id}</td>
                          <td className="px-4 py-3 text-gray-500">{tkt.category}</td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{tkt.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              tkt.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 animate-pulse' :
                              tkt.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                              tkt.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tkt.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              tkt.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                              tkt.status === 'Under Investigation' ? 'bg-indigo-100 text-indigo-700 animate-pulse' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {tkt.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
