import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, TrendingUp, ArrowDownToLine, ArrowUpRight, 
  Clock, CheckCircle2, Building, Landmark, Plus, 
  CreditCard, ShieldCheck, Download, AlertCircle, ChevronRight, Award
} from 'lucide-react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function EarningsWallet() {
  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw' | 'history'>('overview');
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const [payoutMethod, setPayoutMethod] = useState('instant');
  
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          type: t.type === 'credit' ? 'Earnings' : 'Withdrawal',
          amount: t.amount,
          date: new Date(t.date).toLocaleString(),
          status: 'Success',
          icon: t.type === 'credit' ? ArrowUpRight : ArrowDownToLine,
          color: t.type === 'credit' ? 'text-green-500' : 'text-rose-500',
          bg: t.type === 'credit' ? 'bg-green-50 dark:bg-green-500/10' : 'bg-rose-50 dark:bg-rose-500/10'
        })).reverse();
        setTransactions(mappedTxns);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    
    if (Number(withdrawAmount) > wallet?.balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      const promise = api.post('/payments/withdraw', {
        amount: Number(withdrawAmount),
        bankAccountDetails: 'Default Saved Bank'
      });

      toast.promise(promise, {
        loading: 'Processing withdrawal request...',
        success: 'Withdrawal requested successfully!',
        error: 'Failed to process withdrawal'
      });

      const res = await promise;
      if (res.status === 200) {
        setWithdrawAmount('0');
        fetchWallet(); // refresh balance
        setActiveTab('history');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateTotal = (type: 'credit' | 'debit') => {
    if (!wallet || !wallet.transactions) return 0;
    return wallet.transactions
      .filter((t: any) => t.type === type)
      .reduce((sum: number, t: any) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Wallet Balance & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-indigo-700 dark:from-zinc-900 dark:to-zinc-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-indigo-200 dark:text-zinc-400 font-medium mb-1">Available to Withdraw</p>
              <h2 className="text-5xl font-black tracking-tight flex items-center gap-2">
                ₹{wallet?.balance || 0} <span className="text-xl font-medium text-indigo-300">.00</span>
              </h2>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-indigo-100">Pending: ₹0</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-indigo-100">Total Withdrawn: ₹{calculateTotal('debit')}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setActiveTab('withdraw')}
              className="bg-white text-indigo-900 dark:bg-brand-amber dark:text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-brand-orange transition-all shadow-md flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <ArrowDownToLine className="w-5 h-5" />
              Withdraw Now
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Active Rewards</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Top Performer Bonus</p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-500/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">Weekly Target: 8/10 Jobs</p>
            <div className="w-full bg-amber-200 dark:bg-amber-950 rounded-full h-2 mb-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-[10px] text-amber-700 dark:text-amber-500 font-bold uppercase tracking-wider">Complete 2 more jobs for ₹500 bonus</p>
          </div>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-2">Total Earnings</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">₹{calculateTotal('credit')}</p>
          <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Lifetime</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-2">Withdrawn</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">₹{calculateTotal('debit')}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-2">Current Balance</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">₹{wallet?.balance || 0}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950">
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider mb-2">Pending Escrow</p>
          <p className="text-2xl font-black text-brand-amber">₹0</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-zinc-800 pb-px mb-6 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Wallet Overview
        </button>
        <button 
          onClick={() => setActiveTab('withdraw')}
          className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 'withdraw' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Withdraw Funds
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 'history' ? 'border-brand-amber text-brand-amber' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Transaction History
        </button>
      </div>

      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Earnings Breakdown</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Booking #RZH24581</span>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">Paid</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                      <span>Customer Paid</span>
                      <span>₹1000</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>Platform Fee (5%)</span>
                      <span>-₹50</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800 flex justify-between font-bold text-gray-900 dark:text-white">
                      <span>Labour Earnings</span>
                      <span className="text-green-600">₹950</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="w-full py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                >
                  View All Earnings
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bank Accounts</h3>
                <button className="text-sm font-bold text-brand-amber flex items-center gap-1"><Plus className="w-4 h-4"/> Add New</button>
              </div>
              <div className="space-y-4">
                <div className="border border-brand-amber bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl relative">
                  <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Default</div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-sm">
                      <Landmark className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">State Bank of India</p>
                      <p className="text-xs text-gray-500">XXXX XXXX 4589</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Name: Vinay Kumar</p>
                </div>

                <div className="border border-gray-200 dark:border-zinc-800 p-4 rounded-2xl hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">UPI ID</p>
                      <p className="text-xs text-gray-500">vinay.work@ybl</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Tab */}
        {activeTab === 'withdraw' && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Withdraw Funds</h3>
            
            <div className="space-y-8">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">₹</span>
                  <input 
                    type="number" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-4 text-2xl font-black focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber text-gray-900 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 flex justify-between">
                  <span>Available: ₹{wallet?.balance || 0}</span>
                  <button className="text-indigo-600 font-bold hover:underline" onClick={() => setWithdrawAmount(wallet?.balance?.toString() || '0')}>Withdraw Max</button>
                </p>
              </div>

              {/* Payout Method */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-3">Settlement Speed</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'instant', title: 'Instant', time: 'Under 5 mins', fee: '₹10 fee' },
                    { id: 'daily', title: 'Daily', time: 'End of day', fee: 'Free' },
                    { id: 'weekly', title: 'Weekly', time: 'Every Monday', fee: 'Free' }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setPayoutMethod(method.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${payoutMethod === method.id ? 'border-brand-amber bg-amber-50/50 dark:bg-brand-amber/10' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 dark:text-white">{method.title}</span>
                        {payoutMethod === method.id && <CheckCircle2 className="w-5 h-5 text-brand-amber" />}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-zinc-400">{method.time}</p>
                      <p className={`text-xs font-bold mt-1 ${method.fee === 'Free' ? 'text-green-500' : 'text-rose-500'}`}>{method.fee}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="bg-gray-50 dark:bg-zinc-950 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400">
                  <span>Withdrawal Amount</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{withdrawAmount || '0'}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-zinc-400">
                  <span>Processing Fee</span>
                  <span className="font-medium text-rose-500">{payoutMethod === 'instant' ? '-₹10' : '₹0'}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">Final Amount to Bank</span>
                  <span className="text-2xl font-black text-green-600">
                    ₹{Math.max(0, parseInt(withdrawAmount || '0') - (payoutMethod === 'instant' ? 10 : 0))}
                  </span>
                </div>
              </div>

              <button onClick={handleWithdraw} className="w-full bg-brand-amber hover:bg-brand-orange text-white py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 shadow-lg shadow-brand-amber/20">
                <ShieldCheck className="w-5 h-5" />
                Confirm Withdrawal
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> OTP verification will be required on the next step
              </p>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h3>
              <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                <Download className="w-4 h-4" /> Download Statement
              </button>
            </div>
            
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {transactions.map((txn, index) => {
                const Icon = txn.icon;
                return (
                  <div key={index} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${txn.bg}`}>
                        <Icon className={`w-6 h-6 ${txn.color}`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{txn.type}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{txn.date}</p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{txn.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${txn.type === 'Withdrawal' ? 'text-gray-900 dark:text-white' : 'text-green-600'}`}>
                        {txn.type === 'Withdrawal' ? '-' : '+'}₹{txn.amount}
                      </p>
                      <p className="text-xs font-bold text-green-600 mt-1">{txn.status}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-zinc-950 text-center border-t border-gray-100 dark:border-zinc-800">
              <button className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white">Load More Transactions</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
