'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WorkerProfile {
  id: string;
  name: string;
  category: string;
  experienceYears: number;
  rating: number;
  priceValue: number; // hourly rate in INR
  distanceKm: number;
  availability: 'available' | 'busy';
  languages: string[];
  verified: boolean;
  badges: string[];
  
  // Sorting specific high-fidelity parameters
  responseTimeMin: number; // Lower is faster
  reliabilityScore: number; // Higher is better (out of 100)
  jobsCompleted: number; // Higher is better
  cancellationRate: number; // Lower is better (percentage)
}

export default function SearchPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      }
    }
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<string>('highest_rating');
  
  // 7 Core Filter States
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [minRating, setMinRating] = useState<number>(3.0);
  const [maxDistance, setMaxDistance] = useState<number>(15); // Distance in Km
  const [minExperience, setMinExperience] = useState<number>(0); // in Years
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all'); // 'all' | 'available'
  const [languageFilter, setLanguageFilter] = useState<string>('all'); // 'all' | 'English' | 'Hindi'
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Voice Search States
  const [isListening, setIsListening] = useState(false);
  const [voiceQuerySimulated, setVoiceQuerySimulated] = useState('');

  // AI Suggestion pill state
  const [activeAiPill, setActiveAiPill] = useState<string | null>(null);

  // High-fidelity database representing workers
  const dummyProfiles: WorkerProfile[] = [
    { 
      id: '1', 
      name: 'Ramesh Kumar', 
      category: 'Electrician', 
      experienceYears: 5, 
      rating: 4.8, 
      priceValue: 400, 
      distanceKm: 2.4,
      availability: 'available',
      languages: ['English', 'Hindi'],
      verified: true,
      badges: ['Verified Expert', 'Top Rated', 'Fast Responder'],
      responseTimeMin: 15,
      reliabilityScore: 98,
      jobsCompleted: 142,
      cancellationRate: 2
    },
    { 
      id: '2', 
      name: 'Suresh Singh', 
      category: 'Plumber', 
      experienceYears: 8, 
      rating: 4.5, 
      priceValue: 350, 
      distanceKm: 5.1,
      availability: 'available',
      languages: ['Hindi'],
      verified: true,
      badges: ['Master', 'Highly Reliable', '100+ Jobs Completed'],
      responseTimeMin: 25,
      reliabilityScore: 95,
      jobsCompleted: 180,
      cancellationRate: 4
    },
    { 
      id: '3', 
      name: 'Amit Sharma', 
      category: 'Carpenter', 
      experienceYears: 3, 
      rating: 4.2, 
      priceValue: 500, 
      distanceKm: 8.7,
      availability: 'busy',
      languages: ['English', 'Hindi'],
      verified: false,
      badges: ['Professional', 'Emergency Specialist'],
      responseTimeMin: 45,
      reliabilityScore: 89,
      jobsCompleted: 45,
      cancellationRate: 8
    },
    { 
      id: '4', 
      name: 'Rajesh Yadav', 
      category: 'Driver', 
      experienceYears: 12, 
      rating: 4.9, 
      priceValue: 250, 
      distanceKm: 1.2,
      availability: 'available',
      languages: ['Hindi'],
      verified: true,
      badges: ['Master', 'Top Rated', '100+ Jobs Completed'],
      responseTimeMin: 10,
      reliabilityScore: 99,
      jobsCompleted: 295,
      cancellationRate: 1
    },
    { 
      id: '5', 
      name: 'Deepak Mishra', 
      category: 'Mason', 
      experienceYears: 1, 
      rating: 4.0, 
      priceValue: 180, 
      distanceKm: 12.5,
      availability: 'available',
      languages: ['Hindi'],
      verified: false,
      badges: ['Beginner', 'Fast Responder'],
      responseTimeMin: 30,
      reliabilityScore: 85,
      jobsCompleted: 12,
      cancellationRate: 15
    },
    { 
      id: '6', 
      name: 'Priya Sharma', 
      category: 'Cleaner', 
      experienceYears: 6, 
      rating: 4.7, 
      priceValue: 300, 
      distanceKm: 3.8,
      availability: 'available',
      languages: ['English'],
      verified: true,
      badges: ['Verified Expert', 'Fast Responder', 'Highly Reliable'],
      responseTimeMin: 8,
      reliabilityScore: 97,
      jobsCompleted: 88,
      cancellationRate: 3
    }
  ];

  const [profiles, setProfiles] = useState<WorkerProfile[]>(dummyProfiles);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/profiles/search?isWorker=true`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const mappedProfiles = data.map((p: any) => ({
              id: p._id,
              name: p.user?.name || p.name || 'Unknown',
              category: p.skills?.[0] || 'General',
              experienceYears: p.experienceYears || 0,
              rating: p.rating || 4.0,
              priceValue: p.hourlyRate || 300,
              distanceKm: p.distance || 5.0,
              availability: p.availabilityStatus || 'available',
              languages: p.languages || ['Hindi'],
              verified: p.isVerified || false,
              badges: p.badges || [],
              responseTimeMin: p.responseTimeMin || 30,
              reliabilityScore: p.reliabilityScore || 90,
              jobsCompleted: p.jobsCompleted || 0,
              cancellationRate: p.cancellationRate || 0
            }));
            setProfiles(mappedProfiles);
          }
        }
      } catch (err) {
        console.error('Failed to fetch live profiles. Using dummy fallback.', err);
      }
    };
    fetchProfiles();
  }, []);

  // Natural Language & Hindi Voice search intent parser
  const handleVoiceSearchSimulation = () => {
    setIsListening(true);
    setVoiceQuerySimulated('Listening...');
    
    setTimeout(() => {
      const phrases = [
        'Mujhe electrician chahiye',
        'Nal theek karne ke liye plumber chahiye',
        'Driver bulado jaldi',
        'Urgent carpenter required'
      ];
      // Select "Mujhe electrician chahiye" as first preference or random
      const selectedPhrase = phrases[0];
      setVoiceQuerySimulated(selectedPhrase);
      setSearchQuery(selectedPhrase);
      setIsListening(false);

      // Smart Intent Parsing
      const lowercaseQuery = selectedPhrase.toLowerCase();
      if (lowercaseQuery.includes('electrician') || lowercaseQuery.includes('bijli')) {
        setSelectedCategory('electrician');
      } else if (lowercaseQuery.includes('plumber') || lowercaseQuery.includes('nal')) {
        setSelectedCategory('plumber');
      } else if (lowercaseQuery.includes('carpenter') || lowercaseQuery.includes('wood')) {
        setSelectedCategory('carpenter');
      } else if (lowercaseQuery.includes('driver') || lowercaseQuery.includes('gaadi')) {
        setSelectedCategory('driver');
      }
      
      alert(`🎤 Voice Intent Parsed! Phrase: "${selectedPhrase}" -> Category auto-set to: Electrician`);
    }, 2000);
  };

  // Smart AI Recommendations presets triggers
  const handleAiPillClick = (pillType: string) => {
    setActiveAiPill(pillType);
    
    if (pillType === 'nearby') {
      setMaxDistance(3); // Under 3km
      setSortBy('nearest');
      alert('🤖 AI Suggestion Locked: Nearby professionals sorted by proximity (under 3 km)!');
    } else if (pillType === 'budget') {
      setMaxPrice(350); // Under 350 INR
      setSortBy('lowest_price');
      alert('🤖 AI Suggestion Locked: Budget-friendly professionals sorted by price (under ₹350/hr)!');
    } else if (pillType === 'best_rated') {
      setMinRating(4.7); // 4.7 & above
      setSortBy('highest_rating');
      alert('🤖 AI Suggestion Locked: Top-tier expert professionals selected (Rating 4.7★+)!');
    } else if (pillType === 'fast_responder') {
      setSortBy('fastest_response');
      alert('🤖 AI Suggestion Locked: Superfast response providers prioritized!');
    } else if (pillType === 'previous') {
      // Filter only Ramesh & Rajesh who customer previously rated high
      setSearchQuery('Ramesh'); 
      alert('🤖 AI Suggestion Locked: Loading workers matched with your booking history preferences!');
    }
  };

  const handleResetFilters = () => {
    setMaxPrice(600);
    setMinRating(3.0);
    setMaxDistance(15);
    setMinExperience(0);
    setAvailabilityFilter('all');
    setLanguageFilter('all');
    setVerifiedOnly(false);
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('highest_rating');
    setActiveAiPill(null);
    setVoiceQuerySimulated('');
  };

  // Filtering & Sorting execution
  const processedProfiles = profiles
    .filter(profile => {
      // 1. Text Search matching
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            profile.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            // Voice query fallback match
                            (searchQuery.toLowerCase().includes('electrician') && profile.category === 'Electrician');
      if (!matchesSearch) return false;

      // Category dropdown match
      if (selectedCategory && profile.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;

      // 2. Price filter
      if (profile.priceValue > maxPrice) return false;

      // 3. Rating filter
      if (profile.rating < minRating) return false;

      // 4. Distance filter
      if (profile.distanceKm > maxDistance) return false;

      // 5. Experience filter
      if (profile.experienceYears < minExperience) return false;

      // 6. Availability filter
      if (availabilityFilter === 'available' && profile.availability !== 'available') return false;

      // 7. Language filter
      if (languageFilter !== 'all' && !profile.languages.includes(languageFilter)) return false;

      // 8. Verified only filter
      if (verifiedOnly && !profile.verified) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'lowest_price') return a.priceValue - b.priceValue;
      if (sortBy === 'highest_rating') return b.rating - a.rating;
      if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
      if (sortBy === 'most_experienced') return b.experienceYears - a.experienceYears;
      if (sortBy === 'fastest_response') return a.responseTimeMin - b.responseTimeMin;
      if (sortBy === 'reliability') return b.reliabilityScore - a.reliabilityScore;
      if (sortBy === 'most_jobs') return b.jobsCompleted - a.jobsCompleted;
      if (sortBy === 'lowest_cancellation') return a.cancellationRate - b.cancellationRate;
      return 0;
    });

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Beginner':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
      case 'Professional':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30';
      case 'Expert':
        return 'bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-400 border border-violet-200 dark:border-violet-900/30';
      case 'Master':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30';
      case 'Top Rated':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-250 dark:border-amber-900/30 font-bold';
      case 'Verified Expert':
        return 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-900/30 font-bold';
      case 'Fast Responder':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400 border border-teal-200 dark:border-teal-900/30';
      case 'Highly Reliable':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30 font-bold';
      case 'Emergency Specialist':
        return 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/30';
      case '100+ Jobs Completed':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 font-bold';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-zinc-850 dark:text-zinc-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 transition-colors duration-300">
      
      {/* Home Navigation */}
      <div className="max-w-7xl mx-auto mb-4">
        <Link href="/" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Homepage
        </Link>
      </div>

      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Page title and description */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🔍 Search Rozgaar Professionals</h1>
          <p className="text-xs text-gray-555 dark:text-zinc-400 mt-1">
            Search our highly skilled, fully Aadhaar verified local worker network using voice searches & semantic intent processors.
          </p>
        </div>

        {/* Dynamic Smart AI Recommendation Suggestions */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-950/20 dark:to-indigo-950/20 p-5 rounded-3xl border border-indigo-150 dark:border-indigo-900/20 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">🤖</span>
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Smart AI Recommendation Pills</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: '📍 Nearby Pros', type: 'nearby' },
              { label: '💸 Budget-Friendly', type: 'budget' },
              { label: '⭐ Best Rated', type: 'best_rated' },
              { label: '⚡ Fast Responders', type: 'fast_responder' },
              { label: '🔄 Previous Preferences', type: 'previous' },
            ].map(pill => (
              <button
                key={pill.type}
                onClick={() => handleAiPillClick(pill.type)}
                className={`text-[10px] font-bold px-4 py-2 rounded-xl transition-all border ${
                  activeAiPill === pill.type
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Layout: Left Sidebar Filters, Right Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Premium 7 Filters Panel */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-150 dark:border-zinc-800/80 shadow-md space-y-6 self-start">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-zinc-850">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filters Panel</span>
              <button 
                onClick={handleResetFilters}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Filter 1: Price Max Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Max Hourly Price</span>
                <span className="text-indigo-650 dark:text-indigo-400">₹{maxPrice}/hr</span>
              </div>
              <input 
                type="range"
                min={150}
                max={600}
                step={25}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-indigo-600"
              />
            </div>

            {/* Filter 2: Min Rating */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Minimum Rating</span>
                <span className="text-indigo-655 dark:text-indigo-400">⭐ {minRating.toFixed(1)}+</span>
              </div>
              <input 
                type="range"
                min={3.0}
                max={5.0}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-indigo-600"
              />
            </div>

            {/* Filter 3: Distance Limit */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Maximum Distance</span>
                <span className="text-indigo-660 dark:text-indigo-400">{maxDistance} km</span>
              </div>
              <input 
                type="range"
                min={1}
                max={15}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-indigo-600"
              />
            </div>

            {/* Filter 4: Min Experience */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 font-semibold">
                <span>Min Experience (Years)</span>
                <span className="text-indigo-665 dark:text-indigo-400">{minExperience} yrs+</span>
              </div>
              <input 
                type="range"
                min={0}
                max={12}
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-indigo-600"
              />
            </div>

            {/* Filter 5: Availability */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Availability</label>
              <select 
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-900 dark:text-white"
              >
                <option value="all">All Professionals</option>
                <option value="available">Available Now</option>
              </select>
            </div>

            {/* Filter 6: Language */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Language Spoken</label>
              <select 
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-2 text-xs text-gray-900 dark:text-white"
              >
                <option value="all">Any Language</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Filter 7: Verified Only Toggle Switch */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-gray-600 dark:text-zinc-350">Verified Only badge</span>
              <button 
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  verifiedOnly ? 'bg-indigo-600' : 'bg-gray-250 dark:bg-zinc-800'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    verifiedOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Right Column: Search input and Grid results */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Real-time search query, Voice simulation and Sort controls */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-150 dark:border-zinc-800/80 flex flex-col sm:flex-row gap-4 items-center shadow-sm">
              
              {/* Voice search button integrated with regular text query */}
              <div className="flex-1 w-full flex gap-2 items-center">
                <input 
                  type="text"
                  placeholder="Enter dynamic keywords e.g. Electrician, Ramesh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none"
                />

                {/* Highly Interactive Voice Search Button */}
                <button
                  type="button"
                  onClick={handleVoiceSearchSimulation}
                  className={`h-11 w-11 rounded-xl border flex items-center justify-center text-lg transition-all ${
                    isListening
                      ? 'bg-red-500 border-red-600 text-white animate-pulse shadow-md shadow-red-500/20'
                      : 'bg-indigo-50 border-indigo-150 text-indigo-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-indigo-400 hover:bg-indigo-100'
                  }`}
                  title="Simulate Voice Search"
                >
                  🎙️
                </button>
              </div>

              <div className="w-full sm:w-auto flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto rounded-xl border border-gray-300 dark:border-zinc-700 dark:bg-zinc-850 px-3 py-3 text-xs text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                  <option value="carpenter">Carpenter</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="driver">Driver</option>
                  <option value="mason">Mason</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto rounded-xl border border-indigo-200 dark:border-zinc-700 bg-indigo-50/50 dark:bg-zinc-850 px-3 py-3 text-xs font-semibold text-indigo-700 dark:text-indigo-400 focus:outline-none"
                >
                  <option value="lowest_price">Sort: Lowest Price</option>
                  <option value="highest_rating">Sort: Highest Rating</option>
                  <option value="nearest">Sort: Nearest (Distance)</option>
                  <option value="most_experienced">Sort: Experience</option>
                  <option value="fastest_response">Sort: Fastest Response</option>
                  <option value="reliability">Sort: Reliability Score</option>
                  <option value="most_jobs">Sort: Jobs Completed</option>
                  <option value="lowest_cancellation">Sort: Lowest Cancellation</option>
                </select>
              </div>
            </div>

            {/* Listening indicator */}
            {isListening && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
                <span className="h-2.5 w-2.5 rounded-full bg-red-650 animate-ping"></span>
                <span className="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-widest">Listening: simulating Hindi/English speech intent...</span>
              </div>
            )}

            {voiceQuerySimulated && !isListening && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 p-3 rounded-2xl flex items-center gap-2">
                <span className="text-xs text-green-700 dark:text-green-400 font-semibold">
                  🔊 Voice input parsed successfully: <strong>"{voiceQuerySimulated}"</strong>
                </span>
              </div>
            )}

            {/* Profiles output list */}
            {processedProfiles.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 p-12 text-center rounded-3xl border border-gray-150 dark:border-zinc-800/80">
                <span className="text-4xl">🔎</span>
                <h3 className="font-bold text-gray-900 dark:text-white mt-4">No matching professionals found</h3>
                <p className="text-xs text-gray-550 mt-1">Try broadening your slider filter parameters to see more workers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {processedProfiles.map((profile) => (
                  <div key={profile.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-zinc-800/80 hover:shadow-lg transition-all flex flex-col justify-between">
                    <div className="space-y-4">
                      
                      {/* Top Header Card */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-base">
                            {profile.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-xs">{profile.name}</h3>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{profile.category}</p>
                          </div>
                        </div>

                        {profile.verified && (
                          <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded uppercase dark:bg-green-950/20 dark:text-green-400">
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        {profile.badges.map((badge, idx) => (
                          <span 
                            key={idx} 
                            className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${getBadgeStyle(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Comprehensive Search parameters */}
                      <div className="space-y-2 border-t border-gray-100 dark:border-zinc-850 pt-3">
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Rating</span>
                          <span className="font-semibold text-gray-900 dark:text-white">⭐ {profile.rating}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Price Rate</span>
                          <span className="font-semibold text-gray-900 dark:text-white">₹{profile.priceValue}/hr</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Distance km</span>
                          <span className="font-semibold text-gray-900 dark:text-white">📍 {profile.distanceKm} km away</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Experience</span>
                          <span className="font-semibold text-gray-900 dark:text-white">💼 {profile.experienceYears} years</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Response Time</span>
                          <span className="font-semibold text-gray-905 dark:text-white">⚡ {profile.responseTimeMin} mins</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Reliability Score</span>
                          <span className="font-semibold text-gray-905 dark:text-white">🛡️ {profile.reliabilityScore}%</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Jobs Completed</span>
                          <span className="font-semibold text-gray-905 dark:text-white">🏆 {profile.jobsCompleted} jobs</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-505">
                          <span>Cancellation Rate</span>
                          <span className="font-semibold text-gray-905 dark:text-white">⚠️ {profile.cancellationRate}%</span>
                        </div>
                      </div>

                    </div>

                    <Link 
                      href="/bookings"
                      className="mt-6 block w-full text-center rounded-xl bg-indigo-50 dark:bg-indigo-950/20 px-3 py-3 text-[10px] font-bold text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/40"
                    >
                      Book Professional Now
                    </Link>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
