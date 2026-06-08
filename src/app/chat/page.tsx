'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Phone, MoreVertical, Paperclip, Mic, Send, 
  MapPin, FileText, Image as ImageIcon, Check, CheckCheck, Clock, 
  ShieldAlert, Navigation, ArrowLeft, PhoneIncoming, PhoneMissed, 
  Play, Shield, AlertTriangle, Trash2, Ban, FolderOpen, Car, Zap,
  Users
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName?: string; // For groups
  text?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  type: 'text' | 'image' | 'document' | 'voice' | 'location' | 'booking';
  fileUrl?: string;
  fileName?: string;
  duration?: string; // For voice
  isSpam?: boolean;
}

interface Chat {
  id: string;
  type: 'direct' | 'group';
  participants: { id: string; name: string; avatar: string; role: string; phone?: string }[];
  name: string; // Contact name or Group name
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  category: string;
  bookingStatus?: 'Pending' | 'Active' | 'Completed';
  bookingId?: string;
}

interface CallLog {
  id: string;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration?: string;
}

const DUMMY_CHATS: Chat[] = [
  {
    id: 'chat_1',
    type: 'direct',
    participants: [{ id: 'l1', name: 'Ravi Kumar', avatar: 'RK', role: 'Electrician', phone: '+91 ***** ***19' }],
    name: 'Ravi Kumar',
    avatar: 'RK',
    online: true,
    lastMessage: 'Main 10 min me pahunch jaunga.',
    lastMessageTime: '10:45 AM',
    unreadCount: 2,
    category: 'Active Booking',
    bookingStatus: 'Active',
    bookingId: 'RZH24581'
  },
  {
    id: 'chat_2',
    type: 'group',
    participants: [
      { id: 'c1', name: 'Contractor Sharma', avatar: 'CS', role: 'Contractor' },
      { id: 'l2', name: 'Aman', avatar: 'AM', role: 'Mason' },
      { id: 'l3', name: 'Rohit', avatar: 'RO', role: 'Painter' }
    ],
    name: 'House Construction Team',
    avatar: 'HC',
    online: true,
    lastMessage: 'Kal se material supply shuru.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    category: 'Project Team',
    bookingStatus: 'Active',
    bookingId: 'PRJ_9921'
  },
  {
    id: 'chat_3',
    type: 'direct',
    participants: [{ id: 'l4', name: 'Suresh Singh', avatar: 'SS', role: 'Plumber' }],
    name: 'Suresh Singh',
    avatar: 'SS',
    online: false,
    lastMessage: 'Invoice has been generated.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    category: 'Completed Booking',
    bookingStatus: 'Completed',
    bookingId: 'RZH11200'
  }
];

const DUMMY_MESSAGES: Record<string, Message[]> = {
  'chat_1': [
    { id: 'm1', senderId: 'me', text: 'Location drop kar diya hai, kitni der me pahunchoge?', timestamp: '10:30 AM', status: 'read', type: 'text' },
    { id: 'm2', senderId: 'me', text: '📍 Sector 4, High Street', timestamp: '10:30 AM', status: 'read', type: 'location' },
    { id: 'm3', senderId: 'l1', text: 'Main nikal chuka hu bhaiya.', timestamp: '10:35 AM', status: 'read', type: 'text' },
    { id: 'm4', senderId: 'l1', text: 'Main 10 min me pahunch jaunga.', timestamp: '10:45 AM', status: 'delivered', type: 'text' }
  ],
  'chat_2': [
    { id: 'm1', senderId: 'c1', senderName: 'Contractor Sharma', text: 'Team, kal subah 9 baje site par report karna.', timestamp: 'Yesterday', status: 'read', type: 'text' },
    { id: 'm2', senderId: 'l2', senderName: 'Aman', text: 'Theek hai sir.', timestamp: 'Yesterday', status: 'read', type: 'text' },
    { id: 'm3', senderId: 'c1', senderName: 'Contractor Sharma', text: 'Kal se material supply shuru.', timestamp: 'Yesterday', status: 'read', type: 'text' }
  ]
};

import api from '@/utils/api';

export default function UnifiedCommunicationSystem() {
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Active' | 'Completed' | 'Groups'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>(DUMMY_MESSAGES);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Call System
  const [callState, setCallState] = useState<{ type: 'incoming' | 'outgoing' | 'active', contact: any, duration: number } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChat]);

  // Simulate typing
  useEffect(() => {
    if (activeChat && activeChat.id === 'chat_1') {
      const timer = setTimeout(() => setIsTyping(true), 2000);
      const timer2 = setTimeout(() => setIsTyping(false), 5000);
      return () => { clearTimeout(timer); clearTimeout(timer2); };
    }
  }, [activeChat]);

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState?.type === 'active') {
      timer = setInterval(() => {
        setCallState(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // FETCH CONVERSATIONS FROM BACKEND
  const [conversations, setConversations] = useState<Chat[]>(DUMMY_CHATS);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await api.get('/communication/conversations');
        if (res.data && res.data.length > 0) {
          const liveChats = res.data.map((c: any) => ({
            id: c._id || c.id,
            type: c.isGroup ? 'group' : 'direct',
            participants: c.participants?.map((p: any) => ({
              id: p._id,
              name: p.name,
              avatar: p.name?.substring(0, 2).toUpperCase() || 'U',
              role: p.role || 'User',
              phone: p.phone
            })) || [],
            name: c.name || c.participants?.find((p:any) => p._id !== 'me')?.name || 'Chat',
            avatar: c.avatar || (c.name ? c.name.substring(0,2).toUpperCase() : 'C'),
            online: true,
            lastMessage: c.lastMessage?.text || 'No messages yet',
            lastMessageTime: c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            unreadCount: c.unreadCount || 0,
            category: c.category || 'General',
            bookingStatus: c.bookingStatus,
            bookingId: c.bookingId
          }));
          setConversations(liveChats);
        }
      } catch (err) {
        console.error('Failed to load live conversations, using mock', err);
      }
    };
    loadConversations();
  }, []);

  // FETCH MESSAGES FOR ACTIVE CHAT
  useEffect(() => {
    if (!activeChat) return;
    
    const loadMessages = async () => {
      try {
        const receiverId = activeChat.participants.find(p => p.id !== 'me')?.id || activeChat.id;
        const res = await api.get(`/communication/chat/${receiverId}`);
        if (res.data && res.data.length > 0) {
          const liveMsgs = res.data.map((m: any) => ({
            id: m._id,
            senderId: m.sender?._id === 'me' ? 'me' : m.sender?._id, // Adapt to your auth logic
            senderName: m.sender?.name,
            text: m.text,
            timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: m.status || 'delivered',
            type: m.type || 'text',
            fileUrl: m.fileUrl,
            fileName: m.fileName,
            isSpam: m.isSpam
          }));
          setMessages(prev => ({ ...prev, [activeChat.id]: liveMsgs }));
        } else {
           // If no messages from API but we selected a chat, maybe it's empty, or keep dummy for demo
        }
      } catch (err) {
        console.error('Failed to load messages from backend', err);
      }
    };
    
    loadMessages();
  }, [activeChat]);

  const handleSendMessage = async (e: React.FormEvent, type: Message['type'] = 'text', content: string = messageInput) => {
    e.preventDefault();
    if (!content.trim() && type === 'text') return;
    if (!activeChat) return;

    // AI Spam/Abuse Detection
    const isSpam = /pay outside|direct gpay|whatsapp me on/i.test(content);
    
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      text: type === 'text' ? content : undefined,
      fileName: type === 'document' ? content : undefined,
      duration: type === 'voice' ? '0:15' : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type,
      isSpam
    };

    // Optimistic UI Update
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    
    setMessageInput('');
    setShowAttachments(false);

    // Send to Backend
    try {
      const receiverId = activeChat.participants.find(p => p.id !== 'me')?.id || activeChat.id;
      await api.post('/communication/messages', {
        receiverId,
        text: type === 'text' ? content : undefined,
        type,
        isSpam
      });
      
      // Update status to delivered
      setMessages(prev => {
        const chatMsgs = [...(prev[activeChat.id] || [])];
        const lastMsg = chatMsgs.find(m => m.id === newMsg.id);
        if (lastMsg) lastMsg.status = 'delivered';
        return { ...prev, [activeChat.id]: chatMsgs };
      });
    } catch (err) {
      console.error('Failed to send message to backend', err);
      // Fallback update status for demo
      setTimeout(() => {
        setMessages(prev => {
          const chatMsgs = [...(prev[activeChat.id] || [])];
          const lastMsg = chatMsgs.find(m => m.id === newMsg.id);
          if (lastMsg) lastMsg.status = 'delivered';
          return { ...prev, [activeChat.id]: chatMsgs };
        });
      }, 1000);
    }
  };

  const handleSimulateIncomingCall = () => {
    setCallState({ type: 'incoming', contact: DUMMY_CHATS[0], duration: 0 });
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const renderMessageBubble = (msg: Message, chat: Chat) => {
    const isMe = msg.senderId === 'me';
    
    return (
      <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'} mb-4 group`}>
        {chat.type === 'group' && !isMe && (
          <span className="text-[10px] font-bold text-indigo-500 mb-1 ml-1">{msg.senderName}</span>
        )}
        
        <div className={`relative p-3 shadow-sm text-sm group-hover:shadow-md transition-shadow ${
          isMe 
            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
            : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm border border-gray-100 dark:border-zinc-700'
        }`}>
          
          {msg.isSpam && (
            <div className="flex items-center gap-1.5 bg-red-500/20 text-red-100 p-2 rounded-lg mb-2 text-xs border border-red-500/50">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="font-bold">AI Warning: Potential outside-platform transaction attempt.</span>
            </div>
          )}

          {msg.type === 'text' && <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
          
          {msg.type === 'location' && (
            <div className="flex flex-col gap-2">
              <div className="w-full h-32 bg-gray-200 dark:bg-zinc-700 rounded-xl overflow-hidden relative border border-white/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-rose-500 drop-shadow-lg" />
                </div>
              </div>
              <p className="font-semibold text-xs flex items-center gap-1"><MapPin className="w-3 h-3"/> {msg.text}</p>
            </div>
          )}

          {msg.type === 'document' && (
            <div className={`flex items-center gap-3 p-2 rounded-xl ${isMe ? 'bg-indigo-700' : 'bg-gray-100 dark:bg-zinc-700'}`}>
              <FileText className="w-8 h-8" />
              <div>
                <p className="font-bold text-xs line-clamp-1">{msg.fileName}</p>
                <p className="text-[10px] opacity-70">PDF Document • 2.4 MB</p>
              </div>
            </div>
          )}

          {msg.type === 'image' && (
            <div className="rounded-xl overflow-hidden border border-white/20">
              <div className="w-48 h-48 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-zinc-400" />
              </div>
            </div>
          )}

          {msg.type === 'voice' && (
            <div className={`flex items-center gap-3 p-2 rounded-xl w-48 ${isMe ? 'bg-indigo-700' : 'bg-gray-100 dark:bg-zinc-700'}`}>
              <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                <Play className="w-4 h-4 ml-0.5" />
              </button>
              <div className="flex-1">
                <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-current"></div>
                </div>
                <p className="text-[10px] mt-1 opacity-70">{msg.duration}</p>
              </div>
            </div>
          )}

          {/* Timestamps & Read Receipts */}
          <div className={`flex items-center justify-end gap-1 text-[9px] mt-1.5 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
            <span>{msg.timestamp}</span>
            {isMe && (
              <span>
                {msg.status === 'sent' && <Check className="w-3 h-3" />}
                {msg.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                {msg.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-300" />}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/customer" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-zinc-300" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              Communication Center
              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">Secure</span>
            </h1>
          </div>
        </div>
        
        {/* Analytics Topbar */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-gray-700 dark:text-zinc-300">Avg Response: 3 min</span>
          </div>
          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-zinc-700 pl-6">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="font-bold text-gray-700 dark:text-zinc-300">End-to-End Encrypted</span>
          </div>
          <button onClick={handleSimulateIncomingCall} className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            Test Incoming Call
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto p-4 gap-4">
        
        {/* Left Sidebar - Chat List */}
        <div className={`w-full md:w-96 flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 space-y-4">
            
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search messages, users, bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-zinc-800/50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              />
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {['All', 'Unread', 'Active', 'Groups', 'Completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-zinc-900 shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full flex items-center gap-3 p-4 border-b border-gray-100 dark:border-zinc-800/50 transition-colors ${
                  activeChat?.id === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/30'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    chat.type === 'group' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {chat.type === 'group' ? <Users className="w-6 h-6" /> : chat.avatar}
                  </div>
                  {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></div>}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{chat.name}</h3>
                    <span className={`text-[10px] font-bold ${chat.unreadCount > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate max-w-[180px] ${chat.unreadCount > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-md shadow-indigo-500/20">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    {chat.bookingStatus === 'Active' && (
                      <span className="text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wider">Active Booking</span>
                    )}
                    {chat.type === 'group' && (
                      <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase tracking-wider">Project Team</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Middle Chat Window */}
        <div className={`flex-1 flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Uber/Rapido Style Booking Integration Top Bar */}
              {activeChat.bookingStatus === 'Active' && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 flex items-center justify-between text-white shadow-md relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Booking {activeChat.bookingId}</p>
                      <h3 className="font-black text-sm flex items-center gap-2">
                        Status: On The Way <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors">
                      <Navigation className="w-3.5 h-3.5" /> Track Live (8 min)
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 border border-red-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 shadow-lg">
                      <AlertTriangle className="w-3.5 h-3.5" /> SOS
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${activeChat.type === 'group' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    {activeChat.avatar}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{activeChat.name}</h2>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {isTyping ? <span className="text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">Typing...</span> : (activeChat.online ? 'Online' : 'Last seen recently')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {activeChat.type !== 'group' && (
                    <button onClick={() => setCallState({ type: 'outgoing', contact: activeChat, duration: 0 })} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => setShowRightPanel(!showRightPanel)} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-300 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/50 dark:bg-zinc-950/50 relative">
                <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/80 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col justify-end min-h-full">
                  <div className="flex justify-center mb-6">
                    <span className="bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm border border-gray-300 dark:border-zinc-700">
                      Messages are End-to-End Encrypted
                    </span>
                  </div>

                  {messages[activeChat.id]?.map((msg) => renderMessageBubble(msg, activeChat))}
                  
                  {isTyping && (
                    <div className="flex items-center gap-2 mb-4 bg-white dark:bg-zinc-800 w-fit px-4 py-2.5 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-zinc-700 shadow-sm">
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 relative z-20">
                <AnimatePresence>
                  {showAttachments && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-4 mb-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 p-2 flex gap-2"
                    >
                      <button onClick={(e) => handleSendMessage(e as any, 'document', 'Verification.pdf')} className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl flex flex-col items-center gap-1 min-w-[70px]">
                        <FileText className="w-5 h-5"/>
                        <span className="text-[9px] font-bold">Doc</span>
                      </button>
                      <button onClick={(e) => handleSendMessage(e as any, 'image')} className="p-3 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-xl flex flex-col items-center gap-1 min-w-[70px]">
                        <ImageIcon className="w-5 h-5"/>
                        <span className="text-[9px] font-bold">Photo</span>
                      </button>
                      <button onClick={(e) => handleSendMessage(e as any, 'location', '📍 Main Road Site')} className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl flex flex-col items-center gap-1 min-w-[70px]">
                        <MapPin className="w-5 h-5"/>
                        <span className="text-[9px] font-bold">Location</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                  <button type="button" onClick={() => setShowAttachments(!showAttachments)} className="p-3.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded-2xl transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea 
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                      className="w-full bg-gray-100 dark:bg-zinc-800 border-none rounded-2xl px-4 py-3.5 text-sm resize-none h-[52px] max-h-32 focus:ring-2 focus:ring-indigo-500 outline-none scrollbar-none dark:text-white"
                      rows={1}
                    />
                  </div>
                  {messageInput.trim() ? (
                    <button type="submit" className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-md shadow-indigo-600/20">
                      <Send className="w-5 h-5 ml-0.5" />
                    </button>
                  ) : (
                    <button type="button" onClick={(e) => handleSendMessage(e as any, 'voice')} className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all shadow-md shadow-indigo-600/20">
                      <Mic className="w-5 h-5" />
                    </button>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 dark:bg-zinc-950">
              <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-lg border border-gray-100 dark:border-zinc-800 mb-6 relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
                <Zap className="w-10 h-10 text-indigo-500 relative z-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">RozgaarHub Comm Center</h2>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">Select a conversation from the left to start messaging. Your chats are secured with AI spam detection.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Booking Info & Media Gallery */}
        {activeChat && showRightPanel && (
          <div className="hidden lg:flex flex-col w-80 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-y-auto">
            
            <div className="p-6 flex flex-col items-center border-b border-gray-100 dark:border-zinc-800">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl mb-4 ${activeChat.type === 'group' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {activeChat.avatar}
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white text-center">{activeChat.name}</h3>
              {activeChat.participants[0]?.phone && (
                <p className="text-xs text-gray-500 font-mono mt-1 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
                  {activeChat.participants[0].phone} <span className="text-[8px] text-red-500 uppercase font-bold ml-1">Masked</span>
                </p>
              )}
            </div>

            <div className="p-6 space-y-6">
              
              {/* Security Actions */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Privacy & Security</h4>
                <button className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-sm font-bold border border-transparent hover:border-red-100 dark:hover:border-red-900/30">
                  <Ban className="w-4 h-4" /> Block Contact
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-xl transition-colors text-sm font-bold border border-transparent hover:border-amber-100 dark:hover:border-amber-900/30">
                  <AlertTriangle className="w-4 h-4" /> Report Suspicious
                </button>
              </div>

              {/* Media Gallery */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Media, Links & Docs</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden relative group cursor-pointer border border-gray-200 dark:border-zinc-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                  <span>View All Media (12)</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>

              {/* Group Participants */}
              {activeChat.type === 'group' && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Team Members ({activeChat.participants.length})</h4>
                  <div className="space-y-3">
                    {activeChat.participants.map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {p.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-gray-500">{p.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Modern Audio Call Modal */}
      <AnimatePresence>
        {callState && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 text-white rounded-[2rem] w-full max-w-[340px] p-8 border border-zinc-800 shadow-2xl relative overflow-hidden"
            >
              {/* Background gradient effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>

              <div className="absolute top-5 right-5">
                <span className="bg-zinc-800 text-[9px] font-bold px-2 py-1 rounded border border-zinc-700 flex items-center gap-1 text-gray-300 uppercase tracking-wider">
                  <Shield className="w-3 h-3 text-green-500" /> Secure
                </span>
              </div>

              <div className="text-center mt-6 space-y-6">
                <div className="relative inline-block">
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black bg-indigo-600 relative z-10 ${callState.type !== 'active' ? 'animate-pulse' : ''}`}>
                    {callState.contact?.avatar}
                  </div>
                  {callState.type !== 'active' && (
                    <>
                      <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute -inset-4 bg-indigo-500 rounded-full animate-ping opacity-10 animation-delay-300"></div>
                    </>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black tracking-tight">{callState.contact?.name}</h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">
                    {callState.type === 'incoming' && 'Incoming Audio Call...'}
                    {callState.type === 'outgoing' && 'Calling...'}
                    {callState.type === 'active' && formatDuration(callState.duration)}
                  </p>
                </div>
              </div>

              <div className="mt-12 flex justify-center gap-8">
                {callState.type === 'incoming' ? (
                  <>
                    <button 
                      onClick={() => setCallState(null)}
                      className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-transform active:scale-95"
                    >
                      <Phone className="w-6 h-6 rotate-[135deg]" />
                    </button>
                    <button 
                      onClick={() => setCallState({ ...callState, type: 'active' })}
                      className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-transform active:scale-95"
                    >
                      <PhoneIncoming className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <>
                    {callState.type === 'active' && (
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-amber-500 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'}`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setCallState(null)}
                      className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-transform active:scale-95 mx-2"
                    >
                      <Phone className="w-6 h-6 rotate-[135deg]" />
                    </button>
                    {callState.type === 'active' && (
                      <button 
                        onClick={() => setIsSpeaker(!isSpeaker)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isSpeaker ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'}`}
                      >
                        <Zap className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
