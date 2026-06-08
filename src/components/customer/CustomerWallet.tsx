import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Plus, ArrowUpRight, ArrowDownRight, 
  Gift, ShieldCheck, History, CreditCard, 
  Landmark, AlertCircle, RefreshCw, Smartphone, Search, Filter
} from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

type TxnType = 'added' | 'payment' | 'refund' | 'reward';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-RW20455', type: 'reward', amount: '+₹100', date: 'Today, 10:30 AM', status: 'Success', desc: 'Booking Cashback' },
  { id: 'TXN-RW20454', type: 'refund', amount: '+₹900', date: '21 May 2026', status: 'Success', desc: 'Booking Cancellation Refund' },
  { id: 'TXN-RW20453', type: 'payment', amount: '-₹750', date: '19 May 2026', status: 'Success', desc: 'Paid to Plumber' },
  { id: 'TXN-RW20452', type: 'added', amount: '+₹1000', date: '15 May 2026', status: 'Success', desc: 'Added from UPI' },
  { id: 'TXN-RW20451', type: 'payment', amount: '-₹450', date: '10 May 2026', status: 'Failed', desc: 'Paid to Electrician' },
];

export default function CustomerWallet() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add'>('dashboard');
  const [filter, setFilter] = useState<'all' | TxnType>('all');
  
  // Wallet State
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>(MOCK_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Add Money State
  const [addAmount, setAddAmount] = useState('1000');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  React.useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/payments/wallet');
      if (res.data?.success) {
        setWallet(res.data.wallet);
        // Map backend transactions to frontend shape
        const mappedTxns = res.data.wallet.transactions.map((t: any) => ({
          id: t._id || t.referenceId || `TXN-${Math.floor(Math.random()*10000)}`,
          type: t.type === 'credit' ? 'added' : 'payment',
          amount: `${t.type === 'credit' ? '+' : '-'}₹${t.amount}`,
          date: new Date(t.date).toLocaleString(),
          status: 'Success',
          desc: t.description || 'Transaction',
          rawType: t.type
        })).reverse(); // newest first
        setTransactions(mappedTxns);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load wallet data');
      setTransactions(MOCK_TRANSACTIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtp(true);
  };

  const verifyOtp = async () => {
    if (otp.length === 4) {
      const promise = api.post('/payments/verify', {
        amount: addAmount,
        razorpay_order_id: 'mock_order_123',
        razorpay_payment_id: 'mock_payment_123',
        razorpay_signature: 'mock_sig'
      });

      toast.promise(promise, {
        loading: 'Processing payment securely...',
        success: `₹${addAmount} added to wallet successfully!`,
        error: 'Failed to process payment'
      });

      try {
        await promise;
        setShowOtp(false);
        setAddAmount('');
        setOtp('');
        fetchWallet(); // refresh balance
        setActiveTab('dashboard');
      } catch (err) {
        console.error(err);
      }
    } else {
      toast.error("Invalid OTP");
    }
  };

  const getTxnIcon = (type: string) => {
    switch(type) {
      case 'added': return <ArrowDownRight className="w-5 h-5 text-green-500" />;
      case 'payment': return <ArrowUpRight className="w-5 h-5 text-rose-500" />;
      case 'refund': return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'reward': return <Gift className="w-5 h-5 text-purple-500" />;
      default: return <Wallet className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTxnColor = (type: string, status: string) => {
    if (status === 'Failed') return 'text-gray-500';
    if (type === 'payment' || type === 'debit') return 'text-rose-600 dark:text-rose-400';
    return 'text-green-600 dark:text-green-400';
  };

  const filteredTxns = transactions.filter(t => filter === 'all' || t.type === filter);

  const calculateTotal = (type: 'credit' | 'debit') => {
    if (!wallet || !wallet.transactions) return 0;
    return wallet.transactions
      .filter((t: any) => t.type === type)
      .reduce((sum: number, t: any) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">RozgaarPay Wallet</h2>
          <p className="text-sm text-gray-500 mt-1">Manage payments, refunds, and rewards securely.</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-950/50 px-2 py-1 rounded-md">
          <ShieldCheck className="w-4 h-4" /> Secure
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-zinc-800">
        <button onClick={() => setActiveTab('dashboard')} className={`font-semibold pb-3 border-b-2 px-2 transition-all ${activeTab === 'dashboard' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('history')} className={`font-semibold pb-3 border-b-2 px-2 transition-all ${activeTab === 'history' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Transactions</button>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Main Wallet Card */}
          <div className="bg-gradient-to-br from-brand-amber to-brand-orange p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-brand-amber/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              <div>
                <p className="text-white/80 font-semibold uppercase tracking-wider text-sm flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5" /> Current Balance
                </p>
                <h1 className="text-5xl font-black tracking-tight">₹{wallet?.balance || 0}<span className="text-2xl text-white/70 font-bold">.00</span></h1>
                <p className="text-sm mt-3 flex items-center gap-1.5 bg-black/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                  <Gift className="w-4 h-4" /> 350 Reward Points Available
                </p>
              </div>

              <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                <button onClick={() => setActiveTab('add')} className="flex-1 sm:w-full bg-white text-brand-amber hover:bg-gray-50 font-black py-3 px-6 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add Money
                </button>
                <button onClick={() => setActiveTab('history')} className="flex-1 sm:w-full bg-black/20 hover:bg-black/30 text-white font-bold py-3 px-6 rounded-xl backdrop-blur-sm transition-colors flex items-center justify-center gap-2">
                  <History className="w-5 h-5" /> History
                </button>
              </div>

            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 text-green-600 rounded-full flex items-center justify-center"><ArrowDownRight className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Added</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">₹{calculateTotal('credit')}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/30 text-rose-600 rounded-full flex items-center justify-center"><ArrowUpRight className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Spent</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">₹{calculateTotal('debit')}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 text-blue-600 rounded-full flex items-center justify-center"><RefreshCw className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Refunds Received</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">₹1,200</p>
              </div>
            </div>
          </div>

          {/* Mixed Payment Preview (Educational) */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-400">Did you know you can split payments?</h4>
              <p className="text-sm text-blue-800/80 dark:text-blue-300/80 mt-1">If your booking is ₹1000 and wallet balance is ₹400, you can pay ₹400 from wallet and remaining ₹600 online seamlessly during checkout.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSACTIONS HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by TXN ID..." className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-brand-amber" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {(['all', 'added', 'payment', 'refund', 'reward'] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-brand-amber text-white' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-50'}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            {filteredTxns.map((txn, idx) => (
              <div key={txn.id} className={`p-4 sm:p-5 flex items-center justify-between gap-4 ${idx !== filteredTxns.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${txn.type === 'payment' ? 'bg-rose-50 dark:bg-rose-950/30' : txn.type === 'added' ? 'bg-green-50 dark:bg-green-950/30' : txn.type === 'refund' ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-purple-50 dark:bg-purple-950/30'}`}>
                    {getTxnIcon(txn.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{txn.desc}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{txn.id}</span>
                      <span className="text-xs text-gray-400">• {txn.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-lg ${getTxnColor(txn.type, txn.status)}`}>{txn.amount}</p>
                  <p className={`text-xs font-bold mt-0.5 ${txn.status === 'Success' ? 'text-green-500' : 'text-gray-400'}`}>{txn.status}</p>
                </div>
              </div>
            ))}
            {filteredTxns.length === 0 && (
              <div className="p-12 text-center text-gray-500">No transactions found for this filter.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ADD MONEY */}
      {activeTab === 'add' && (
        <div className="max-w-xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Money to Wallet</h3>

            {!showOtp ? (
              <form onSubmit={handleAddMoney} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Amount to Add</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">₹</span>
                    <input 
                      type="number" 
                      required
                      value={addAmount}
                      onChange={e => setAddAmount(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-2xl font-black text-gray-900 dark:text-white outline-none focus:border-brand-amber transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['100', '500', '1000', '2000'].map(amt => (
                    <button 
                      key={amt} 
                      type="button"
                      onClick={() => setAddAmount(amt)}
                      className="px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold text-gray-700 dark:text-zinc-300 hover:bg-brand-amber/10 hover:border-brand-amber hover:text-brand-amber transition-colors"
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block mt-6">Payment Method</label>
                  <div className="space-y-3">
                    
                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-brand-amber bg-brand-amber/5' : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 accent-brand-amber" />
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0"><Smartphone className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">UPI Apps</h4>
                        <p className="text-xs text-gray-500">GPay, PhonePe, Paytm</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-brand-amber bg-brand-amber/5' : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 accent-brand-amber" />
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0"><CreditCard className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Debit / Credit Card</h4>
                        <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'net' ? 'border-brand-amber bg-brand-amber/5' : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
                      <input type="radio" name="payment" value="net" checked={paymentMethod === 'net'} onChange={() => setPaymentMethod('net')} className="w-5 h-5 accent-brand-amber" />
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0"><Landmark className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Net Banking</h4>
                        <p className="text-xs text-gray-500">All Indian Banks Supported</p>
                      </div>
                    </label>

                  </div>
                </div>

                <button type="submit" disabled={!addAmount || addAmount === '0'} className="w-full py-4 bg-brand-amber hover:bg-brand-orange disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg shadow-brand-amber/30 transition-all text-lg tracking-wide">
                  Proceed to Pay ₹{addAmount}
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-brand-amber/10 text-brand-amber rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Secure Bank Verification</h4>
                  <p className="text-sm text-gray-500 mt-2">Enter the 4-digit OTP sent to your registered mobile number to add ₹{addAmount}.</p>
                </div>
                
                <div>
                  <input 
                    type="text" 
                    maxLength={4}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="• • • •"
                    className="w-full text-center tracking-[1em] bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl py-4 text-3xl font-black text-gray-900 dark:text-white outline-none focus:border-brand-amber transition-colors"
                  />
                </div>

                <button onClick={verifyOtp} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-500/30 transition-all text-lg tracking-wide">
                  Verify & Add Money
                </button>
                <button onClick={() => setShowOtp(false)} className="w-full py-3 bg-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold text-sm transition-colors">
                  Cancel
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
