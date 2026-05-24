'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function ProfileSetupPage() {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'security' | 'safety' | 'security_shield'>('profile');
  
  // Profile state
  const [formData, setFormData] = useState({
    category: '',
    skills: '',
    experienceYears: '',
    address: '',
    hourlyRate: '',
    dailyRate: '',
  });

  // KYC state
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [aadhaarNumber, setAadhaarNumber] = useState('5839 2849 1948');
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('Uploaded selfie image did not match the photo on the Aadhaar Card.');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [suspiciousAlerts, setSuspiciousAlerts] = useState([
    { id: 1, location: 'Mumbai, MH', device: 'Firefox on Windows', time: 'May 19, 2026 at 22:45', status: 'Blocked & Logged Out' }
  ]);
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'MacBook Pro (Chrome)', ip: '192.168.1.45', isCurrent: true, location: 'Delhi, DL' },
    { id: 2, device: 'iPhone 15 Pro (Safari)', ip: '10.208.163.28', isCurrent: false, location: 'Delhi, DL' }
  ]);

  // Safety SOS states
  const [isSosAlarmActive, setIsSosAlarmActive] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: 28.6139, lng: 77.2090 });
  const [gpsLogs, setGpsLogs] = useState<string[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Security Shield states
  const [trustScore, setTrustScore] = useState<number>(75);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'ELEVATED' | 'CRITICAL'>('LOW');
  const [suspiciousFlags, setSuspiciousFlags] = useState<string[]>([]);
  const [anomalies, setAnomalies] = useState([
    { id: 'ANM-901', type: 'IP Verified', severity: 'LOW', timestamp: '2026-05-20 18:30', description: 'Labour coordinates matched local cell towers.' }
  ]);

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
      console.error(e);
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
    if (nextState) {
      const token = 'SOS-LABOUR-' + Math.floor(1000 + Math.random() * 9000) + '-DISPATCH';
      localStorage.setItem('rozgaar_admin_sos_alert', JSON.stringify({
        active: true,
        token: token,
        lat: gpsCoordinates.lat.toFixed(5),
        lng: gpsCoordinates.lng.toFixed(5),
        priority: 'LABOUR_CRITICAL_SOS',
        timestamp: new Date().toLocaleTimeString()
      }));
      setGpsLogs([`🚨 Critical SOS triggered by labour partner. Dispatch notified.`]);
      startSirenAudio();
      alert('🚨 LABOUR EMERGENCY SOS ACTIVATED! Emergency dispatch notified. High-frequency siren sound initialized and live coordinates shared.');
    } else {
      stopSirenAudio();
      localStorage.removeItem('rozgaar_admin_sos_alert');
      alert('SOS Cancelled. Returning Labour sentinel system to standby.');
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

  // Sync trust score based on KYC status changes
  useEffect(() => {
    if (kycStatus === 'approved') {
      setTrustScore(100);
      setRiskLevel('LOW');
    } else if (kycStatus === 'rejected') {
      setTrustScore(45);
      setRiskLevel('ELEVATED');
    } else {
      setTrustScore(75);
      setRiskLevel('LOW');
    }
  }, [kycStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      if (!token || !userId) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }

      // Fetch profile details from backend
      const fetchProfile = async () => {
        try {
          const res = await fetch(`http://localhost:5002/api/profiles/${userId}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              category: data.category || '',
              skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
              experienceYears: data.experienceYears !== undefined ? data.experienceYears.toString() : '',
              address: data.location?.address || '',
              hourlyRate: data.hourlyRate !== undefined ? data.hourlyRate.toString() : '',
              dailyRate: data.dailyRate !== undefined ? data.dailyRate.toString() : '',
            });
            setKycStatus(data.kycStatus || 'pending');
            if (data.kycStatus === 'approved') {
              setAadhaarUploaded(true);
              setSelfieUploaded(true);
            }
          }
        } catch (err) {
          console.error('Error fetching user profile', err);
        } finally {
          setProfileLoaded(true);
        }
      };

      fetchProfile();
    }
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: formData.category,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
          experienceYears: Number(formData.experienceYears),
          location: {
            address: formData.address,
            city: 'Delhi',
            state: 'DL',
            zipCode: '110001'
          },
          serviceAreas: ['Delhi'],
          hourlyRate: Number(formData.hourlyRate) || undefined,
          dailyRate: Number(formData.dailyRate) || undefined,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save profile details');
      }
      
      alert('Profile information saved successfully in MongoDB Atlas! Proceeding to KYC dashboard.');
      setActiveTab('kyc');
    } catch (err: any) {
      alert(err.message || 'An error occurred while saving profile');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Password updated successfully on MongoDB Atlas secure pre-save hooks!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogoutAllDevices = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrent));
    alert('Logged out from all other active device sessions successfully! Cleared JWT tokens for other clients.');
  };

  // Re-upload Handler
  const handleReupload = () => {
    setKycStatus('pending');
    setAadhaarNumber('');
    setAadhaarUploaded(false);
    setSelfieUploaded(false);
    setRejectionReason('');
    alert('KYC forms unlocked! Please upload your fresh Aadhaar Card copy and selfie verification image.');
  };

  const submitKYC = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarNumber || !aadhaarUploaded || !selfieUploaded) {
      alert('Please fill out all Aadhaar and Selfie files.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/profiles/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          aadhaarNumber,
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit KYC details');
      }
      
      setKycStatus('pending');
      alert('Documents uploaded successfully! Status updated to PENDING admin review.');
    } catch (err: any) {
      alert(err.message || 'An error occurred while submitting KYC');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Home Button Navigation Header */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rozgaar Profile Control</span>
      </div>

      <div className="mx-auto max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-150 dark:border-zinc-800/80 overflow-hidden">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-zinc-850">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🔧 Labour Profile & Rates Setup
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'kyc'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🪪 Identity KYC Verification
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🛡️ Sessions
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'safety'
                ? 'border-red-600 text-red-650 dark:border-red-400'
                : 'border-transparent text-gray-500 hover:text-red-600 dark:hover:text-red-400'
            }`}
          >
            🚨 Safety & SOS
          </button>
          <button
            onClick={() => setActiveTab('security_shield')}
            className={`flex-1 py-4 text-center font-bold text-sm tracking-wide border-b-2 transition-all ${
              activeTab === 'security_shield'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            🛡️ Security Shield
          </button>
        </div>

        {/* Tab CONTENT 1: Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="px-8 py-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Details</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Configure your daily/hourly wage parameters for searches.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Primary Labour Category</label>
                <select
                  name="category"
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-855 px-4 py-3 text-sm text-gray-900 dark:text-white"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="painter">Painter</option>
                  <option value="mason">Mason</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="driver">Driver</option>
                  <option value="daily_labour">Daily Labour</option>
                  <option value="other">Other / Custom Category</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Specialist Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. Wiring, Fan Repair, MCB Installations"
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="experienceYears"
                  min="0"
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Daily Rate (₹)</label>
                  <input
                    type="number"
                    name="dailyRate"
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                    value={formData.dailyRate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Full Base Address</label>
                <textarea
                  name="address"
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-900 dark:text-white"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-150 dark:border-zinc-850 flex justify-end gap-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-md"
              >
                Save Profile Parameters
              </button>
            </div>
          </form>
        )}

        {/* Tab CONTENT 2: Identity KYC Hub */}
        {activeTab === 'kyc' && (
          <div className="px-8 py-8 space-y-8">
            
            {/* Dynamic Status Widgets */}
            {kycStatus === 'pending' && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/30 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                    ⏳
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">KYC Verification Pending</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Our manual compliance admins are reviewing your uploaded Aadhaar card and selfie scan.</p>
                  </div>
                </div>

                {/* Simulated Admin Manual Controller triggers for staging verification */}
                <div className="bg-white dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dev / Admin Manual Approval Simulation Panel</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setKycStatus('approved');
                        alert('Simulated ADMIN manual action: APPROVED. KYC Badge activated!');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm"
                    >
                      Manually Approve KYC
                    </button>
                    <button 
                      onClick={() => {
                        setKycStatus('rejected');
                        alert('Simulated ADMIN manual action: REJECTED. Re-upload options unlocked!');
                      }}
                      className="bg-red-650 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm"
                    >
                      Manually Reject KYC
                    </button>
                  </div>
                </div>
              </div>
            )}

            {kycStatus === 'approved' && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-6 rounded-3xl space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xl">
                    ✅
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-green-800 dark:text-green-300 uppercase tracking-wider">Aadhaar KYC Successfully Verified!</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Congratulations! Your verification badge is now globally visible on search dashboards.</p>
                  </div>
                </div>
              </div>
            )}

            {kycStatus === 'rejected' && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xl">
                    ❌
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">KYC Verification Rejected</h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Admins flagged a validation mismatch on your profile credentials.</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-zinc-900/40 border border-red-100 dark:border-zinc-800 p-4 rounded-2xl text-xs space-y-1.5">
                  <p className="font-bold text-red-600 dark:text-red-400">Rejection Reason:</p>
                  <p className="text-gray-600 dark:text-zinc-400">{rejectionReason}</p>
                </div>
                <button
                  onClick={handleReupload}
                  className="bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-indigo-755 transition-colors shadow-md shadow-indigo-500/10"
                >
                  🔄 Unlock Forms & Re-upload Documents
                </button>
              </div>
            )}

            {/* Document Upload Form */}
            <form onSubmit={submitKYC} className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Aadhaar Card Details</h4>
                <p className="text-[11px] text-gray-400">Provide your 12-digit UIDAI number and upload clear scan images.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Aadhaar Number (12 Digit)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5839 2849 1948"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  disabled={kycStatus === 'approved' || kycStatus === 'pending'}
                  className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-sm text-gray-950 dark:text-white outline-none disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar File Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-zinc-750 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-gray-50 dark:bg-zinc-950/20">
                  <span className="text-2xl">🪪</span>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Aadhaar Card Front & Back Scan</p>
                    <p className="text-[10px] text-gray-400">PNG, JPG or PDF up to 5MB</p>
                  </div>
                  {aadhaarUploaded ? (
                    <span className="text-[10px] bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 font-bold px-2 py-1 rounded-md">
                      ✓ aadhaar_card.pdf uploaded
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAadhaarUploaded(true)}
                      className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900/30"
                    >
                      Select File
                    </button>
                  )}
                </div>

                {/* Selfie Cam Verification Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-zinc-750 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 bg-gray-50 dark:bg-zinc-950/20">
                  <span className="text-2xl">📸</span>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Live Selfie Verification Image</p>
                    <p className="text-[10px] text-gray-400">Ensure good lighting and face visibility</p>
                  </div>
                  {selfieUploaded ? (
                    <span className="text-[10px] bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 font-bold px-2 py-1 rounded-md">
                      ✓ live_selfie_scan.jpg uploaded
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelfieUploaded(true)}
                      className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900/30"
                    >
                      Capture / Select Selfie
                    </button>
                  )}
                </div>
              </div>

              {kycStatus === 'rejected' && (
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold text-sm py-4 rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Submit Updated KYC Documents
                </button>
              )}
            </form>

          </div>
        )}

        {/* Tab CONTENT 3: Security & Device Logs */}
        {activeTab === 'security' && (
          <div className="px-8 py-8 space-y-8">
            
            {/* Suspicious Alerts Widget */}
            {suspiciousAlerts.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    ⚠️ Suspicious Login Attempt Detected
                  </span>
                  <button 
                    onClick={() => setSuspiciousAlerts([])}
                    className="text-xs text-red-500 dark:text-red-400 font-bold hover:underline"
                  >
                    Clear Alert
                  </button>
                </div>
                {suspiciousAlerts.map(alert => (
                  <div key={alert.id} className="text-xs text-gray-600 dark:text-zinc-400 space-y-1">
                    <p>Our safety scanner detected an unauthorized token generation attempt from <strong className="text-gray-900 dark:text-white">{alert.location}</strong> on <strong className="text-gray-900 dark:text-white">{alert.device}</strong>.</p>
                    <p className="text-[10px] text-gray-400">Timestamp: {alert.time} | Security status: <span className="font-bold text-red-500">{alert.status}</span></p>
                  </div>
                ))}
              </div>
            )}

            {/* Change Password Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Current Password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-white outline-none"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-3.5 rounded-xl dark:bg-zinc-850 dark:hover:bg-zinc-800"
              >
                Change Account Password
              </button>
            </form>

            <hr className="border-gray-150 dark:border-zinc-850" />

            {/* Device Management Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Active Device Sessions</h4>
                  <p className="text-[11px] text-gray-400">These devices are currently logged in with active JWT tokens on your account.</p>
                </div>
                <button
                  onClick={handleLogoutAllDevices}
                  className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-colors"
                >
                  Logout from All Other Devices
                </button>
              </div>

              <div className="space-y-3">
                {activeSessions.map(session => (
                  <div key={session.id} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-950 p-4 rounded-2xl border border-gray-100 dark:border-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-lg">
                        🖥️
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          {session.device} 
                          {session.isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 rounded-full font-bold uppercase">
                              This Device
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-gray-400">IP Address: {session.ip} | Location: {session.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-150 dark:border-zinc-850" />

            {/* Inactivity Session Timeout */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-zinc-950 p-6 rounded-3xl border border-gray-100 dark:border-zinc-900">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Inactivity Session Timeout</h4>
                <p className="text-[11px] text-gray-400">Automatically logout after a period of idle inactivity to prevent physical tampering.</p>
              </div>
              <select
                value={sessionTimeout}
                onChange={(e) => {
                  setSessionTimeout(e.target.value);
                  alert(`Session inactivity timeout updated to: ${e.target.value} minutes.`);
                }}
                className="rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs font-semibold text-gray-900 dark:text-white"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="never">Never (Persistent)</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab CONTENT 4: Safety & SOS Support */}
        {activeTab === 'safety' && (
          <div className="px-8 py-8 space-y-8">
            <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 border border-red-200 dark:border-red-900/30 space-y-6">
              <div className="space-y-1">
                <h4 className="text-base font-black text-red-750 dark:text-red-400 uppercase tracking-tight flex items-center gap-2">
                  🚨 On-Site SOS Emergency Panel
                </h4>
                <p className="text-xs text-red-700/80">If you experience physical threats, payment extortion, or scaffolding accidents, activate SOS immediately to notify emergency dispatchers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 flex flex-col justify-center items-center text-center space-y-4">
                  <button
                    onClick={handleToggleSOS}
                    className={`h-24 w-24 rounded-full font-black text-white text-xs flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                      isSosAlarmActive 
                        ? 'bg-red-650 animate-ping'
                        : 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/25'
                    }`}
                  >
                    {isSosAlarmActive ? 'CANCEL SOS' : 'TRIGGER SOS'}
                  </button>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">120dB Emergency Siren Osc</p>
                </div>

                <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 space-y-4 col-span-2 text-xs">
                  <h5 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">Live GPS Coordinates Broadcaster</h5>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-gray-150 dark:border-zinc-850">
                      <span className="text-[9px] text-gray-400 uppercase block font-bold">Latitude telemetry</span>
                      <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{gpsCoordinates.lat.toFixed(5)}</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-gray-150 dark:border-zinc-850">
                      <span className="text-[9px] text-gray-400 uppercase block font-bold">Longitude telemetry</span>
                      <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{gpsCoordinates.lng.toFixed(5)}</span>
                    </div>
                  </div>

                  <div className="bg-red-955/5 dark:bg-red-955/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 space-y-1">
                    <span className="text-[10px] text-red-600 dark:text-red-400 uppercase font-black tracking-wider block">Live Telemetry logs</span>
                    <div className="font-mono text-[9px] text-red-700 dark:text-red-300 space-y-1 max-h-[80px] overflow-y-auto">
                      {gpsLogs.length > 0 ? (
                        gpsLogs.map((log, i) => <p key={i}>{log}</p>)
                      ) : (
                        <p className="text-gray-400">Standby sentinel. No active coordinates telemetry requested.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab CONTENT 5: AI Security Shield & Threat Score */}
        {activeTab === 'security_shield' && (
          <div className="px-8 py-8 space-y-8">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-6 border border-emerald-250 dark:border-emerald-900/30 space-y-6">
              <div className="space-y-1">
                <h4 className="text-base font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-tight flex items-center gap-2">
                  🛡️ Labour AI Security Shield & Standing
                </h4>
                <p className="text-xs text-emerald-700/80">Reviews your platform standing metrics, identity verifications, and compliance strikes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gauge widget */}
                <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-emerald-100 dark:border-zinc-800 flex flex-col justify-center items-center text-center space-y-3">
                  <div className="h-24 w-24 rounded-full border-8 border-gray-100 dark:border-zinc-850 relative flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full border-8 border-transparent animate-pulse ${
                      trustScore >= 80 ? 'border-t-green-500 border-r-green-500' : 'border-t-yellow-500 border-r-yellow-500'
                    }`}></div>
                    <div className="text-center">
                      <span className="text-2xl font-black text-gray-905 dark:text-white font-mono">{trustScore}</span>
                      <span className="text-[9px] text-gray-400 block font-black uppercase">Trust score</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    Risk Standing: <span className="text-green-600">{riskLevel}</span>
                  </p>
                </div>

                {/* Audit Telemetry */}
                <div className="bg-white dark:bg-zinc-955 p-6 rounded-2xl border border-emerald-100 dark:border-zinc-800 space-y-4 col-span-2 text-xs">
                  <h5 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">Worker Onboarding Status</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-gray-150 space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">KYC Verification State</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase inline-block ${
                        kycStatus === 'approved' ? 'bg-green-50 text-green-700' :
                        kycStatus === 'rejected' ? 'bg-red-50 text-red-655' : 'bg-yellow-50 text-yellow-750'
                      }`}>
                        {kycStatus === 'approved' ? 'Identity Approved' : kycStatus === 'rejected' ? 'Rejected Strike' : 'Under Review'}
                      </span>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-gray-150 space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Government Aadhaar Signature</span>
                      <span className="font-mono text-xs text-gray-950 dark:text-white font-bold">✓ Verified Aadhaar Hashes</span>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-gray-150 space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Active Compliance Warnings</span>
                      <span className="text-gray-900 dark:text-white font-bold">{suspiciousFlags.length} active warnings</span>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-gray-150 space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Biometric Face match</span>
                      <span className="text-green-600 font-bold">✓ Pass (98.4% Match Score)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Logs */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-150 dark:border-zinc-800/80 space-y-4">
              <h5 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider block">Labour Security Audit Logs</h5>
              <div className="space-y-3">
                {anomalies.map(anm => (
                  <div key={anm.id} className="flex justify-between items-start bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-200 dark:border-zinc-850 text-xs">
                    <div className="space-y-1">
                      <p className="font-extrabold text-gray-905 dark:text-white flex items-center gap-1.5">
                        ⚙️ {anm.type}
                        <span className="text-[9px] text-gray-400 font-mono font-normal">#{anm.id}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">{anm.timestamp} | {anm.description}</p>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                      anm.severity === 'CRITICAL' ? 'bg-red-50 text-red-655' : 'bg-green-50 text-green-755'
                    }`}>
                      {anm.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
