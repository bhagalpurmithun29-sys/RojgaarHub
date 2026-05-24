'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnomalyLog {
  id: string;
  type: string;
  severity: 'LOW' | 'ELEVATED' | 'CRITICAL';
  timestamp: string;
  description: string;
}

export default function AISecurityDashboard() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  // Trust & Risk Engine State
  const [trustScore, setTrustScore] = useState<number>(68);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'ELEVATED' | 'CRITICAL'>('LOW');
  const [kycVerified, setKycVerified] = useState(false);
  const [suspiciousFlags, setSuspiciousFlags] = useState<string[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([
    { id: 'ANM-101', type: 'IP Deviation', severity: 'LOW', timestamp: '2026-05-20 04:12', description: 'User signed in from standard mobile location.' }
  ]);

  // Fraud Chat Scanner Simulator
  const [chatInput, setChatInput] = useState('');
  const [chatAnalysisLogs, setChatAnalysisLogs] = useState<string[]>([]);
  const [isMessageFlagged, setIsMessageFlagged] = useState(false);

  // Fake Account Auditor Details
  const [emailAddress, setEmailAddress] = useState('user.verma@temp-mail.org');
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [profilePhotoStatus, setProfilePhotoStatus] = useState<'Generic Avatar' | 'Face Match Passed'>('Generic Avatar');

  // Sync with LocalStorage on Mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('rozgaar_security_profile');
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
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
    } else {
      // Initialize default security state
      updateSecurityState(68, 'LOW', false, [], [
        { id: 'ANM-101', type: 'IP Deviation', severity: 'LOW', timestamp: '04:12 AM', description: 'Standard mobile IP address mapping registered.' }
      ], 'user.verma@temp-mail.org', 'Generic Avatar');
    }
  }, []);

  // Save Security parameters to localStorage
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

    // Trigger update payload for Admin review logs
    localStorage.setItem('rozgaar_admin_security_alert', JSON.stringify({
      score,
      risk,
      flags,
      kyc,
      timestamp: new Date().toLocaleTimeString(),
      email
    }));
  };

  // Simulated Aadhaar Document verification
  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert('🔒 Secured Upload Channel active! Scanning Government signature metadata, validating Aadhaar biometric signature hashes...');
      
      setTimeout(() => {
        const newLogs = [
          { id: 'ANM-' + Math.floor(100 + Math.random() * 900), type: 'Aadhaar Biometric Checked', severity: 'LOW' as const, timestamp: 'Just now', description: 'KYC verified successfully against government vault.' },
          ...anomalies
        ];
        
        // Remove 'Temp Mail' warning if active
        const newFlags = suspiciousFlags.filter(f => f !== 'Disposable Domain Blocked');
        
        updateSecurityState(
          100, // Trust Score skyrockets to maximum!
          'LOW',
          true,
          newFlags,
          newLogs,
          'user.verma@gmail.com', // Automatically switches to premium trusted email
          'Face Match Passed'     // Avatar validated
        );
        alert('🎉 Aadhaar KYC Verified! Trust score set to 100/100. Verification Crown badge awarded.');
      }, 1500);
    }
  };

  // Fraud Sentiment & Text analysis handler
  const handleChatTextChange = (text: string) => {
    setChatInput(text);
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

  // Booking Anomaly Simulator Triggers
  const triggerBookingSpike = () => {
    alert('⚡ Simulating bot pattern: Triggering 5 booking requests in 2 seconds across duplicate categories...');
    
    setTimeout(() => {
      const nextLogs = [
        { id: 'ANM-402', type: 'Rapid Booking Spike', severity: 'CRITICAL' as const, timestamp: 'Just now', description: '5 bookings/2s exceeded max frequency throttle.' },
        ...anomalies
      ];
      
      const newFlags = Array.from(new Set([...suspiciousFlags, 'High-Frequency Bot Booking Pattern']));
      
      updateSecurityState(
        34, // Drop Trust Score heavily
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
        50, // Elevated risk
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

  // Mask flagged spam in real-time
  const getScrubbedText = () => {
    let text = chatInput;
    const targets = ['otp', 'offline', 'advance cash', 'upipayout', 'upi.org'];
    targets.forEach(word => {
      const regex = new RegExp(word, 'gi');
      text = text.replace(regex, '****[FLAGGED FRUAD/SPAM WORD]****');
    });
    return text;
  };

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-all duration-500 bg-gray-50 dark:bg-zinc-950`}>
      
      {riskLevel === 'CRITICAL' && (
        <div className="fixed inset-0 pointer-events-none border-[12px] border-red-600/50 animate-pulse z-50"></div>
      )}

      {/* Header Info */}
      <div className="max-w-7xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          {riskLevel === 'CRITICAL' && <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping"></span>}
          <span>Rozgaar Shield AI Security Center</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP PANEL: METRICS & SCOREBOARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trust Meter dial card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 text-center relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-green-500"></div>
            
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">AI Trustworthiness Score</h3>
              <p className="text-[10px] text-gray-500">Evaluates KYC verification status, review logs, and cancellation behaviors.</p>
            </div>

            {/* Circular score dial representation */}
            <div className="my-8 flex flex-col items-center justify-center relative">
              <div className="h-32 w-32 rounded-full border-8 border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center relative">
                <span className="text-4xl font-black text-gray-900 dark:text-white font-mono">{trustScore}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">/ 100</span>
                
                {/* Radial progress ring */}
                <div 
                  className={`absolute inset-0 rounded-full border-8 transition-all duration-700 pointer-events-none ${
                    trustScore === 100 ? 'border-emerald-500' :
                    trustScore >= 60 ? 'border-amber-500' : 'border-red-500'
                  }`}
                  style={{ clipPath: `polygon(50% 50%, -50% -50%, ${trustScore}% -50%, ${trustScore}% 150%, -50% 150%)` }}
                ></div>
              </div>
            </div>

            <div>
              <span className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider block ${
                trustScore === 100 ? 'bg-green-100 text-green-700' :
                trustScore >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-750'
              }`}>
                {trustScore === 100 ? '👑 Premium Trusted User' :
                 trustScore >= 60 ? '⚡ Basic Verified Profile' : '⚠️ Suspicious Account Flagged'}
              </span>
            </div>
          </div>

          {/* Risk Level gauge card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider mb-1">Security Risk index</h3>
              <p className="text-[10px] text-gray-500">Identifies system anomalies, geographic VPN deviations, and duplicate bookings.</p>
            </div>

            <div className="space-y-4 my-6">
              <div className="flex justify-between items-center text-xs font-bold border-b border-gray-100 dark:border-zinc-850 pb-2">
                <span>Account Standing:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  riskLevel === 'LOW' ? 'bg-green-100 text-green-700' :
                  riskLevel === 'ELEVATED' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-750 animate-pulse'
                }`}>
                  {riskLevel} RISK INDEX
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active System Flags:</span>
                {suspiciousFlags.length === 0 ? (
                  <p className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    ✓ Clean standing status (No active warnings)
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {suspiciousFlags.map((flag, idx) => (
                      <span key={idx} className="bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 text-[9px] font-bold px-2.5 py-1 rounded-lg border border-red-200/50">
                        🚨 {flag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Link href="/admin" className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-xs text-center py-2.5 rounded-xl flex-1 transition-all">
                Admin Panel Check
              </Link>
              <button 
                onClick={resetAnomalyScore}
                className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-700 dark:text-zinc-300 font-bold text-xs py-2.5 rounded-xl flex-1 transition-all border border-gray-200 dark:border-zinc-700"
              >
                Reset Metrics ✓
              </button>
            </div>
          </div>

          {/* Fake Account Auditor dashboard */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider mb-1">Fake Account Inspector</h3>
              <p className="text-[10px] text-gray-500">Audits user credentials for disposable spam mailers and mismatched telemetry.</p>
            </div>

            <div className="space-y-3.5 my-4 text-xs font-semibold text-gray-700 dark:text-zinc-300">
              <div className="flex justify-between">
                <span>Email Registry:</span>
                <span className="font-mono text-gray-900 dark:text-white">{emailAddress}</span>
              </div>
              <div className="flex justify-between">
                <span>Domain Trust Score:</span>
                <span className={emailAddress.includes('temp-mail.org') ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>
                  {emailAddress.includes('temp-mail.org') ? '⚠️ Suspicious (0%)' : '✓ Verified (100%)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phone Binding:</span>
                <span className="text-green-600 font-bold">✓ Active (+91 OTP Verified)</span>
              </div>
              <div className="flex justify-between">
                <span>Biometric Face Match:</span>
                <span className={profilePhotoStatus === 'Generic Avatar' ? 'text-amber-500 font-bold' : 'text-green-600 font-bold'}>
                  {profilePhotoStatus === 'Generic Avatar' ? '⚠️ Missing Identity Photo' : '✓ face_match_passed.png'}
                </span>
              </div>
            </div>

            {/* Gov Aadhaar verification upload triggers */}
            <div className="border-t border-gray-100 dark:border-zinc-850 pt-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                🔒 Secure Govt ID Aadhaar Verification
              </label>
              
              {kycVerified ? (
                <div className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 p-3 rounded-2xl text-[10px] font-bold border border-green-200 flex justify-between items-center">
                  <span>✓ IDENTITY KYC VERIFICATION COMPLETE</span>
                  <span>🥇 Verified Icon active</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    id="aadhaar-upload"
                    accept="image/*,application/pdf"
                    onChange={handleAadhaarUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="aadhaar-upload"
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center py-2.5 rounded-xl flex-1 transition-all shadow shadow-indigo-500/10"
                  >
                    Upload Mock Aadhaar Card / PDF +
                  </label>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM PANEL: SIMULATION DASHBOARDS (2 Cols Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* FRUAD & SPAM NATURAL LANGUAGE CHAT SCANNER */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>💬 Natural Language Fraud & Spam Detector</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-md">LIVE ANALYSIS</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Simulates real-time scans on chat messages to flag OTP hijacks or offline payment scams.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Type inside the chat box to test AI scanning response:
                </label>
                <textarea
                  rows={3}
                  value={chatInput}
                  onChange={(e) => handleChatTextChange(e.target.value)}
                  placeholder="e.g., 'Hey send me your phone verification OTP code' or 'Let's skip the app and do direct payment offline cash'"
                  className="w-full bg-gray-50 dark:bg-zinc-950 text-xs rounded-2xl border border-gray-300 dark:border-zinc-700 px-4 py-3.5 text-gray-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* Suggestions pills */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Test prompts:</span>
                <button 
                  onClick={() => handleChatTextChange('Can you share the booking confirmation OTP with me right now?')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 text-[10px] px-2.5 py-1 rounded-lg"
                >
                  "OTP request"
                </button>
                <button 
                  onClick={() => handleChatTextChange('Cancel this service booking immediately and pay me advance offline cash at upipayout.com link')}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 text-[10px] px-2.5 py-1 rounded-lg"
                >
                  "Payment Bypass Link"
                </button>
              </div>

              {/* Analysis outcome overlay */}
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-850">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Real-time scan logs</span>
                
                {isMessageFlagged ? (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 p-4 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-red-750 block animate-pulse">
                      🚨 AI SECURITY WARNING: MALICIOUS CONTENT FLAGGED
                    </span>
                    
                    <div className="text-[10px] text-gray-600 dark:text-zinc-350 space-y-1 font-semibold">
                      {chatAnalysisLogs.map((log, idx) => (
                        <p key={idx} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                          <span>{log}</span>
                        </p>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-red-200/50">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase">Auto-Scrubbed message output preview:</span>
                      <p className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg text-xs font-mono text-gray-700 dark:text-zinc-300 mt-1">
                        {getScrubbedText()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      🛡️ MESSAGE SCAN PASSED: CLEAN CONTEXT VERIFIED
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">No scam indicators, phishing URLs, or social engineering targets discovered.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUSPICIOUS BOOKING PATTERNS SIMULATOR */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-gray-150 dark:border-zinc-800/80 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🤖 Suspicious Booking Patterns Analyzer</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-600 text-white rounded-md">SIMULATOR</span>
              </h3>
              <p className="text-xs text-gray-505 mt-1">Simulates anomalies like rapid multi-category parallel requests or geographic delta mismatches.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={triggerBookingSpike}
                className="bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 block transition-transform">⚡</span>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">Trigger Rapid Bookings Spike</h4>
                <p className="text-[10px] text-gray-400">Simulate bot-like parallel booking creation rate anomalies.</p>
              </button>

              <button
                onClick={triggerCashDeviation}
                className="bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 block transition-transform">📍</span>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">IP / Out-of-Area Deviation</h4>
                <p className="text-[10px] text-gray-400">Simulate geographic request origin anomalies &gt; 1200km range.</p>
              </button>
            </div>

            {/* Active Anomaly streams logs list */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Security Telemetry Auditing Logs</span>
              
              <div className="h-44 bg-zinc-955 dark:bg-zinc-950 p-4 rounded-2xl font-mono text-[9px] overflow-y-auto space-y-2 shadow-inner border border-gray-200 dark:border-zinc-850">
                {anomalies.map((log) => (
                  <div key={log.id} className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-850 pb-1.5">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase mr-1.5 ${
                        log.severity === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' :
                        log.severity === 'ELEVATED' ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-gray-450'
                      }`}>
                        {log.severity}
                      </span>
                      <span className="text-gray-900 dark:text-white font-bold">{log.type}:</span>
                      <p className="text-gray-500 mt-0.5">{log.description}</p>
                    </div>
                    <span className="text-gray-400 font-bold whitespace-nowrap">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
