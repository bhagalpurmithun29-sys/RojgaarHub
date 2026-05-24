'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'earnings' | 'withdraw' | 'refund';
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}

export default function WalletPaymentsDashboard() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  // Mode selection: Customer view vs Labour Worker view
  const [userRole, setUserRole] = useState<'customer' | 'labour'>('customer');

  // Customer Wallet State
  const [customerBalance, setCustomerBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rozgaar_wallet_balance');
      return saved ? Number(saved) : 1500;
    }
    return 1500;
  });

  // Sync to localStorage
  useState(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rozgaar_wallet_balance', customerBalance.toString());
    }
  });

  const updateCustomerBalance = (newBalance: number) => {
    setCustomerBalance(newBalance);
    localStorage.setItem('rozgaar_wallet_balance', newBalance.toString());
  };

  const [addAmount, setAddAmount] = useState<string>('500');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [customerTransactions, setCustomerTransactions] = useState<Transaction[]>([
    { id: 't1', type: 'deposit', amount: 1000, date: '2026-05-19', status: 'Completed', description: 'Added money via UPI' },
    { id: 't2', type: 'payment', amount: 450, date: '2026-05-18', status: 'Completed', description: 'Paid Electrician Ramesh Kumar' },
  ]);

  // Labour Wallet State
  const [labourEarnings, setLabourEarnings] = useState<number>(4200);
  const [payoutSchedule, setPayoutSchedule] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('1000');
  const [labourTransactions, setLabourTransactions] = useState<Transaction[]>([
    { id: 't3', type: 'earnings', amount: 800, date: '2026-05-19', status: 'Completed', description: 'Earnings from Plumber job' },
    { id: 't4', type: 'withdraw', amount: 1500, date: '2026-05-17', status: 'Completed', description: 'Withdrawn to SBI Bank Account' },
  ]);

  // Refund Simulation state
  const [refundSource, setRefundSource] = useState<'labour_cancel' | 'customer_cancel'>('labour_cancel');
  const [refundDestination, setRefundDestination] = useState<'wallet' | 'bank'>('wallet');
  const [baseJobCost, setBaseJobCost] = useState<number>(500);

  // Commission Mixed Model Calculator
  // Customer commission details
  const customerPlatformFee = 49;
  const customerTaxRate = 0.18; // 18% GST
  const customerTax = Math.round((baseJobCost + customerPlatformFee) * customerTaxRate);
  const customerTotal = baseJobCost + customerPlatformFee + customerTax;

  // Labour commission details
  const labourCommissionRate = 0.15; // 15% Platform deduction
  const labourCommission = Math.round(baseJobCost * labourCommissionRate);
  const labourPayout = baseJobCost - labourCommission;

  // Handle customer wallet deposit
  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(addAmount);
    if (isNaN(amount) || amount <= 0) return;

    updateCustomerBalance(customerBalance + amount);
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      description: `Added money via ${paymentMethod === 'online' ? 'Online Payment (UPI/Card)' : 'Cash Deposit counter'}`
    };
    setCustomerTransactions(prev => [newTx, ...prev]);
    setAddAmount('500');
    alert(`💰 ₹${amount} successfully added to your Customer Wallet!`);
  };

  // Handle labour earnings withdraw
  const handleWithdrawEarnings = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > labourEarnings) {
      alert('❌ Error: Insufficient earnings balance for withdrawal!');
      return;
    }

    setLabourEarnings(prev => prev - amount);
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdraw',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      description: `Withdrawn to Bank via ${payoutSchedule.toUpperCase()} payout scheduling`
    };
    setLabourTransactions(prev => [newTx, ...prev]);
    setWithdrawAmount('');
    alert(`💸 Payout of ₹${amount} initiated! Schedule: ${payoutSchedule.toUpperCase()}.`);
  };

  // Run Refund Simulation
  const handleTriggerRefund = () => {
    let refundAmount = 0;
    let description = '';

    if (refundSource === 'labour_cancel') {
      // Full Refund
      refundAmount = customerTotal;
      description = 'Full Refund: Booking cancelled by Labour Pro';
    } else {
      // Customer Cancel -> Penalty deduction (e.g. 10% penalty)
      const penalty = Math.round(customerTotal * 0.10);
      refundAmount = customerTotal - penalty;
      description = `Refund: Cancelled by Customer (₹${penalty} Penalty deducted)`;
    }

    // Add back to customer balance if refund to wallet
    if (refundDestination === 'wallet') {
      updateCustomerBalance(customerBalance + refundAmount);
    }

    const refundTx: Transaction = {
      id: `ref_${Date.now()}`,
      type: 'refund',
      amount: refundAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      description: `${description} -> Refunded to ${refundDestination.toUpperCase()}`
    };

    setCustomerTransactions(prev => [refundTx, ...prev]);
    alert(`🔄 Refund Successful! Amount: ₹${refundAmount} credited to your ${refundDestination.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 transition-colors duration-300">
      
      {/* Navigation header */}
      <div className="max-w-7xl mx-auto mb-4 flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payments & Commissions Hub</span>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Page Banner Title */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Wallet & Transparent Commission Engine</h1>
            <p className="text-xs text-gray-555 dark:text-zinc-400 mt-1">
              Dual interface for customer wallet deposits, labour withdraw logs, instant payout configurations and penalty-based refunds.
            </p>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-xl border border-gray-200 dark:border-zinc-700">
            <button
              onClick={() => setUserRole('customer')}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                userRole === 'customer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-zinc-450 hover:text-indigo-600'
              }`}
            >
              Customer Hub
            </button>
            <button
              onClick={() => setUserRole('labour')}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                userRole === 'labour'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-zinc-450 hover:text-indigo-600'
              }`}
            >
              Labour Pro Portal
            </button>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Wallet actions based on selected role */}
          <div className="lg:col-span-2 space-y-6">
            
            {userRole === 'customer' ? (
              /* CUSTOMER WALLET INTERFACE */
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">👤 Customer Digital Wallet</h2>
                  <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded uppercase dark:bg-green-950/20 dark:text-green-400">
                    UPI & Cash Supported
                  </span>
                </div>

                {/* Balance display */}
                <div className="bg-indigo-600 text-white rounded-2xl p-6 flex justify-between items-center shadow-lg shadow-indigo-600/10">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">Customer Wallet Balance</span>
                    <h3 className="text-3xl font-extrabold font-mono">₹{customerBalance}</h3>
                  </div>
                  <span className="text-3xl">🏦</span>
                </div>

                {/* Add money form */}
                <form onSubmit={handleAddMoney} className="space-y-4 border-t border-gray-100 dark:border-zinc-850 pt-4">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-300">Add Money instantly</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-2">Select Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as 'online' | 'cash')}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2.5 text-xs text-gray-900 dark:text-white"
                      >
                        <option value="online">Online Payment (UPI/Card)</option>
                        <option value="cash">Cash Payment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-2">Enter Amount (INR)</label>
                      <input 
                        type="number" 
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs"
                      >
                        Add to Wallet
                      </button>
                    </div>
                  </div>
                </form>

                {/* Transaction history */}
                <div className="space-y-3 border-t border-gray-100 dark:border-zinc-850 pt-4">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-300">Customer Transaction History</h4>
                  
                  <div className="space-y-2">
                    {customerTransactions.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center text-xs p-3 bg-gray-50 dark:bg-zinc-950/50 rounded-xl border border-gray-100 dark:border-zinc-850">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{tx.description}</p>
                          <span className="text-[9px] text-gray-400">{tx.date} | Status: {tx.status}</span>
                        </div>
                        <span className={`font-bold font-mono ${tx.type === 'deposit' || tx.type === 'refund' ? 'text-green-650' : 'text-red-500'}`}>
                          {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'} ₹{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* LABOUR WALLET INTERFACE */
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">🔧 Labour Earnings Wallet</h2>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded uppercase dark:bg-green-950/20 dark:text-green-400">
                    Payout Approved
                  </span>
                </div>

                {/* Earnings display */}
                <div className="bg-indigo-650 text-white rounded-2xl p-6 flex justify-between items-center shadow-lg shadow-indigo-600/10">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">Total Net Earnings Balance</span>
                    <h3 className="text-3xl font-extrabold font-mono">₹{labourEarnings}</h3>
                  </div>
                  <span className="text-3xl">🛵</span>
                </div>

                {/* Withdraw form */}
                <form onSubmit={handleWithdrawEarnings} className="space-y-4 border-t border-gray-100 dark:border-zinc-850 pt-4">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-300">Request Withdraw / Final Payout</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-2">Payout Schedule Speed</label>
                      <select
                        value={payoutSchedule}
                        onChange={(e) => setPayoutSchedule(e.target.value as 'instant' | 'daily' | 'weekly')}
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2.5 text-xs text-gray-900 dark:text-white"
                      >
                        <option value="instant">Instant Transfer (Under 5 mins)</option>
                        <option value="daily">Daily Bank payout batch</option>
                        <option value="weekly">Weekly scheduling (Friday payout)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-2">Withdraw Amount (INR)</label>
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="e.g. 1000"
                        className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs"
                      >
                        Initiate Payout
                      </button>
                    </div>
                  </div>
                </form>

                {/* Earnings history */}
                <div className="space-y-3 border-t border-gray-100 dark:border-zinc-850 pt-4">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-zinc-300">Earnings & Withdrawals History</h4>
                  
                  <div className="space-y-2">
                    {labourTransactions.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center text-xs p-3 bg-gray-50 dark:bg-zinc-950/50 rounded-xl border border-gray-100 dark:border-zinc-850">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{tx.description}</p>
                          <span className="text-[9px] text-gray-400">{tx.date} | Status: {tx.status}</span>
                        </div>
                        <span className={`font-bold font-mono ${tx.type === 'earnings' ? 'text-green-650' : 'text-red-500'}`}>
                          {tx.type === 'earnings' ? '+' : '-'} ₹{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Live commission model preview */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md space-y-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">📊 Mixed Model Commission Breakdown</h2>
              <p className="text-xs text-gray-500">
                Adjust base job rates dynamically to preview customer taxes & labor platform deductions instantly:
              </p>

              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-700 dark:text-zinc-350">Base Labour Cost (₹):</span>
                <input 
                  type="number" 
                  value={baseJobCost}
                  onChange={(e) => setBaseJobCost(Number(e.target.value))}
                  className="rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-1.5 text-xs text-gray-900 dark:text-white font-bold w-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-zinc-850">
                {/* Customer display breakdown */}
                <div className="bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-850 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Customer View invoice</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-550">Labour Fee:</span>
                      <span className="font-bold font-mono">₹{baseJobCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-550">Platform Fee:</span>
                      <span className="font-bold font-mono">₹{customerPlatformFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-550">Taxes (18% GST):</span>
                      <span className="font-bold font-mono">₹{customerTax}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-zinc-800 pt-2 text-indigo-650 dark:text-indigo-400 font-bold">
                      <span>Total Invoice:</span>
                      <span className="font-mono">₹{customerTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Labour display breakdown */}
                <div className="bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-850 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Labour view earnings split</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-550">Gross Earnings:</span>
                      <span className="font-bold font-mono">₹{baseJobCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-550">Platform Commission (15%):</span>
                      <span className="font-bold text-red-500 font-mono">- ₹{labourCommission}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-zinc-800 pt-2 text-green-650 font-bold">
                      <span>Final Net Payout:</span>
                      <span className="font-mono">₹{labourPayout}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3: Live Refund Simulator settings */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-zinc-850">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Refund Simulator</span>
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
              </div>

              {/* Refund parameters */}
              <div className="space-y-4 text-xs">
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">1. Cancellation Source</label>
                  <select
                    value={refundSource}
                    onChange={(e) => setRefundSource(e.target.value as 'labour_cancel' | 'customer_cancel')}
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="labour_cancel">Labour Cancels (Full 100% Refund)</option>
                    <option value="customer_cancel">Customer Cancels (10% Penalty deduction)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">2. Refund Destination</label>
                  <select
                    value={refundDestination}
                    onChange={(e) => setRefundDestination(e.target.value as 'wallet' | 'bank')}
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="wallet">Refund to digital Wallet</option>
                    <option value="bank">Refund to Bank account</option>
                  </select>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-850 space-y-2">
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Calculated Return:</span>
                  <div className="flex justify-between font-bold">
                    <span>Est Refund Credit:</span>
                    <span className="font-mono text-green-650">
                      ₹{refundSource === 'labour_cancel' ? customerTotal : customerTotal - Math.round(customerTotal * 0.10)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleTriggerRefund}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-indigo-500/10"
                >
                  Trigger Simulated Refund
                </button>

              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
