import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Phone, MoreVertical, Paperclip, Camera, 
  Smile, Mic, Send, Check, CheckCheck, MapPin, 
  AlertTriangle, X, PhoneIncoming, PhoneOff, PhoneForwarded,
  ShieldAlert, Navigation, Info
} from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function LabourChatCenter() {
  const [chatsList, setChatsList] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/communications/conversations');
        setChatsList(res.data);
        if (res.data.length > 0 && !activeChat) {
          setActiveChat(res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load chats:", err);
      } finally {
        setIsLoadingChats(false);
      }
    };
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Messages for active chat
  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/communications/chat/${activeChat}`);
        // Map backend to frontend shape
        const mappedMsgs = res.data.map((m: any) => ({
          id: m._id,
          text: m.content,
          senderId: m.sender === activeChat ? 'them' : 'me',
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.read ? 'read' : 'delivered'
        }));
        setMessages(mappedMsgs);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChat]);

  const activeUser = chatsList.find(c => c.id === activeChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat || !activeUser) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending'
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    try {
      const res = await api.post('/communications/messages', {
        receiverId: activeUser.id,
        bookingId: activeUser.bookingId,
        content: newMessage.text,
        messageType: 'text'
      });
      
      if (res.data.isSpam) {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message');
      setMessages(prev => prev.filter(m => m.id !== newMessage.id));
    }
  };

  const handleBlockUser = async () => {
    if (!activeUser) return;
    try {
      await api.post('/communications/block', { targetUserId: activeUser.id });
      toast.success(`${activeUser.name} has been blocked.`);
      // Optimistically remove from chat list
      setChatsList(prev => prev.filter(c => c.id !== activeUser.id));
      setActiveChat(null);
      setShowContactInfo(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to block user');
    }
  };

  const handleReportUser = async () => {
    if (!activeUser) return;
    try {
      await api.post('/communications/report', { 
        targetUserId: activeUser.id,
        reason: 'Inappropriate behavior in chat'
      });
      toast.success(`Report submitted for ${activeUser.name}. Support will review it.`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to report user');
    }
  };

  // Simulate Incoming Call
  useEffect(() => {
    const timer = setTimeout(() => {
      setIncomingCall(true);
    }, 30000); // 30s after mount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full min-h-[700px] bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-xl relative animate-in fade-in duration-500">
      
      {/* Call Overlays */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center border border-gray-800 shadow-2xl"
            >
              <div className="w-24 h-24 rounded-full mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                <img src={activeUser?.avatar || "https://i.pravatar.cc/150"} className="w-full h-full rounded-full border-4 border-gray-800 relative z-10" alt="Caller" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{activeUser?.name || 'User'}</h3>
              <p className="text-gray-400 mb-10">Incoming Call...</p>
              
              <div className="flex justify-center gap-8">
                <button 
                  onClick={() => setIncomingCall(false)}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg shadow-red-500/20"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <button 
                  onClick={() => { setIncomingCall(false); setIsCalling(true); }}
                  className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg shadow-green-500/20 animate-bounce"
                >
                  <PhoneIncoming className="w-7 h-7" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isCalling && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900 z-50 flex flex-col items-center justify-between p-8"
          >
            <div className="text-center mt-10">
              <h3 className="text-2xl font-bold text-white mb-2">{activeUser?.name}</h3>
              <p className="text-green-400 font-mono text-lg">05:42</p>
            </div>
            
            <div className="w-40 h-40 rounded-full relative">
              <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
              <img src={activeUser?.avatar || "https://i.pravatar.cc/150"} className="w-full h-full rounded-full border-4 border-gray-800 relative z-10 object-cover" alt="Call Avatar" />
            </div>

            <div className="flex gap-6 mb-10">
              <button className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                <Mic className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsCalling(false)}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <button className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                <PhoneForwarded className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar - Chat List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900 shrink-0">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber dark:text-white"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-3 py-1 bg-brand-amber text-white text-xs font-bold rounded-full">All</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-bold rounded-full hover:bg-gray-200">Unread</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-bold rounded-full hover:bg-gray-200">Active Booking</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingChats ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading conversations...</div>
          ) : chatsList.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No active conversations found.</div>
          ) : (
            chatsList.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-gray-100 dark:border-zinc-800/50 ${
                  activeChat === chat.id ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <div className="relative">
                  <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" alt={chat.name} />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{chat.name}</h4>
                    <span className={`text-[10px] whitespace-nowrap ${chat.unread > 0 ? 'text-brand-amber font-bold' : 'text-gray-400'}`}>
                      {new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 bg-brand-amber text-white text-[10px] font-bold flex items-center justify-center rounded-full ml-2 shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F0F2F5] dark:bg-[#0B141A] relative h-full">
        {/* Chat Background Pattern */}
        <div className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        {/* Top Header */}
        <div className="h-16 px-4 bg-white dark:bg-[#202C33] border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between z-10 shrink-0 shadow-sm">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowContactInfo(!showContactInfo)}
          >
            <div className="relative">
              <img src={activeUser?.avatar || "https://i.pravatar.cc/150"} className="w-10 h-10 rounded-full object-cover" alt={activeUser?.name} />
              {activeUser?.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#202C33] rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-[#E9EDEF] group-hover:underline">{activeUser?.name}</h3>
              <p className="text-xs text-gray-500 dark:text-[#8696A0]">{activeUser?.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Booking Integration Badge */}
            {activeUser?.bookingStatus === 'On The Way' && (
              <div className="hidden sm:flex items-center gap-2 bg-brand-amber/10 border border-brand-amber/20 px-3 py-1.5 rounded-full text-xs">
                <span className="font-bold text-brand-amber">#{activeUser.bookingId}</span>
                <span className="text-gray-500">ETA: {activeUser.eta}</span>
                <button className="bg-brand-amber hover:bg-brand-orange text-white px-2 py-0.5 rounded-md font-bold ml-1 transition-colors flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> Track
                </button>
              </div>
            )}
            
            <button 
              onClick={() => setIsCalling(true)}
              className="text-gray-500 dark:text-[#8696A0] hover:text-indigo-600 dark:hover:text-indigo-400 p-2"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button className="text-gray-500 dark:text-[#8696A0] hover:text-gray-700 p-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Alert */}
        <div className="z-10 flex justify-center p-3">
          <div className="bg-[#FFEEDB] dark:bg-[#FFEEDB]/10 border border-[#FFD2A1] dark:border-[#FFD2A1]/20 text-[#6B5A46] dark:text-[#FFD2A1] text-[11px] font-medium px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-sm text-center max-w-sm">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            For your security, do not share personal numbers or pay outside RozgaarHub.
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 z-10 flex flex-col gap-2">
          {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[75%] px-3 py-1.5 rounded-xl text-[15px] shadow-sm ${
                  isMe 
                    ? 'bg-[#E7FFDB] dark:bg-[#005C4B] rounded-tr-none text-gray-900 dark:text-[#E9EDEF]' 
                    : 'bg-white dark:bg-[#202C33] rounded-tl-none text-gray-900 dark:text-[#E9EDEF]'
                }`}>
                  <p className="pb-3 break-words pr-2">{msg.text}</p>
                  
                  {/* Time & Status */}
                  <div className="absolute right-1.5 bottom-1 flex items-center gap-1">
                    <span className={`text-[10px] ${isMe ? 'text-gray-500 dark:text-green-200/70' : 'text-gray-400 dark:text-[#8696A0]'}`}>
                      {msg.time}
                    </span>
                    {isMe && (
                      <span className="ml-0.5">
                        {msg.status === 'sent' && <Check className="w-3.5 h-3.5 text-gray-400 dark:text-green-200/70" />}
                        {msg.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-gray-400 dark:text-green-200/70" />}
                        {msg.status === 'read' && <CheckCheck className="w-3.5 h-3.5 text-blue-500 dark:text-[#53bdeb]" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator Example */}
          <div className="flex justify-start opacity-70">
            <div className="bg-white dark:bg-[#202C33] px-4 py-3 rounded-xl rounded-tl-none shadow-sm flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="min-h-[60px] bg-[#F0F2F5] dark:bg-[#202C33] px-4 py-3 flex items-end gap-3 z-10 shrink-0">
          <div className="flex items-center gap-3 pb-1 text-gray-500 dark:text-[#8696A0]">
            <button className="hover:text-gray-700 transition-colors"><Smile className="w-6 h-6" /></button>
            <button className="hover:text-gray-700 transition-colors"><Paperclip className="w-6 h-6" /></button>
            <button className="hover:text-gray-700 transition-colors"><Camera className="w-6 h-6" /></button>
          </div>
          
          <form onSubmit={handleSendMessage} className="flex-1">
            <input 
              type="text" 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message" 
              className="w-full bg-white dark:bg-[#2A3942] border-none rounded-xl px-4 py-3 text-[15px] focus:outline-none dark:text-[#E9EDEF] shadow-sm"
            />
          </form>
          
          <div className="pb-1">
            {messageInput ? (
              <button 
                onClick={handleSendMessage}
                className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button className="text-gray-500 dark:text-[#8696A0] hover:text-gray-700 transition-colors p-2">
                <Mic className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Contact Info (Toggleable) */}
      <AnimatePresence>
        {showContactInfo && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-gray-200 dark:border-zinc-800 bg-[#F0F2F5] dark:bg-[#0B141A] flex flex-col shrink-0 overflow-hidden"
          >
            <div className="h-16 px-4 bg-white dark:bg-[#202C33] flex items-center gap-4 shrink-0 shadow-sm">
              <button onClick={() => setShowContactInfo(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-gray-900 dark:text-[#E9EDEF]">Contact Info</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="bg-white dark:bg-[#202C33] p-6 flex flex-col items-center mb-2 shadow-sm">
                <img src={activeUser?.avatar || "https://i.pravatar.cc/150"} className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-gray-50 dark:border-zinc-800" alt="Profile" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-[#E9EDEF]">{activeUser?.name}</h2>
                <p className="text-gray-500 dark:text-[#8696A0]">Customer • Joined 2024</p>
                
                <div className="flex gap-4 w-full mt-6">
                  <button className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2A3942] transition-colors">
                    <Phone className="w-6 h-6 text-brand-amber mb-2" />
                    <span className="text-sm font-semibold dark:text-[#8696A0]">Call</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2A3942] transition-colors">
                    <MapPin className="w-6 h-6 text-emerald-500 mb-2" />
                    <span className="text-sm font-semibold dark:text-[#8696A0]">Location</span>
                  </button>
                  <button className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2A3942] transition-colors">
                    <Search className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="text-sm font-semibold dark:text-[#8696A0]">Search</span>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#202C33] p-4 mb-2 shadow-sm">
                <h4 className="text-xs font-bold text-gray-500 dark:text-[#8696A0] uppercase tracking-wider mb-4">About Job</h4>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-[#2A3942] rounded-lg">
                    <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-[#E9EDEF]">Booking #{activeUser?.bookingId}</p>
                    <p className="text-sm text-gray-500 dark:text-[#8696A0] mt-1">{activeUser?.bookingStatus}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#202C33] p-2 shadow-sm space-y-1">
                <button onClick={handleBlockUser} className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-50 dark:hover:bg-[#2A3942] font-semibold flex items-center gap-3 transition-colors">
                  <ShieldAlert className="w-5 h-5" /> Block {activeUser?.name}
                </button>
                <button onClick={handleReportUser} className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-50 dark:hover:bg-[#2A3942] font-semibold flex items-center gap-3 transition-colors">
                  <AlertTriangle className="w-5 h-5" /> Report User
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
