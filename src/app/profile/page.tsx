'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SavedAddress {
  id: string;
  tag: 'Home' | 'Office' | 'Site';
  label: string;
  details: string;
}

interface FavoritePro {
  id: string;
  name: string;
  category: string;
  rating: number;
  experience: string;
}

interface MarketplaceRequirement {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  bidsCount: number;
  activeBids: { workerName: string; bidAmount: string }[];
}

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

interface AnomalyLog {
  id: string;
  type: string;
  severity: 'LOW' | 'ELEVATED' | 'CRITICAL';
  timestamp: string;
  description: string;
}

export default function ProfileOperationsHub() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'weather' | 'rewards' | 'favorites' | 'marketplace' | 'estimator' | 'safety' | 'security' | 'legal'>('profile');

  // SOS & Emergency States
  const [isSosAlarmActive, setIsSosAlarmActive] = useState(false);
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });
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

  // Trust & Risk Engine State
  const [trustScore, setTrustScore] = useState<number>(68);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'ELEVATED' | 'CRITICAL'>('LOW');
  const [kycVerified, setKycVerified] = useState(false);
  const [suspiciousFlags, setSuspiciousFlags] = useState<string[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([
    { id: 'ANM-101', type: 'IP Deviation', severity: 'LOW', timestamp: '2026-05-20 04:12', description: 'User signed in from standard mobile location.' }
  ]);

  // Fraud Chat Scanner Simulator
  const [secChatInput, setSecChatInput] = useState('');
  const [chatAnalysisLogs, setChatAnalysisLogs] = useState<string[]>([]);
  const [isMessageFlagged, setIsMessageFlagged] = useState(false);

  // Fake Account Auditor Details
  const [emailAddress, setEmailAddress] = useState('user.verma@temp-mail.org');
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [profilePhotoStatus, setProfilePhotoStatus] = useState<'Generic Avatar' | 'Face Match Passed'>('Generic Avatar');

  // Account States (Soft Delete)
  const [isSoftDeleted, setIsSoftDeleted] = useState(false);
  const [gracePeriodDays, setGracePeriodDays] = useState(30);

  // Saved Addresses State
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    { id: '1', tag: 'Home', label: 'Rameshwar Villa', details: 'B-402, Shalimar Apartments, Mayur Vihar Phase 1, New Delhi' },
    { id: '2', tag: 'Office', label: 'Noida HQ Office', details: 'Block C-12, Sector 62, Noida, Uttar Pradesh' },
    { id: '3', tag: 'Site', label: 'Commercial Building Site', details: 'Plot 88, Knowledge Park III, Greater Noida, UP' }
  ]);
  const [addressTag, setAddressTag] = useState<'Home' | 'Office' | 'Site'>('Home');
  const [addressLabel, setAddressLabel] = useState('');
  const [addressDetails, setAddressDetails] = useState('');

  // Live Weather Telemetry State (WOW factor scaffolding checks)
  const [weatherCondition, setWeatherCondition] = useState<'Sunny' | 'Rainy' | 'Lightning'>('Sunny');
  const [weatherAlertMsg, setWeatherAlertMsg] = useState('☀️ Weather clear. Outdoor painting and high-altitude operations permitted.');

  // Rewards & Referrals States
  const [rewardPoints, setRewardPoints] = useState(850);
  const [referralCount, setReferralCount] = useState(3);
  const [referralEarnings, setReferralEarnings] = useState(450);

  // Favorites & Rebook States
  const [favorites, setFavorites] = useState<FavoritePro[]>([
    { id: 'fav_1', name: 'Ramesh Kumar', category: 'Electrician', rating: 4.9, experience: '8 Years' },
    { id: 'fav_2', name: 'Anil Gupta', category: 'Plumber', rating: 4.8, experience: '5 Years' },
    { id: 'fav_3', name: 'Sunil Paswan', category: 'Carpenter', rating: 4.7, experience: '12 Years' }
  ]);

  // Requirement Marketplace States
  const [marketplacePosts, setMarketplacePosts] = useState<MarketplaceRequirement[]>([
    {
      id: 'REQ-401',
      title: 'Monsoon waterproofing of commercial rooftop',
      category: 'Plumber',
      description: 'Require comprehensive waterproofing and crack injection sealing for a 2000 sq ft concrete rooftop before rainy weather peaks.',
      budget: '₹12,500',
      bidsCount: 2,
      activeBids: [
        { workerName: 'Anil Gupta', bidAmount: '₹11,800' },
        { workerName: 'Vikram Singh', bidAmount: '₹12,200' }
      ]
    },
    {
      id: 'REQ-402',
      title: 'Full house rewiring for new residential office',
      category: 'Electrician',
      description: 'Need modern wiring setup, circuit breaker replacements, and modular switches fitting across 4 rooms.',
      budget: '₹8,000',
      bidsCount: 1,
      activeBids: [
        { workerName: 'Ramesh Kumar', bidAmount: '₹7,500' }
      ]
    }
  ]);
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqCategory, setNewReqCategory] = useState('Electrician');
  const [newReqDesc, setNewReqDesc] = useState('');
  const [newReqBudget, setNewReqBudget] = useState('');

  // Sophisticated Price Estimator Pro States
  const [estCategory, setEstCategory] = useState('Electrician');
  const [estHours, setEstHours] = useState('4');
  const [estExpRequired, setEstExpRequired] = useState<'Standard' | 'Premium Pro'>('Standard');
  const [estWeatherSurcharge, setEstWeatherSurcharge] = useState(false);

  // Active Legal Document state
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | 'refund' | 'about' | 'contact'>('privacy');

  // Load persistence configurations for Safety & Security
  useEffect(() => {
    const savedAddresses = localStorage.getItem('rozgaar_addresses');
    if (savedAddresses) {
      try { setAddresses(JSON.parse(savedAddresses)); } catch (e) { console.error(e); }
    }

    const savedFavs = localStorage.getItem('rozgaar_favorites');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }

    const savedMarketplace = localStorage.getItem('rozgaar_marketplace_reqs');
    if (savedMarketplace) {
      try { setMarketplacePosts(JSON.parse(savedMarketplace)); } catch (e) { console.error(e); }
    }

    const savedSoftDelete = localStorage.getItem('rozgaar_soft_delete');
    if (savedSoftDelete === 'true') {
      setIsSoftDeleted(true);
    }

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

      const savedSecProfile = localStorage.getItem('rozgaar_security_profile');
      if (savedSecProfile) {
        try {
          const data = JSON.parse(savedSecProfile);
          setTrustScore(data.trustScore || 68);
          setRiskLevel(data.riskLevel || 'LOW');
          setKycVerified(data.kycVerified || false);
          setSuspiciousFlags(data.suspiciousFlags || []);
          setAnomalies(data.anomalies || []);
          setEmailAddress(data.emailAddress || 'user.verma@temp-mail.org');
          setProfilePhotoStatus(data.profilePhotoStatus || 'Generic Avatar');
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
            const merged = [...queued, ...parsedCurrent];
            setTickets(merged);
            localStorage.setItem('rozgaar_tickets', JSON.stringify(merged));
            
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

  // Simulated GPS tracker updates during SOS
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSosAlarmActive) {
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

  // Audio Siren Synthesis using Web Audio API
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

      let timeCount = 0;
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        const frequency = 600 + Math.sin(timeCount) * 400;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        
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

  const handleToggleSOS = () => {
    const nextState = !isSosAlarmActive;
    setIsSosAlarmActive(nextState);
    localStorage.setItem('rozgaar_sos_active', nextState ? 'true' : 'false');

    if (nextState) {
      setIsHighPriority(true);
      const token = 'SOS-' + Math.floor(1000 + Math.random() * 9000) + '-DISPATCH';
      setLocationToken(token);
      
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

  // AI Security Shield functions
  const updateSecurityState = (
    score: number,
    risk: 'LOW' | 'ELEVATED' | 'CRITICAL',
    kyc: boolean,
    flags: string[],
    logs: AnomalyLog[],
    email: string,
    photoStatus: 'Generic Avatar' | 'Face Match Passed'
  ) => {
    setTrustScore(score);
    setRiskLevel(risk);
    setKycVerified(kyc);
    setSuspiciousFlags(flags);
    setAnomalies(logs);
    setEmailAddress(email);
    setProfilePhotoStatus(photoStatus);

    localStorage.setItem('rozgaar_security_profile', JSON.stringify({
      trustScore: score,
      riskLevel: risk,
      kycVerified: kyc,
      suspiciousFlags: flags,
      anomalies: logs,
      emailAddress: email,
      profilePhotoStatus: photoStatus
    }));

    localStorage.setItem('rozgaar_admin_security_alert', JSON.stringify({
      score,
      risk,
      flags,
      kyc,
      timestamp: new Date().toLocaleTimeString(),
      email
    }));
  };

  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert('🔒 Secured Upload Channel active! Scanning Government signature metadata, validating Aadhaar biometric signature hashes...');
      
      setTimeout(() => {
        const newLogs = [
          { id: 'ANM-' + Math.floor(100 + Math.random() * 900), type: 'Aadhaar Biometric Checked', severity: 'LOW' as const, timestamp: 'Just now', description: 'KYC verified successfully against government vault.' },
          ...anomalies
        ];
        
        const newFlags = suspiciousFlags.filter(f => f !== 'Disposable Domain Blocked');
        
        updateSecurityState(
          100,
          'LOW',
          true,
          newFlags,
          newLogs,
          'user.verma@gmail.com',
          'Face Match Passed'
        );
        alert('🎉 Aadhaar KYC Verified! Trust score set to 100/100. Verification Crown badge awarded.');
      }, 1500);
    }
  };

  const handleChatTextChange = (text: string) => {
    setSecChatInput(text);
    const query = text.toLowerCase();
    const flaggedWords: string[] = [];
    let isFlagged = false;

    if (query.includes('otp') || query.includes('one time password') || query.includes('code')) {
      flaggedWords.push('OTP Account Hijacking Attempt');
      isFlagged = true;
    }
    if (query.includes('offline') || query.includes('direct payment') || query.includes('advance cash')) {
      flaggedWords.push('Offline Bypass Payment Risk');
      isFlagged = true;
    }
    if (query.includes('upi.org') || query.includes('upipayout') || query.includes('http://') || query.includes('.com/')) {
      flaggedWords.push('Malicious/Phishing Link Sharing');
      isFlagged = true;
    }

    setIsMessageFlagged(isFlagged);
    setChatAnalysisLogs(flaggedWords);
  };

  const triggerBookingSpike = () => {
    alert('⚡ Simulating bot pattern: Triggering 5 booking requests in 2 seconds across duplicate categories...');
    
    setTimeout(() => {
      const nextLogs = [
        { id: 'ANM-402', type: 'Rapid Booking Spike', severity: 'CRITICAL' as const, timestamp: 'Just now', description: '5 bookings/2s exceeded max frequency throttle.' },
        ...anomalies
      ];
      
      const newFlags = Array.from(new Set([...suspiciousFlags, 'High-Frequency Bot Booking Pattern']));
      
      updateSecurityState(
        34,
        'CRITICAL',
        kycVerified,
        newFlags,
        nextLogs,
        emailAddress,
        profilePhotoStatus
      );

      alert('🚨 RISK INDEX EXCALATED! Trust Score reduced to 34. Account flagged for booking rate limitation in Admin dashboard.');
    }, 800);
  };

  const triggerCashDeviation = () => {
    alert('📍 Simulating IP spoof anomaly: Booking request submitted via VPN originating from high-risk IP block (location delta > 1200km)...');
    
    setTimeout(() => {
      const nextLogs = [
        { id: 'ANM-508', type: 'Out-of-Area Deviation', severity: 'ELEVATED' as const, timestamp: 'Just now', description: 'Booking requested in cash from remote location range deviation.' },
        ...anomalies
      ];
      
      const newFlags = Array.from(new Set([...suspiciousFlags, 'Geographic IP Distance Mismatch']));
      
      updateSecurityState(
        50,
        'ELEVATED',
        kycVerified,
        newFlags,
        nextLogs,
        emailAddress,
        profilePhotoStatus
      );
      
      alert('⚠️ ELEVATED RISK ALERT! Profile set to Elevated standing. Check Admin Dashboard notifications.');
    }, 800);
  };

  const resetAnomalyScore = () => {
    updateSecurityState(68, 'LOW', false, [], [
      { id: 'ANM-101', type: 'Telemetry Checked', severity: 'LOW', timestamp: 'Just now', description: 'Reset parameters. Clean profile audits verified.' }
    ], 'user.verma@temp-mail.org', 'Generic Avatar');
    alert('🛡️ Security metrics reset to baseline level.');
  };

  const getScrubbedText = () => {
    let text = secChatInput;
    const targets = ['otp', 'offline', 'advance cash', 'upipayout', 'upi.org'];
    targets.forEach(word => {
      const regex = new RegExp(word, 'gi');
      text = text.replace(regex, '****[FLAGGED FRUAD/SPAM WORD]****');
    });
    return text;
  };

  // Soft Delete Action Simulators
  const handleTriggerSoftDelete = () => {
    setIsSoftDeleted(true);
    localStorage.setItem('rozgaar_soft_delete', 'true');
    alert('⚠️ SOFT ACCOUNT DELETION SCHEDULED! Your account is now disabled and placed in a 30-day grace recovery queue. All credentials will soft-persist for recovery.');
  };

  const handleRestoreAccount = () => {
    setIsSoftDeleted(false);
    localStorage.removeItem('rozgaar_soft_delete');
    alert('🎉 WELCOME BACK! Your RozgaarHub account profile has been fully restored from the grace deactivation queue successfully.');
  };

  // Weather telemetry modulation triggers
  const handleToggleWeather = (condition: 'Sunny' | 'Rainy' | 'Lightning') => {
    setWeatherCondition(condition);
    if (condition === 'Sunny') {
      setWeatherAlertMsg('☀️ Weather clear. Outdoor painting and high-altitude operations permitted.');
    } else if (condition === 'Rainy') {
      setWeatherAlertMsg('🌧️ WARNING: Active rain. Scaffolding painting and outdoor welding restricted. Safety locks triggered.');
    } else {
      setWeatherAlertMsg('⛈️ EMERGENCY CRITICAL ALERT: Lightning storm active. Total outdoor site operations suspended automatically.');
    }
  };

  // Address Handlers
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLabel || !addressDetails) {
      alert('Please specify an Address Tag name and precise details.');
      return;
    }
    const newAddress: SavedAddress = {
      id: 'addr_' + Date.now(),
      tag: addressTag,
      label: addressLabel,
      details: addressDetails
    };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem('rozgaar_addresses', JSON.stringify(updated));
    setAddressLabel('');
    setAddressDetails('');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('rozgaar_addresses', JSON.stringify(updated));
  };

  // Rebooking Trigger
  const handleRebookPro = (proName: string, category: string) => {
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    alert(`⚡ REBOOK COMPLETED! Instant dispatcher booked: ${proName} (${category}) has been successfully assigned to booking ${bookingId}. OTP milestones sent!`);
  };

  // Marketplace handler
  const handlePostRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqTitle || !newReqDesc || !newReqBudget) {
      alert('Please complete all requirement fields.');
      return;
    }
    const newReq: MarketplaceRequirement = {
      id: 'REQ-' + Math.floor(400 + Math.random() * 100),
      title: newReqTitle,
      category: newReqCategory,
      description: newReqDesc,
      budget: '₹' + newReqBudget.replace('₹', ''),
      bidsCount: 0,
      activeBids: []
    };
    const updated = [newReq, ...marketplacePosts];
    setMarketplacePosts(updated);
    localStorage.setItem('rozgaar_marketplace_reqs', JSON.stringify(updated));
    setNewReqTitle('');
    setNewReqDesc('');
    setNewReqBudget('');
    alert(`🎉 Marketplace Success! Requirement ${newReq.id} has been posted to our local partner database. Bids will arrive shortly.`);
  };

  const simulateWorkerBid = (reqId: string) => {
    const names = ['Ramesh Kumar', 'Anil Gupta', 'Vikram Singh', 'Sunil Paswan'];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const bidVal = '₹' + (Math.floor(5000 + Math.random() * 5000));

    const updated = marketplacePosts.map(post => {
      if (post.id === reqId) {
        return {
          ...post,
          bidsCount: post.bidsCount + 1,
          activeBids: [...post.activeBids, { workerName: selectedName, bidAmount: bidVal }]
        };
      }
      return post;
    });
    setMarketplacePosts(updated);
    localStorage.setItem('rozgaar_marketplace_reqs', JSON.stringify(updated));
    alert(`💡 New Bid Arrived! Partner ${selectedName} bid ${bidVal} for requirement ${reqId}.`);
  };

  // Price Estimator Math
  const getProEstimation = () => {
    const baseRates: Record<string, number> = {
      Electrician: 200,
      Plumber: 250,
      Carpenter: 220,
      Painter: 180,
      Cleaner: 150
    };
    const rate = baseRates[estCategory] || 180;
    let cost = rate * Number(estHours);
    
    if (estExpRequired === 'Premium Pro') {
      cost += 100 * Number(estHours); // Premium multiplier
    }
    if (estWeatherSurcharge) {
      cost += 200; // Weather hazard surcharge
    }

    const platformFee = 49;
    const taxes = Math.round((cost + platformFee) * 0.18);
    const total = cost + platformFee + taxes;

    return {
      basePay: cost,
      platformFee,
      taxes,
      total
    };
  };

  const estResult = getProEstimation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      
      {/* Soft Delete Account lockout Overlay simulation */}
      {isSoftDeleted && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-500/50 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl animate-pulse">
            <span className="text-6xl block">⚠️</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Account Suspended</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your RozgaarHub profile has been placed in the <strong>Soft Delete Grace Queue ({gracePeriodDays} days remaining)</strong>. 
              All data has been safely preserved. You can restore your profile status immediately or wait for permanent database purging.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={handleRestoreAccount}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-4.5 rounded-xl transition-all shadow-lg"
              >
                🎉 Restore Account Instantly
              </button>
              <Link href="/" className="text-zinc-500 hover:underline text-xs block">
                Return to homepage (Read-only mode)
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Headers */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Rozgaar operations & Legal Console
        </span>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDE: Side Navigation Selector Deck */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Ecosystem Console</h3>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'profile' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                👤 Profile Settings & Purges
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'addresses' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                🏠 Address Book (Tagging)
              </button>

              <button
                onClick={() => setActiveTab('weather')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'weather' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                🌦️ Weather Warnings Safety
              </button>

              <button
                onClick={() => setActiveTab('rewards')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'rewards' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                🎟️ Referrals & Rewards
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'favorites' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                ❤️ Favorites & Quick Rebook
              </button>

              <button
                onClick={() => setActiveTab('marketplace')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'marketplace' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                🏗️ Requirement Marketplace
              </button>

              <button
                onClick={() => setActiveTab('estimator')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'estimator' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                💰 Price Estimator Pro
              </button>

              <button
                onClick={() => setActiveTab('safety')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'safety' ? 'bg-red-650 text-white shadow shadow-red-500/20' : 'bg-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10'
                }`}
              >
                🚨 Safety Support & SOS
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'security' ? 'bg-emerald-600 text-white shadow shadow-emerald-500/20' : 'bg-transparent text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/10'
                }`}
              >
                🛡️ AI Security Shield
              </button>

              <button
                onClick={() => setActiveTab('legal')}
                className={`w-full text-left font-bold text-xs px-4 py-3.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  activeTab === 'legal' ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20' : 'bg-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                📑 Legal & Compliance Pages
              </button>

            </div>
          </div>

          {/* RIGHT SIDE: Dedicated workspace based on active Tab selection */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* TAB 1: PROFILE SETTINGS & SOFT DELETE */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">👤 Profile Settings</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage user credentials, security status, and account deactivation keys.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name</label>
                    <input type="text" readOnly value="Vijayasha Yadav" className="w-full rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 px-4 py-3 text-xs font-bold outline-none text-gray-650" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email Address</label>
                    <input type="text" readOnly value="vijayasha.yadav@gmail.com" className="w-full rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-800 px-4 py-3 text-xs font-bold outline-none text-gray-650" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 flex justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">🖥️ Multi-Device Session Sync</h4>
                    <p className="text-[10px] text-gray-400">Simulates real-time synchronization of bookings/chat status across tablets, iOS apps, and desktops.</p>
                  </div>
                  <button onClick={() => alert('🔄 Sync complete! Verified token across all device hubs successfully.')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all">
                    Sync Now
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-150 dark:border-zinc-850 space-y-4">
                  <h3 className="text-xs font-extrabold text-red-650 uppercase tracking-widest">⚠️ Danger Zone</h3>
                  <div className="p-6 rounded-2xl border border-red-200 bg-red-500/5 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-red-750 dark:text-red-400">Soft Deactivate Account</h4>
                      <p className="text-[10px] text-zinc-500 max-w-md">Deactivate account and place in the 30-day grace recovery queue. Your wallet balance, reviews, and bookings are safely preserved for recovery.</p>
                    </div>
                    <button 
                      onClick={handleTriggerSoftDelete}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-4 py-2.5 rounded-xl transition-all shadow-md"
                    >
                      Soft Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SAVED ADDRESS BOOK (Home/Office/Site) */}
            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">🏠 Address Book tagging</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage and tag locations categorized under Home, Office, or specific Site coordinates.</p>
                </div>

                <form onSubmit={handleSaveAddress} className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 space-y-4">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Add New Tagged Location</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tag Category</label>
                      <select 
                        value={addressTag}
                        onChange={(e) => setAddressTag(e.target.value as any)}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none"
                      >
                        <option value="Home">🏠 Home Address</option>
                        <option value="Office">🏢 Office Address</option>
                        <option value="Site">🏗️ Construction Site</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Custom Label Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Noida flat or Metro Project Site"
                        value={addressLabel}
                        onChange={(e) => setAddressLabel(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Detailed Address / GPS landmarks</label>
                    <textarea 
                      rows={2}
                      placeholder="Street address, block number, landmark..."
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none"
                    />
                  </div>

                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow">
                    Register Address +
                  </button>
                </form>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Active Tagged Address registries</span>
                  {addresses.map(addr => (
                    <div key={addr.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 flex justify-between items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            addr.tag === 'Home' ? 'bg-blue-100 text-blue-800' :
                            addr.tag === 'Office' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {addr.tag === 'Home' ? '🏠 Home' : addr.tag === 'Office' ? '🏢 Office' : '🏗️ Site'}
                          </span>
                          <span className="font-extrabold text-xs text-gray-900 dark:text-white">{addr.label}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1 max-w-xl">{addr.details}</p>
                      </div>

                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-655 p-2 rounded-lg border border-red-200 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SCAFFOLDING WEATHER WARNING ALERTS */}
            {activeTab === 'weather' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">🌦️ Weather Warning Safety Center</h2>
                  <p className="text-xs text-gray-505">Smart platform sensors block outdoor/scaffolding painter operations during rains or storms.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(['Sunny', 'Rainy', 'Lightning'] as const).map(cond => (
                    <button
                      key={cond}
                      onClick={() => handleToggleWeather(cond)}
                      className={`py-4 rounded-2xl font-bold text-xs transition-all border flex flex-col items-center justify-center gap-2 ${
                        weatherCondition === cond
                          ? 'bg-indigo-650 text-white shadow shadow-indigo-500/20 border-indigo-600'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-gray-250 dark:border-zinc-850 text-gray-500'
                      }`}
                    >
                      <span className="text-2xl">{cond === 'Sunny' ? '☀️' : cond === 'Rainy' ? '🌧️' : '⛈️'}</span>
                      <span>{cond === 'Sunny' ? 'Sunny Condition' : cond === 'Rainy' ? 'Heavy Monsoon Rain' : 'Lightning Alert'}</span>
                    </button>
                  ))}
                </div>

                <div className={`p-6 rounded-2xl border transition-all ${
                  weatherCondition === 'Sunny' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-400' :
                  weatherCondition === 'Rainy' ? 'bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-400' :
                  'bg-red-500/10 border-red-500/25 text-red-800 dark:text-red-400 animate-pulse'
                }`}>
                  <h4 className="font-extrabold text-sm mb-1">🛰️ Automated Safety Compliance Stream:</h4>
                  <p className="text-xs font-semibold leading-relaxed">{weatherAlertMsg}</p>
                  
                  {weatherCondition !== 'Sunny' && (
                    <span className="inline-block mt-3 text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded">
                      🛡️ Outdoor Scaffolding Locked
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: REFERRAL & REWARDS DASHBOARD */}
            {activeTab === 'rewards' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">🎟️ Referral & Rewards dashboard</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Collect Rozgaar Points on bookings and share referral coupon codes to earn cashback rewards.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Rewards point widget */}
                  <div className="bg-gradient-to-tr from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-indigo-950 flex flex-col justify-between min-h-[160px]">
                    <div>
                      <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block">Rewards Balance</span>
                      <span className="text-4xl font-black mt-2 block">{rewardPoints} pts</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-indigo-950 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-[9px] text-indigo-300 font-bold">150 pts till next discount coupon lock</span>
                    </div>
                  </div>

                  {/* Referral count widget */}
                  <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-850 rounded-3xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Referred partners</span>
                      <span className="text-4xl font-black mt-2 text-gray-900 dark:text-white block">{referralCount} Users</span>
                    </div>
                    <span className="text-[9px] text-indigo-650 dark:text-indigo-400 font-bold">Earned ₹150 flat per successful signup</span>
                  </div>

                  {/* Referral Earnings widget */}
                  <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-850 rounded-3xl p-6 flex flex-col justify-between min-h-[160px]">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Total Commission Cashbacks</span>
                      <span className="text-4xl font-black mt-2 text-emerald-600 dark:text-emerald-400 block">₹{referralEarnings}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setReferralEarnings(0);
                        alert('🎉 Cashbacks successfully transferred to your main wallet balance!');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 rounded-xl"
                    >
                      Redeem to Wallet
                    </button>
                  </div>

                </div>

                <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-gray-250 dark:border-zinc-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">🔗 Share Your Referral Coupon Code</h4>
                    <p className="text-[10px] text-gray-400">Share this code with friends. They get 10% discount, you get flat ₹150 wallet payout.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2 text-xs font-mono font-black text-gray-800 dark:text-white tracking-widest">
                      ROZGAAR-REF-7701
                    </span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('ROZGAAR-REF-7701');
                        alert('Referral code copied to clipboard!');
                      }} 
                      className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow"
                    >
                      Copy
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: FAVORITES & QUICK REBOOKING */}
            {activeTab === 'favorites' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">❤️ Favorites & Rebook Deck</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Quickly dispatch your favorite verified professionals on demand with one click.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map(fav => (
                    <div key={fav.id} className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-850 flex justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-widest block uppercase">{fav.category}</span>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">{fav.name}</h4>
                        <div className="flex gap-2 mt-1.5 text-[10px] text-gray-400 font-semibold">
                          <span>⭐ {fav.rating} Rating</span>
                          <span>•</span>
                          <span>{fav.experience} Exp</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleRebookPro(fav.name, fav.category)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-all shadow"
                        >
                          ⚡ REBOOK NOW
                        </button>
                        <button
                          onClick={() => {
                            const updated = favorites.filter(f => f.id !== fav.id);
                            setFavorites(updated);
                            localStorage.setItem('rozgaar_favorites', JSON.stringify(updated));
                          }}
                          className="text-red-500 hover:underline text-[9px] font-bold text-center"
                        >
                          Remove Fav
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: REQUIREMENT MARKETPLACE (Post Customized job offers) */}
            {activeTab === 'marketplace' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">🏗️ Requirement Marketplace</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Post specialized daily task requirements where nearby workers and contractors submit custom bidding rates.</p>
                </div>

                <form onSubmit={handlePostRequirement} className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-gray-200 dark:border-zinc-850 space-y-4">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Post customized job requirement</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Requirement Heading</label>
                      <input 
                        type="text"
                        placeholder="e.g. Need 4 carpenters to design kitchen wood cabinets"
                        value={newReqTitle}
                        onChange={(e) => setNewReqTitle(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category & Pay Cap</label>
                      <div className="flex gap-1.5">
                        <select 
                          value={newReqCategory}
                          onChange={(e) => setNewReqCategory(e.target.value)}
                          className="rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-2 py-2.5 text-[10px] outline-none flex-1"
                        >
                          <option value="Electrician">Electrician</option>
                          <option value="Plumber">Plumber</option>
                          <option value="Carpenter">Carpenter</option>
                          <option value="Painter">Painter</option>
                        </select>
                        <input 
                          type="text"
                          placeholder="Budget cap ₹"
                          value={newReqBudget}
                          onChange={(e) => setNewReqBudget(e.target.value)}
                          className="rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-2 py-2.5 text-[10px] w-20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Specific details of custom milestones</label>
                    <textarea 
                      rows={2}
                      placeholder="Describe wood thickness, materials, timelines, security requirements..."
                      value={newReqDesc}
                      onChange={(e) => setNewReqDesc(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-2.5 text-xs outline-none"
                    />
                  </div>

                  <button type="submit" className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow">
                    Post to Marketplace +
                  </button>
                </form>

                <div className="space-y-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Active Marketplace requirements logs</span>
                  
                  {marketplacePosts.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center">No active requirements posted yet.</p>
                  ) : (
                    marketplacePosts.map(post => (
                      <div key={post.id} className="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-250 dark:border-zinc-850 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] bg-indigo-100 text-indigo-805 px-2 py-0.5 rounded font-black tracking-widest block uppercase w-fit">{post.category}</span>
                            <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1">{post.title}</h4>
                            <p className="text-[10px] text-zinc-500 mt-1">{post.description}</p>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <span className="text-xs font-mono font-black text-gray-900 dark:text-white block">{post.budget} Max</span>
                            <button
                              onClick={() => simulateWorkerBid(post.id)}
                              className="text-[9px] font-bold bg-zinc-800 hover:bg-zinc-900 text-white px-2.5 py-1 rounded-lg"
                            >
                              ⚡ Simulate Bid
                            </button>
                          </div>
                        </div>

                        {post.activeBids.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-zinc-850 pt-3 space-y-2">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block font-bold">Partner Bids Submitted:</span>
                            {post.activeBids.map((bid, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-gray-150 dark:border-zinc-800/80 text-[10px]">
                                <span className="font-bold text-gray-700 dark:text-zinc-300">👤 {bid.workerName}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-indigo-650 dark:text-indigo-400">{bid.bidAmount}</span>
                                  <button
                                    onClick={() => alert(`🎉 Contract assigned! Partner ${bid.workerName} has been assigned to job requirement ${post.id} at the rate of ${bid.bidAmount}.`)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] px-2 py-1 rounded"
                                  >
                                    Accept Bid
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 7: PRICE ESTIMATOR PRO CALCULATOR */}
            {activeTab === 'estimator' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">💰 Smart Price Estimator Pro</h2>
                  <p className="text-xs text-gray-505">Calculate highly granular labour costs based on market rates, experience tiers, and weather conditions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Labour Category</label>
                      <select 
                        value={estCategory}
                        onChange={(e) => setEstCategory(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs outline-none"
                      >
                        <option value="Electrician">Electrician (Market rate ₹200/hr)</option>
                        <option value="Plumber">Plumber (Market rate ₹250/hr)</option>
                        <option value="Carpenter">Carpenter (Market rate ₹220/hr)</option>
                        <option value="Painter">Painter (Market rate ₹180/hr)</option>
                        <option value="Cleaner">Cleaner (Market rate ₹150/hr)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Duration (Hours)</label>
                        <input 
                          type="number"
                          value={estHours}
                          onChange={(e) => setEstHours(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Experience Level Required</label>
                        <select 
                          value={estExpRequired}
                          onChange={(e) => setEstExpRequired(e.target.value as any)}
                          className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs outline-none"
                        >
                          <option value="Standard">Standard (+₹0/hr)</option>
                          <option value="Premium Pro">Certified Pro (+₹100/hr)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-gray-250 dark:border-zinc-850">
                      <input 
                        type="checkbox"
                        checked={estWeatherSurcharge}
                        onChange={(e) => setEstWeatherSurcharge(e.target.checked)}
                        className="h-4 w-4 text-indigo-650 rounded border-gray-300"
                      />
                      <div>
                        <h4 className="font-bold text-[10px] text-gray-900 dark:text-white">Apply Active Monsoon Surcharge</h4>
                        <p className="text-[8px] text-gray-400">Adds flat ₹200 hazard payout for workers tackling wet scaffoldings.</p>
                      </div>
                    </div>
                  </div>

                  {/* Split calculator ledger layout */}
                  <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-6 border border-gray-250 dark:border-zinc-850 space-y-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Detailed Cost Estimation</span>
                    
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-500">Base Worker Payout ({estHours} hrs):</span>
                      <span className="text-gray-900 dark:text-white font-mono">₹{estResult.basePay}</span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-500">Rozgaar Platform Surcharge:</span>
                      <span className="text-gray-900 dark:text-white font-mono">₹{estResult.platformFee}</span>
                    </div>

                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-500">Estimated Taxes (18% GST):</span>
                      <span className="text-gray-900 dark:text-white font-mono">₹{estResult.taxes}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-250 dark:border-zinc-800 flex justify-between items-center text-sm font-black">
                      <span className="text-indigo-650 dark:text-indigo-400 uppercase">Estimated Total:</span>
                      <span className="text-2xl text-gray-950 dark:text-white font-mono">₹{estResult.total}</span>
                    </div>

                    <button 
                      onClick={() => alert(`🎉 Cost Locked! Payout estimation ₹${estResult.total} confirmed. Ready to deploy booking.`)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow"
                    >
                      Lock In Estimation & Book →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: SAFETY & EMERGENCY SOS SUPPORT */}
            {activeTab === 'safety' && (
              <div className="space-y-8">
                
                {/* SOS COMMAND CENTER CARD */}
                <div className="bg-red-50 dark:bg-red-950/20 rounded-3xl p-8 border border-red-200 dark:border-red-900/30 shadow-xl space-y-6">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black text-red-700 dark:text-red-400 uppercase tracking-tight flex items-center gap-2">
                        🚨 SOS Emergency Command Center
                      </h2>
                      <p className="text-xs text-red-650/80">Activate in high-risk physical situations to broadcast live location coordinates & call emergency services.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleSimulationNetwork}
                        className={`text-[10px] font-black px-3.5 py-2.5 rounded-xl border transition-all ${
                          isOnline 
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-250 hover:bg-yellow-100 animate-pulse'
                        }`}
                      >
                        {isOnline ? '🟢 Live Network Active' : '🟡 Simulated Offline Mode'}
                      </button>
                    </div>
                  </div>

                  {syncToast && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-xs font-bold animate-bounce">
                      {syncToast}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-red-100 dark:border-zinc-800 flex flex-col justify-center items-center text-center space-y-4">
                      <button
                        onClick={handleToggleSOS}
                        className={`h-28 w-28 rounded-full font-black text-white text-lg flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                          isSosAlarmActive 
                            ? 'bg-red-600 animate-ping'
                            : 'bg-red-550 hover:bg-red-600 hover:shadow-red-500/20'
                        }`}
                      >
                        {isSosAlarmActive ? 'CANCEL SOS' : 'TRIGGER SOS'}
                      </button>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Emergency Siren Audio</p>
                        <p className="text-[10px] text-gray-400">Generates 120dB warning oscillator on active speakers.</p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-red-100 dark:border-zinc-800 space-y-4 col-span-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Live Coordinates Telemetry</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-150">
                          <span className="text-[10px] text-gray-450 uppercase block font-bold">Latitude Coordinates</span>
                          <span className="font-mono text-sm font-bold text-gray-955 dark:text-white">{gpsCoordinates.lat.toFixed(5)}</span>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-150">
                          <span className="text-[10px] text-gray-450 uppercase block font-bold">Longitude Coordinates</span>
                          <span className="font-mono text-sm font-bold text-gray-955 dark:text-white">{gpsCoordinates.lng.toFixed(5)}</span>
                        </div>
                      </div>

                      <div className="bg-red-955/5 dark:bg-red-955/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 space-y-1">
                        <span className="text-[10px] text-red-600 dark:text-red-400 uppercase font-black tracking-wider block">Security Action Log</span>
                        <div className="font-mono text-[10px] text-red-700 dark:text-red-300 space-y-1 max-h-[80px] overflow-y-auto">
                          {gpsLogs.length > 0 ? (
                            gpsLogs.map((log, i) => <p key={i}>{log}</p>)
                          ) : (
                            <p className="text-gray-400">No active sirens triggered. System running in standard standby sentinel.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRUSTED CONTACTS MANAGER */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-150 dark:border-zinc-800/80 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">📞 Trusted Contacts Vault</h3>
                    <p className="text-xs text-gray-505">Your trusted family members, friends, or platform support dispatcher contacts to call during emergency dispatches.</p>
                  </div>

                  <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Contact Name"
                      required
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3 border border-gray-250 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Relation (e.g. Brother, Mother)"
                      value={newContactRelation}
                      onChange={(e) => setNewContactRelation(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3 border border-gray-250 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3 border border-gray-250 dark:border-zinc-800 text-xs font-medium text-gray-900 dark:text-white outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-900 hover:bg-zinc-850 text-white font-extrabold text-xs rounded-xl py-3 transition-colors uppercase"
                    >
                      + Save Contact
                    </button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contacts.map(c => (
                      <div key={c.id} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-200 dark:border-zinc-850">
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                            👤 {c.name}
                            <span className="text-[9px] px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 rounded-full font-bold uppercase">
                              {c.relation}
                            </span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">Phone: {c.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${c.phone}`}
                            className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 p-2.5 rounded-xl border border-green-100 dark:border-green-900/30 hover:bg-green-100 text-xs"
                          >
                            📞 Call
                          </a>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400 p-2.5 rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 text-xs"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COMPLAINTS & TICKETS LOG */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-150 dark:border-zinc-800/80 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">🎫 Dispute Tickets & Complaints Center</h3>
                    <p className="text-xs text-gray-505">Submit disputes, late cancellation warnings, or safety feedback. Fully operates in offline network environments.</p>
                  </div>

                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Ticket Category</label>
                        <select
                          value={ticketCategory}
                          onChange={(e) => handleUpdateDraft(ticketTitle, ticketDescription, e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3.5 border border-gray-250 dark:border-zinc-800 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                        >
                          <option value="Payment Dispute">Payment Dispute</option>
                          <option value="Worker Behaviour">Worker Behaviour</option>
                          <option value="Safety Gear Violation">Safety Gear Violation</option>
                          <option value="Cancellation Grievance">Cancellation Grievance</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Complaint Summary</label>
                        <input
                          type="text"
                          placeholder="Brief summary of dispute (e.g. cancellation warning strike dispute)"
                          required
                          value={ticketTitle}
                          onChange={(e) => handleUpdateDraft(e.target.value, ticketDescription, ticketCategory)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3.5 border border-gray-250 dark:border-zinc-800 text-xs font-semibold text-gray-900 dark:text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Detailed Description</label>
                      <textarea
                        rows={3}
                        placeholder="Explain coordinates deviations, welder cancellation arguments, or security disputes clearly..."
                        required
                        value={ticketDescription}
                        onChange={(e) => handleUpdateDraft(ticketTitle, e.target.value, ticketCategory)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3.5 border border-gray-250 dark:border-zinc-800 text-xs font-semibold text-gray-900 dark:text-white outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-gray-450 uppercase block mb-1">Priority Level</span>
                        <div className="flex gap-2">
                          {(['Low', 'Medium', 'High', 'CRITICAL'] as const).map(prio => (
                            <button
                              key={prio}
                              type="button"
                              onClick={() => setTicketPriority(prio)}
                              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all ${
                                ticketPriority === prio
                                  ? 'bg-zinc-900 text-white border-zinc-900'
                                  : 'bg-zinc-50 border-gray-200 text-gray-500 hover:text-gray-955'
                              }`}
                            >
                              {prio}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow uppercase"
                      >
                        {isOnline ? 'Submit Live Ticket' : 'Save Draft Offline'}
                      </button>
                    </div>
                  </form>

                  {/* OFFLINE QUEUE WARNING */}
                  {offlineQueue.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 p-5 rounded-2xl space-y-2">
                      <p className="text-xs font-black text-yellow-750 flex items-center gap-1.5 animate-pulse">
                        ⚠️ LOCAL OFFLINE QUEUE QUEUED ({offlineQueue.length} DRAFTS)
                      </p>
                      <p className="text-[11px] text-yellow-700/80">These tickets were generated offline and are securely saved in your browser cache. They will synchronize automatically with the database when network simulation connectivity triggers online again.</p>
                      <div className="font-mono text-[9px] text-yellow-805 space-y-1 pt-1 border-t border-yellow-200/50">
                        {offlineQueue.map(item => (
                          <p key={item.id}>• [{item.category}] {item.title} ({item.priority} Priority)</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTIVE TICKETS CONTAINER */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider block">Submitted Tickets Ledger</h4>
                    
                    {tickets.length > 0 ? (
                      tickets.map(ticket => (
                        <div key={ticket.id} className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-205 dark:border-zinc-850 space-y-3">
                          <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                            <div>
                              <p className="font-black text-gray-905 dark:text-white flex items-center gap-2">
                                🏷️ {ticket.title}
                                <span className="text-[9px] text-gray-400 font-mono font-normal">#{ticket.id}</span>
                              </p>
                              <p className="text-[10px] text-gray-400 uppercase pt-0.5 font-bold tracking-wider">{ticket.category} | Created: {ticket.createdAt}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                                ticket.priority === 'CRITICAL' ? 'bg-red-50 text-red-650' :
                                ticket.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {ticket.priority}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                                ticket.status === 'Resolved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                              }`}>
                                {ticket.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">{ticket.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No disputes submitted. Your platform standing remains clean.</p>
                    )}
                  </div>
                </div>

                {/* HELPDESK CHAT COMPANION */}
                <div className="bg-zinc-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      💬 Rozgaar Care Live AI Assistant
                    </h3>
                    <p className="text-xs text-zinc-400">Ask about wallet balances, cancellation charges, or job safety rules for immediate automated response.</p>
                  </div>

                  <div className="bg-black/40 rounded-2xl p-6 h-[250px] overflow-y-auto flex flex-col space-y-4 border border-zinc-800">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col max-w-[85%] space-y-1 text-xs ${
                          msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-indigo-650 text-white rounded-tr-none'
                              : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-zinc-500 font-mono px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your safety or payment question... (e.g. how do cancellation fees work?)"
                      required
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-grow bg-zinc-850 rounded-xl px-4 py-3 text-xs text-white border border-zinc-700 focus:border-indigo-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-655 hover:bg-indigo-750 text-white font-extrabold text-xs px-5 rounded-xl transition-all uppercase"
                    >
                      Ask AI
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB 9: AI SECURITY SHIELD & FRAUD SENSORS */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                
                {/* TRUST SCORE & RISK METER */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl p-8 border border-emerald-250 dark:border-emerald-900/30 shadow-xl space-y-6">
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                        🛡️ AI Security Shield & Threat scanner
                      </h2>
                      <p className="text-xs text-emerald-655/80">Real-time platform risk analysis auditing transaction bots, IP deviations, and phishy OTP requests.</p>
                    </div>
                    <button
                      onClick={resetAnomalyScore}
                      className="bg-white hover:bg-gray-50 text-emerald-700 text-[10px] font-black px-3.5 py-2.5 rounded-xl border border-emerald-200 transition-colors uppercase"
                    >
                      🔄 Reset threat Metrics
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dial Gauge */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-emerald-100 dark:border-zinc-800 flex flex-col justify-center items-center text-center space-y-3">
                      <div className="h-28 w-28 rounded-full border-8 border-gray-100 dark:border-zinc-800 relative flex items-center justify-center">
                        <div className={`absolute inset-0 rounded-full border-8 border-transparent animate-pulse ${
                          trustScore >= 80 ? 'border-t-green-500 border-r-green-500' :
                          trustScore >= 50 ? 'border-t-yellow-500 border-r-yellow-500' : 'border-t-red-500 border-r-red-500'
                        }`}></div>
                        <div className="text-center">
                          <span className="text-3xl font-black text-gray-905 dark:text-white font-mono">{trustScore}</span>
                          <span className="text-[10px] text-gray-400 block font-black uppercase">Trust Index</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center justify-center gap-1">
                          Risk Rating: 
                          <span className={`font-black ${
                            riskLevel === 'CRITICAL' ? 'text-red-600' :
                            riskLevel === 'ELEVATED' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {riskLevel}
                          </span>
                        </p>
                        <p className="text-[10px] text-gray-400">Score of 100 grants Verified Gold badge Crown status.</p>
                      </div>
                    </div>

                    {/* Quick Stats list */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-emerald-100 dark:border-zinc-800 space-y-4 col-span-2 text-xs">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Account Telemetry Audits</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-50 dark:bg-zinc-955 p-4 rounded-xl border border-gray-155 space-y-1">
                          <span className="text-[10px] text-gray-455 uppercase block font-bold">Email Address Domain</span>
                          <span className="font-mono text-xs text-gray-950 dark:text-white font-bold">{emailAddress}</span>
                          {emailAddress.includes('temp-mail.org') && (
                            <span className="text-[9px] text-red-500 font-extrabold uppercase block pt-0.5">⚠️ Disposable Domain Blocked</span>
                          )}
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-955 p-4 rounded-xl border border-gray-155 space-y-1">
                          <span className="text-[10px] text-gray-455 uppercase block font-bold">Government KYC Verification</span>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                              kycVerified ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-655 border border-red-150'
                            }`}>
                              {kycVerified ? 'Verified Pro' : 'KYC Missing'}
                            </span>
                            {!kycVerified && (
                              <label className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
                                Upload Aadhaar
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handleAadhaarUpload}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-955 p-4 rounded-xl border border-gray-155 space-y-1">
                          <span className="text-[10px] text-gray-455 uppercase block font-bold">Biometric Profile Photo</span>
                          <span className="text-gray-950 dark:text-white font-bold">{profilePhotoStatus}</span>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-955 p-4 rounded-xl border border-gray-155 space-y-1">
                          <span className="text-[10px] text-gray-455 uppercase block font-bold">Mobile Phone OTP Check</span>
                          <span className="text-green-600 font-bold">✓ OTP Verified Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* THREAT SIMULATORS */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-150 dark:border-zinc-800/80 shadow-xl space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">🧪 Sandbox Threat & Bot Pattern Simulators</h3>
                    <p className="text-xs text-gray-505">Trigger threat indicators in sandbox environment to inspect how the AI Security Shield reacts and limits booking access.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={triggerBookingSpike}
                      className="bg-zinc-905 text-white hover:bg-zinc-850 p-5 rounded-2xl text-left border border-zinc-850 space-y-1 transition-transform active:scale-98"
                    >
                      <p className="text-xs font-black uppercase tracking-wider text-red-400">🤖 Simulator A: Booking Frequency Bot Spike</p>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">Simulates high-speed bots triggering 5 duplicate paint/weld bookings in 2 seconds. Escapes trust score to Critical.</p>
                    </button>

                    <button
                      onClick={triggerCashDeviation}
                      className="bg-zinc-905 text-white hover:bg-zinc-850 p-5 rounded-2xl text-left border border-zinc-850 space-y-1 transition-transform active:scale-98"
                    >
                      <p className="text-xs font-black uppercase tracking-wider text-yellow-400">📍 Simulator B: Remote Cash GPS Deviation</p>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">Simulates booking cash request via high delta VPN exceeding 1200km deviation logs. Escapes score to Elevated.</p>
                    </button>
                  </div>
                </div>

                {/* NATURAL LANGUAGE CHAT FRAUD SCANNER */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-150 dark:border-zinc-800/80 shadow-xl space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">💬 Real-time Chat Phishing & Fraud scanner</h3>
                    <p className="text-xs text-gray-505">Paste suspicious messages or text from contractors to scan for direct OTP hijacking triggers or bypass payment links.</p>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      rows={3}
                      placeholder="Paste contractor chats here... (e.g. Please share the OTP code you received or let us do direct payment offline to bypass upi.org)..."
                      value={secChatInput}
                      onChange={(e) => handleChatTextChange(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl px-4 py-3.5 border border-gray-250 dark:border-zinc-800 text-xs font-semibold text-gray-900 dark:text-white outline-none resize-none"
                    />

                    {isMessageFlagged && (
                      <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/30 p-5 rounded-2xl space-y-2">
                        <p className="text-xs font-black text-red-655 uppercase flex items-center gap-1.5 animate-pulse">
                          ⚠️ SHIELD THREAT DETECTION ACTIVE
                        </p>
                        <div className="text-[10px] text-red-700 dark:text-red-300 space-y-1 font-mono">
                          {chatAnalysisLogs.map((log, i) => <p key={i}>• Flagged Indicator: {log}</p>)}
                        </div>

                        <div className="pt-2 border-t border-red-200/50">
                          <p className="text-[10px] font-bold text-gray-455 uppercase mb-1">Scrubbed secure Content output:</p>
                          <div className="p-3 bg-white dark:bg-zinc-955 rounded-xl border border-red-150 font-mono text-[10px] text-gray-800 dark:text-zinc-350">
                            {getScrubbedText()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* HISTORICAL ANOMALIES AUDIT LOG */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-150 dark:border-zinc-800/80 shadow-xl space-y-4">
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider block">Historical Security Auditing logs</h3>
                  <div className="space-y-3">
                    {anomalies.map(anm => (
                      <div key={anm.id} className="flex justify-between items-start bg-zinc-50 dark:bg-zinc-955 p-4 rounded-xl border border-gray-200 dark:border-zinc-855 text-xs">
                        <div className="space-y-1">
                          <p className="font-extrabold text-gray-905 dark:text-white flex items-center gap-1.5">
                            ⚙️ {anm.type}
                            <span className="text-[9px] text-gray-400 font-mono font-normal">#{anm.id}</span>
                          </p>
                          <p className="text-[10px] text-gray-400 font-mono">{anm.timestamp} | {anm.description}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                          anm.severity === 'CRITICAL' ? 'bg-red-50 text-red-655' :
                          anm.severity === 'ELEVATED' ? 'bg-yellow-50 text-yellow-750' : 'bg-green-50 text-green-755'
                        }`}>
                          {anm.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 8: LEGAL & COMPLIANCE PAGES */}
            {activeTab === 'legal' && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">📑 Legal Compliance & Policies</h2>
                  <p className="text-xs text-gray-505">Read platform contracts, refund structures, and our operational compliance values.</p>
                </div>

                <div className="flex gap-1.5 flex-wrap border-b border-gray-150 dark:border-zinc-850 pb-3">
                  {(['privacy', 'terms', 'refund', 'about', 'contact'] as const).map(doc => (
                    <button
                      key={doc}
                      onClick={() => setLegalDoc(doc)}
                      className={`text-[10px] font-bold px-3 py-2 rounded-lg transition-all ${
                        legalDoc === doc
                          ? 'bg-zinc-850 dark:bg-white text-white dark:text-zinc-900'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {doc === 'privacy' ? 'Privacy Policy' :
                       doc === 'terms' ? 'Terms & Conditions' :
                       doc === 'refund' ? 'Refund Policy' :
                       doc === 'about' ? 'About Us' : 'Contact Us'}
                    </button>
                  ))}
                </div>

                {/* Simulated static content blocks for visual excellence */}
                <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-gray-250 dark:border-zinc-850 text-xs leading-relaxed text-gray-700 dark:text-zinc-300 max-h-[350px] overflow-y-auto space-y-4">
                  {legalDoc === 'privacy' && (
                    <>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">1. RozgaarHub Privacy Charter</h3>
                      <p>At RozgaarHub, we take daily partner biometric hashes, Aadhaar verified telemetry logs, and customer address records under high priority security structures. All credentials are fully salted and hashed locally in device browser storage blocks.</p>
                      <p>We do not sell user profile metadata, coordinates logs, or wallet ledger records to any outer aggregators. Soft deleted profiles have an active 30-day recovery timeline before permanent purging occurs.</p>
                    </>
                  )}

                  {legalDoc === 'terms' && (
                    <>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">2. Terms of Platform Service Compliance</h3>
                      <p>By registering on RozgaarHub as worker, contractor, or standard customer, you agree to:
                        <ul className="list-disc pl-5 space-y-1.5 pt-2">
                          <li>Provide authentic govt KYC identification credentials during the onboarding verification desk steps.</li>
                          <li>Comply with platform grace window timelines (e.g. cancellation locks are strictly standard inside 30 minutes).</li>
                          <li>Restrict high-altitude welding or painting scaffolding operations when local weather sensors fire active rain warnings.</li>
                        </ul>
                      </p>
                    </>
                  )}

                  {legalDoc === 'refund' && (
                    <>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">3. Premium Refund & Strike Settlement Policy</h3>
                      <p>Refund structures on cancellation payouts operate on bidirectional strike levels:</p>
                      <p><strong>Labour Cancels booking:</strong> Customer gets a full, 100% platform payout refund instantly transferred back to their main Wallet balance, with 0 deduction fees.</p>
                      <p><strong>Customer Cancels booking:</strong> If completed within the 30-minute grace window, 0 fee is charged. If cancelled outside the grace limit, flat ₹150 penalty fee is deducted from the customer wallet, with a platform strike warning.</p>
                    </>
                  )}

                  {legalDoc === 'about' && (
                    <>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">4. About RozgaarHub Operations</h3>
                      <p>RozgaarHub is a futuristic, highly responsive, Indian-context local labor on-demand ecosystem, empowering thousands of carpenters, plumbers, electricians, and painters by bridging them instantly with domestic and commercial projects.</p>
                      <p>Designed with integrated AI threat sensors, biometrics Aadhaar hashes, real synthesized sirens SOS modules, and dual-direction rating matrices to redefine reliable daily task booking standard operations.</p>
                    </>
                  )}

                  {legalDoc === 'contact' && (
                    <>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">5. Direct Support Channels</h3>
                      <p>Have disputes regarding wallet payout structures or verification delays? Connect with Noida Support headquarters immediately:</p>
                      <p className="font-bold text-indigo-650 dark:text-indigo-400">📞 Support Dispatch Hotline: +91 99999 88888</p>
                      <p className="font-bold text-indigo-650 dark:text-indigo-400">✉️ Platform Email Helpdesk: helpdesk@rozgaarhub.com</p>
                      <div className="pt-3">
                        <Link href="/safety-support" className="inline-block bg-indigo-650 text-white font-bold px-4 py-2.5 rounded-xl">
                          🎫 Direct Support Tikets Center →
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
