import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Phone, Video, MoreVertical, Paperclip, 
  Smile, Mic, Image as ImageIcon, FileText, Send, Check, 
  CheckCheck, MapPin, ShieldAlert, Heart, Slash, Flag, 
  X, Volume2, MicOff, Info, ArrowLeft, Navigation, Camera
} from 'lucide-react';

import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function ChatCenter() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  
  // Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/communications/conversations');
        setChats(res.data);
        if (res.data.length > 0 && !activeChat) {
          setActiveChat(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setIsLoadingChats(false);
      }
    };
    fetchConversations();
    // Poll for new conversations every 10s
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Messages for active chat
  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/communications/chat/${activeChat.id}`);
        // Map backend to frontend shape
        const mappedMsgs = res.data.map((m: any) => ({
          id: m._id,
          text: m.content,
          sender: m.sender === activeChat.id ? 'labour' : 'customer',
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.read ? 'read' : 'delivered'
        }));
        setMessages(mappedMsgs);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
    // Poll for new messages every 3s
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChat]);
  
  // UI States
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showMobileList, setShowMobileList] = useState(false);
  const [callingState, setCallingState] = useState<'none' | 'incoming' | 'active'>('none');
  const [callTimer, setCallTimer] = useState(0);

  // Call Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callingState === 'active') {
      interval = setInterval(() => setCallTimer(p => p + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callingState]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    // Optimistic UI update
    const newMsg = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'customer',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };
    setMessages([...messages, newMsg]);
    setMessageText('');
    
    try {
      const res = await api.post('/communications/messages', {
        receiverId: activeChat.id,
        bookingId: activeChat.bookingId,
        content: newMsg.text,
        messageType: 'text'
      });
      
      if (res.data.isSpam) {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== newMsg.id));
    }
  };

  const handleBlockUser = async () => {
    if (!activeChat) return;
    try {
      await api.post('/communications/block', { targetUserId: activeChat.id });
      toast.success(`${activeChat.name} has been blocked.`);
      setChats(prev => prev.filter(c => c.id !== activeChat.id));
      setActiveChat(null);
      setShowRightPanel(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to block user');
    }
  };

  const handleReportUser = async () => {
    if (!activeChat) return;
    try {
      await api.post('/communications/report', { 
        targetUserId: activeChat.id,
        reason: 'Inappropriate behavior in chat'
      });
      toast.success(`Report submitted for ${activeChat.name}. Support will review it.`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to report user');
    }
  };

  return (
    <div className="flex flex-1 h-full w-full bg-white dark:bg-zinc-900 overflow-hidden relative animate-in fade-in duration-300">
      
      {/* LEFT SIDEBAR: Chat List */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200 dark:border-zinc-800 shrink-0 ${activeChat && !showMobileList ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search chats..." className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber/20" />
          </div>
          <div className="flex overflow-x-auto scrollbar-none gap-2">
            <button className="px-3 py-1 bg-brand-amber text-white text-xs font-bold rounded-lg whitespace-nowrap">All</button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-700 text-xs font-bold rounded-lg whitespace-nowrap transition-colors">Unread</button>
            <button className="px-3 py-1 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-700 text-xs font-bold rounded-lg whitespace-nowrap transition-colors">Active Booking</button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoadingChats ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading conversations...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No active conversations found.</div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => { setActiveChat(chat); setShowMobileList(false); }}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-zinc-700" />
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${chat.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{chat.name}</h4>
                    <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-brand-amber' : 'text-gray-400'}`}>
                      {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${chat.unread > 0 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-zinc-400'}`}>{chat.lastMessage}</p>
                    {chat.unread > 0 && <span className="bg-brand-amber text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">{chat.unread}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CENTER: Chat Window */}
      {activeChat && (
        <div className={`flex-1 flex flex-col relative ${!showMobileList ? 'flex' : 'hidden md:flex'}`}>
          
          {/* Top Bar */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowMobileList(true)} className="md:hidden p-2 -ml-2 text-gray-500"><ArrowLeft className="w-5 h-5" /></button>
              <div className="relative cursor-pointer" onClick={() => setShowRightPanel(!showRightPanel)}>
                <img src={activeChat.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-zinc-700" />
                {activeChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>}
              </div>
              <div className="cursor-pointer" onClick={() => setShowRightPanel(!showRightPanel)}>
                <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{activeChat.name}</h3>
                <p className="text-xs text-gray-500">{activeChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Smart Booking Integration Header */}
              {activeChat.bookingStatus === 'On The Way' && (
                <div className="hidden sm:flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50 mr-2">
                  <span className="w-2 h-2 bg-brand-amber rounded-full animate-pulse"></span>
                  <div className="text-xs">
                     <span className="font-bold text-amber-900 dark:text-amber-500">{activeChat.bookingId}</span>
                     <span className="text-amber-700 dark:text-amber-600 ml-2">ETA: {activeChat.eta}</span>
                  </div>
                  <button className="ml-2 text-[10px] font-black uppercase bg-brand-amber text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <Navigation className="w-3 h-3" /> Track
                  </button>
                </div>
              )}
              <button onClick={() => setCallingState('active')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><Phone className="w-5 h-5" /></button>
              <button onClick={() => setShowRightPanel(!showRightPanel)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-gray-50 dark:bg-zinc-950 flex flex-col gap-3 relative">
            
            {/* Security Warning */}
            <div className="mx-auto bg-amber-100/80 dark:bg-amber-900/20 text-amber-800 dark:text-amber-500 text-[10px] sm:text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 text-center max-w-md shadow-sm mb-4">
              <ShieldAlert className="w-4 h-4 inline-block mr-1 -mt-0.5" /> 
              For your security, do not share personal numbers or pay outside RozgaarHub.
            </div>

            {messages.map(msg => {
              const isMe = msg.sender === 'customer';
              return (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm relative ${
                    isMe 
                      ? 'bg-brand-amber text-white rounded-br-none' 
                      : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    <span className="text-[10px] text-gray-400 font-medium">{msg.time}</span>
                    {isMe && (
                      msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> :
                      msg.status === 'delivered' ? <CheckCheck className="w-3.5 h-3.5 text-gray-400" /> :
                      <Check className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="self-start bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 w-16 h-10 mt-2">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
              </div>
            )}
          </div>

          {/* Bottom Input Bar */}
          <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shrink-0">
            {activeChat.bookingStatus === 'Completed' ? (
              <div className="flex items-center justify-center py-3 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 text-sm text-gray-500 font-medium">
                <Info className="w-4 h-4 mr-2" />
                Chat is disabled because this booking has been completed.
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1 bg-gray-100 dark:bg-zinc-950 rounded-3xl border border-transparent focus-within:border-brand-amber/30 flex items-end p-1 transition-colors">
                  <button type="button" className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors shrink-0"><Smile className="w-6 h-6" /></button>
                  <textarea 
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 max-h-32 min-h-[44px] py-3 text-sm resize-none outline-none dark:text-white"
                    rows={1}
                  />
                  <div className="flex items-center shrink-0 pr-1 pb-1 gap-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"><Paperclip className="w-5 h-5" /></button>
                    <button type="button" className="hidden sm:block p-2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"><Camera className="w-5 h-5" /></button>
                  </div>
                </div>
                {messageText.trim() ? (
                  <button type="submit" className="p-3.5 bg-brand-amber hover:bg-brand-orange text-white rounded-full transition-transform active:scale-95 shadow-md shrink-0 mb-0.5">
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button type="button" className="p-3.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors shrink-0 mb-0.5">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </form>
            )}
          </div>

          {/* Incoming/Active Call Overlay */}
          <AnimatePresence>
            {callingState !== 'none' && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-gray-900/95 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white"
              >
                <div className="relative mb-8">
                  <img src={activeChat.avatar} className="w-32 h-32 rounded-full border-4 border-gray-700 object-cover" />
                  {callingState === 'active' && (
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg">
                       {formatTime(callTimer)}
                     </div>
                  )}
                </div>
                <h2 className="text-3xl font-black mb-2">{activeChat.name}</h2>
                <p className="text-gray-400 font-medium tracking-widest uppercase text-sm mb-12">
                  {callingState === 'incoming' ? 'Incoming Call...' : 'RozgaarHub Secure Call'}
                </p>
                
                <div className="flex items-center gap-8">
                  {callingState === 'incoming' ? (
                    <>
                      <button onClick={() => setCallingState('none')} className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-transform hover:scale-110 shadow-lg shadow-rose-500/30">
                        <Phone className="w-7 h-7 rotate-[135deg]" />
                      </button>
                      <button onClick={() => setCallingState('active')} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-transform hover:scale-110 shadow-lg shadow-green-500/30 animate-pulse">
                        <Phone className="w-7 h-7" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"><Volume2 className="w-6 h-6" /></button>
                      <button className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"><MicOff className="w-6 h-6" /></button>
                      <button onClick={() => setCallingState('none')} className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center hover:bg-rose-600 transition-transform hover:scale-110 shadow-lg shadow-rose-500/30 ml-4">
                        <Phone className="w-7 h-7 rotate-[135deg]" />
                      </button>
                    </>
                  )}
                </div>
                
                <div className="absolute bottom-8 text-xs text-gray-500 flex items-center gap-1 font-bold">
                  <ShieldAlert className="w-4 h-4" /> End-to-end encrypted • Number hidden
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* RIGHT SIDEBAR: Profile Panel */}
      <AnimatePresence>
        {showRightPanel && !showMobileList && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden xl:flex flex-col border-l border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 shrink-0 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900">
              <h3 className="font-bold text-gray-900 dark:text-white">Contact Info</h3>
              <button onClick={() => setShowRightPanel(false)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="text-center">
                <img src={activeChat.avatar} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-white dark:border-zinc-800 shadow-md" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeChat.name}</h2>
                <p className="text-sm font-bold text-brand-amber mt-1">{activeChat.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-6 border-b border-gray-200 dark:border-zinc-800">
                 <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-150 dark:border-zinc-800 text-center shadow-sm">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rating</p>
                   <p className="font-black text-gray-900 dark:text-white">⭐ {activeChat.rating}</p>
                 </div>
                 <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-gray-150 dark:border-zinc-800 text-center shadow-sm">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reliability</p>
                   <p className="font-black text-green-600">{activeChat.reliability}</p>
                 </div>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-brand-amber hover:bg-brand-orange text-white font-bold rounded-xl shadow-sm transition-all">
                  <Phone className="w-5 h-5" /> Audio Call
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-white font-bold rounded-xl shadow-sm transition-all">
                  <Heart className="w-5 h-5" /> Add to Favourites
                </button>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 space-y-2">
                <button onClick={handleBlockUser} className="w-full flex items-center gap-3 p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl font-bold text-sm transition-colors">
                   <Slash className="w-5 h-5" /> Block User
                </button>
                <button onClick={handleReportUser} className="w-full flex items-center gap-3 p-3 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl font-bold text-sm transition-colors">
                   <Flag className="w-5 h-5" /> Report Contact
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
