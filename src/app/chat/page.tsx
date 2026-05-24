'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'customer' | 'provider';
  text: string;
  timestamp: string;
  read: boolean;
  type?: 'text' | 'image' | 'document' | 'voice';
  isSpam?: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  role: 'labour' | 'contractor';
  online: boolean;
  avatar: string;
  lastMessage: string;
  category: string;
}

interface CallLog {
  id: string;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration?: string;
}

export default function CommunicationDashboard() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  const [contacts, setContacts] = useState<ChatContact[]>([
    { id: '1', name: 'Ramesh Kumar', role: 'labour', category: 'Electrician', online: true, avatar: 'R', lastMessage: 'Haan bhaiya, mai 10 minute mein pahunch raha hu.' },
    { id: '2', name: 'Verma Construction', role: 'contractor', category: 'General Contractor', online: false, avatar: 'V', lastMessage: 'Sure, we will send the daily quote list by evening.' },
    { id: '3', name: 'Suresh Singh', role: 'labour', category: 'Plumber', online: true, avatar: 'S', lastMessage: 'Work completed. Please share the completion OTP.' },
  ]);

  const [activeContact, setActiveContact] = useState<ChatContact>(contacts[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      { id: 'm1', sender: 'customer', text: 'Hello Ramesh, did you start from your location?', timestamp: '10:30 AM', read: true },
      { id: 'm2', sender: 'provider', text: 'Haan bhaiya, mai 10 minute mein pahunch raha hu.', timestamp: '10:31 AM', read: true },
    ],
    '2': [
      { id: 'm3', sender: 'customer', text: 'Please send the pricing details for masonry project.', timestamp: 'Yesterday', read: true },
      { id: 'm4', sender: 'provider', text: 'Sure, we will send the daily quote list by evening.', timestamp: 'Yesterday', read: true },
    ],
    '3': [
      { id: 'm5', sender: 'provider', text: 'Work completed. Please share the completion OTP.', timestamp: '2 days ago', read: true }
    ]
  });

  const [chatSearch, setChatSearch] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Call System states
  const [activeCall, setActiveCall] = useState<{ name: string; status: string; duration: number } | null>(null);
  const [callMuted, setCallMuted] = useState(false);
  const [callSpeaker, setCallSpeaker] = useState(false);
  const [privacyMasking, setPrivacyMasking] = useState(true);

  // Call Logs Database
  const [callLogs, setCallLogs] = useState<CallLog[]>([
    { id: 'c1', name: 'Ramesh Kumar', type: 'incoming', time: '10:15 AM', duration: '2m 14s' },
    { id: 'c2', name: 'Suresh Singh', type: 'missed', time: '9:00 AM' },
    { id: 'c3', name: 'Verma Construction', type: 'outgoing', time: 'Yesterday', duration: '5m 45s' },
  ]);

  // Handle typing indicator simulation
  useEffect(() => {
    if (messages[activeContact.id]?.length > 0) {
      const timer = setTimeout(() => {
        setIsTyping(true);
      }, 1500);
      
      const stopTimer = setTimeout(() => {
        setIsTyping(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(stopTimer);
      };
    }
  }, [activeContact]);

  // Live call timer effect
  useEffect(() => {
    let callTimer: NodeJS.Timeout;
    if (activeCall && activeCall.status === 'Connected') {
      callTimer = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(callTimer);
  }, [activeCall]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Spam detection logic (Rules to block illegal external bypass communications)
    const isSpamText = /pay offline|contact outside|direct number|whatsapp me/i.test(messageInput);

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      isSpam: isSpamText
    };

    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMessage]
    }));

    setMessageInput('');

    // Simulate reply from provider
    if (!isSpamText) {
      setTimeout(() => {
        const reply: Message = {
          id: `msg_${Date.now() + 1}`,
          sender: 'provider',
          text: 'Theek hai bhaiya, noted!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true
        };
        setMessages(prev => ({
          ...prev,
          [activeContact.id]: [...(prev[activeContact.id] || []), reply]
        }));
      }, 2500);
    }
  };

  // Delete message handler
  const handleDeleteMessage = (msgId: string) => {
    setMessages(prev => ({
      ...prev,
      [activeContact.id]: prev[activeContact.id].filter(m => m.id !== msgId)
    }));
  };

  // Media simulated attachments
  const handleSimulateAttachment = (type: 'image' | 'document' | 'voice') => {
    const attachmentLabels = {
      image: '📷 Attached Service Site Photo (site_before.jpg)',
      document: '📁 Attached Aadhaar Verification Receipt.pdf',
      voice: '🎙️ Voice Note (0:12)'
    };

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      text: attachmentLabels[type],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };

    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
    }));
  };

  // In-App audio call trigger
  const handleInitiateCall = (contact: ChatContact) => {
    setActiveCall({ name: contact.name, status: 'Ringing...', duration: 0 });
    
    // Simulate pick up after 2.5 seconds
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'Connected' } : null);
    }, 2500);
  };

  // Format call duration to 00:00
  const formatCallDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 transition-colors duration-300">
      
      {/* Navigation header */}
      <div className="max-w-7xl mx-auto mb-4 flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rozgaar Communication Center</span>
      </div>

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Contact List & Call logs */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Chat List Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">💬 Active Chats</h2>
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
            </div>

            <input 
              type="text" 
              placeholder="Search chat or skills..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none"
            />

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {contacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActiveContact(c)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border flex gap-3 items-center ${
                    activeContact.id === c.id
                      ? 'bg-indigo-50 border-indigo-200 dark:bg-zinc-800 dark:border-zinc-700'
                      : 'bg-white hover:bg-gray-50 border-transparent dark:bg-zinc-900'
                  }`}
                >
                  <div className="relative">
                    <div className="h-10 w-10 bg-indigo-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center font-bold text-indigo-650 dark:text-indigo-400">
                      {c.avatar}
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-900"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{c.name}</h4>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{c.category}</p>
                    <p className="text-[9px] text-gray-500 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Missed Calls & Call Logs Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">📞 Call Logs & History</h2>
            
            <div className="space-y-3">
              {callLogs.map(log => (
                <div key={log.id} className="flex justify-between items-center text-xs border-b border-gray-100 dark:border-zinc-850 pb-2 last:pb-0 last:border-none">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{log.name}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        log.type === 'incoming' ? 'bg-green-50 text-green-700' :
                        log.type === 'outgoing' ? 'bg-blue-50 text-blue-750' : 'bg-red-50 text-red-650 animate-pulse'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-[9px] text-gray-400">{log.time}</span>
                    </div>
                  </div>
                  {log.duration && (
                    <span className="text-[9px] text-gray-400">{log.duration}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Chat Window & Communications Space */}
        <div className="lg:col-span-3 space-y-6 flex flex-col h-[650px] bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Communication Window Header */}
          <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-850 p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold">
                {activeContact.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white">{activeContact.name}</h3>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
                    activeContact.role === 'contractor' ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {activeContact.role}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">
                  {activeContact.online ? '● Online' : 'Offline'} | {activeContact.category}
                </p>
              </div>
            </div>

            {/* Calling Trigger button */}
            <button 
              onClick={() => handleInitiateCall(activeContact)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-xl flex items-center gap-1.5 shadow shadow-green-500/10 text-xs"
            >
              <span>📞</span> Call Pro
            </button>
          </div>

          {/* Messages Log Viewport */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50 dark:bg-zinc-950/50">
            {messages[activeContact.id]?.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col max-w-[70%] group relative ${
                  msg.sender === 'customer' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                {/* Trashcan Delete Indicator */}
                <button 
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="absolute -top-1 -left-6 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity text-xs"
                  title="Delete message"
                >
                  🗑️
                </button>

                <div className={`p-3.5 rounded-2xl text-xs space-y-1 relative shadow-sm ${
                  msg.sender === 'customer'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-tl-none border border-gray-150 dark:border-zinc-800'
                }`}>
                  <p>{msg.text}</p>
                  
                  {/* Spam Risk Flag Alert Banner */}
                  {msg.isSpam && (
                    <div className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider p-1 rounded mt-1">
                      ⚠️ Spam Flag: Illegal off-platform deal bypass detected!
                    </div>
                  )}
                </div>
                
                {/* Timestamp & Read receipts */}
                <div className="flex items-center gap-1.5 mt-1 text-[9px] text-gray-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'customer' && (
                    <span className={msg.read ? 'text-blue-500 font-bold' : 'text-gray-300'}>
                      ✓✓
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Dynamic Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 ml-2">
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="font-semibold">{activeContact.name} is typing...</span>
              </div>
            )}
          </div>

          {/* Media Attachments Action Bar */}
          <div className="px-6 py-2 border-t border-gray-100 dark:border-zinc-850 flex gap-4 bg-white dark:bg-zinc-900">
            <button 
              onClick={() => handleSimulateAttachment('image')}
              className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              📷 Image
            </button>
            <button 
              onClick={() => handleSimulateAttachment('document')}
              className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              📁 Document
            </button>
            <button 
              onClick={() => handleSimulateAttachment('voice')}
              className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              🎙️ Voice Note
            </button>
          </div>

          {/* Chat input controls */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex gap-3">
            <input 
              type="text" 
              placeholder="Type your reply here... (Try: 'whatsapp me' to test smart Spam check)"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs"
            >
              Send Message
            </button>
          </form>

        </div>

      </div>

      {/* Dynamic In-App Audio Call Overlay Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 text-white rounded-3xl max-w-sm w-full p-8 text-center space-y-8 border border-zinc-800 shadow-2xl relative">
            
            {/* Top Security Privacy Masking Badge */}
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setPrivacyMasking(!privacyMasking)}
                className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider transition-colors ${
                  privacyMasking ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-gray-400'
                }`}
              >
                🔒 Masking: {privacyMasking ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Caller avatar & details */}
            <div className="space-y-3 pt-4">
              <div className="h-20 w-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg shadow-indigo-600/20">
                {activeCall.name.charAt(0)}
              </div>
              <h3 className="text-lg font-bold">{activeCall.name}</h3>
              <p className="text-xs text-gray-400 font-semibold tracking-wider">
                {privacyMasking ? '+91 ******4819' : '+91 98457 24819'}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 animate-pulse mt-1">
                {activeCall.status}
              </p>
            </div>

            {/* Call Duration Timer */}
            {activeCall.status === 'Connected' && (
              <div className="space-y-1">
                <p className="text-3xl font-mono font-extrabold text-white">
                  {formatCallDuration(activeCall.duration)}
                </p>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Call Duration Timer</p>
              </div>
            )}

            {/* Call Action controls: Mute, Speaker */}
            <div className="flex justify-center gap-8">
              <button 
                onClick={() => setCallMuted(!callMuted)}
                className={`h-12 w-12 rounded-full flex items-center justify-center text-lg transition-all ${
                  callMuted ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-gray-300'
                }`}
                title="Mute microphone"
              >
                {callMuted ? '🎙️' : '🎙️'}
              </button>
              <button 
                onClick={() => setCallSpeaker(!callSpeaker)}
                className={`h-12 w-12 rounded-full flex items-center justify-center text-lg transition-all ${
                  callSpeaker ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-300'
                }`}
                title="Speakerphone toggle"
              >
                🔊
              </button>
            </div>

            {/* Hangup button */}
            <button 
              onClick={() => {
                // If call was connected, add to history
                if (activeCall.status === 'Connected') {
                  const newLog: CallLog = {
                    id: `c_${Date.now()}`,
                    name: activeCall.name,
                    type: 'outgoing',
                    time: 'Just now',
                    duration: formatCallDuration(activeCall.duration)
                  };
                  setCallLogs(prev => [newLog, ...prev]);
                }
                setActiveCall(null);
                setCallMuted(false);
                setCallSpeaker(false);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-650/10 text-xs"
            >
              Disconnect Call (Hang Up)
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
