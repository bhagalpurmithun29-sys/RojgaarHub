'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchResult, setSearchResult] = useState('');
  const [showSosAlert, setShowSosAlert] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  
  // Pricing Estimator state
  const [selectedCategory, setSelectedCategory] = useState('Electrician');
  const [estimatedHours, setEstimatedHours] = useState('2');

  const translations = {
    en: {
      findProfessionals: "Find Professionals",
      myBookings: "My Bookings",
      myWallet: "My Wallet",
      messages: "Messages",
      admin: "Admin",
      signIn: "Sign In",
      register: "Register",
      tagline: "Now Live: Seamless Labour On-Demand Ecosystem",
      heroTitle: "Empowering Reliable Daily Labour & Pros",
      heroSub: "Connecting premium certified Electricians, Plumbers, Carpenters, Painters, and Contractors instantly with customers. Supported with full KYC, OTP milestones, and real-time wallet transactions.",
      hirePro: "Hire a Professional",
      registerPartner: "Register as Labour / Partner",
      voiceSearchTitle: "🎙️ AI Voice Search (Hindi/English)",
      voiceSearchSub: "Aap bol kar bhi search kar sakte hain. Jaise: ",
      voiceSearchKeyword: "Mujhe electrician chahiye",
      voicePlaceholder: "Click microphone to search...",
      voiceResultTitle: "Smart Translation Result:",
      voiceResultLink: "Proceed to Electrician Listings →",
      estimatorTitle: "Smart Price Estimator",
      estimatorSub: "Estimate labour cost instantly based on market rates and required duration.",
      estimatorCost: "Total Estimated Pricing",
      estimatorDisclaimer: "Prices may vary slightly based on final requirements and materials.",
      dashboardsTitle: "One Ecosystem, Multiple Dashboards",
      dashboardsSub: "Access specialized platforms designed for all members of the ecosystem.",
      customerHub: "Customer Hub",
      customerHubDesc: "Book professional services, process security OTPs, manage transactions, and track locations live.",
      workerPortal: "Labour Worker Portal",
      workerPortalDesc: "Manage daily schedules, set hourly/project pricing rates, verify Aadhaar KYC, and submit job milestones.",
      contractorHub: "Contractor Team Hub",
      contractorHubDesc: "Onboard multi-labour teams, create large project bookings, allocate workers, and manage massive construction milestones.",
      adminControl: "System Admin Control",
      adminControlDesc: "Approve KYC profiles, monitor platform earnings and platform commission splits, and manage system tickets."
    },
    hi: {
      findProfessionals: "कामगार खोजें",
      myBookings: "मेरी बुकिंग",
      myWallet: "मेरा वॉलेट",
      messages: "संदेश",
      admin: "एडमिन",
      signIn: "लॉग इन",
      register: "रजिस्टर",
      tagline: "अब लाइव: आसान और तुरंत दैनिक कामगार सेवा",
      heroTitle: "भरोसेमंद दैनिक कामगारों और पेशेवरों का सशक्तिकरण",
      heroSub: "इलेक्ट्रीशियन, प्लंबर, बढ़ई, पेंटर और ठेकेदारों को ग्राहकों के साथ तुरंत कनेक्ट करें। पूर्ण केवाईसी, ओटीपी माइलस्टोन और सुरक्षित रीयल-टाइम वॉलेट लेनदेन के साथ समर्थित।",
      hirePro: "कामगार बुक करें",
      registerPartner: "कामगार / पार्टनर के रूप में जुड़ें",
      voiceSearchTitle: "🎙️ AI वॉयस सर्च (हिंदी/अंग्रेजी)",
      voiceSearchSub: "आप बोल कर भी सर्च कर सकते हैं। जैसे: ",
      voiceSearchKeyword: "मुझे इलेक्ट्रीशियन चाहिए",
      voicePlaceholder: "सर्च करने के लिए माइक दबाएं...",
      voiceResultTitle: "स्मार्ट अनुवाद परिणाम:",
      voiceResultLink: "इलेक्ट्रीशियन सूची पर जाएं →",
      estimatorTitle: "स्मार्ट मूल्य कैलकुलेटर",
      estimatorSub: "बाजार दरों और आवश्यक कार्य अवधि के आधार पर तुरंत श्रम लागत का अनुमान लगाएं।",
      estimatorCost: "कुल अनुमानित मूल्य",
      estimatorDisclaimer: "अंतिम आवश्यकताओं और सामग्री के आधार पर कीमतें थोड़ी भिन्न हो सकती हैं।",
      dashboardsTitle: "एक पारिस्थितिकी तंत्र, अनेक डैशबोर्ड",
      dashboardsSub: "पारिस्थितिकी तंत्र के सभी सदस्यों के लिए डिज़ाइन किए गए विशेष प्लेटफार्मों तक पहुँचें।",
      customerHub: "ग्राहक हब (Customer)",
      customerHubDesc: "पेशेवर सेवाएं बुक करें, सुरक्षा ओटीपी सत्यापित करें, लेनदेन प्रबंधित करें और लाइव स्थान ट्रैक करें।",
      workerPortal: "कामगार पोर्टल (Worker)",
      workerPortalDesc: "दैनिक शेड्यूल प्रबंधित करें, दरें निर्धारित करें, आधार केवाईसी सत्यापित करें और काम के माइलस्टोन सबमिट करें।",
      contractorHub: "ठेकेदार टीम हब (Contractor)",
      contractorHubDesc: "मल्टी-लेबर टीमों को जोड़ें, बड़ी प्रोजेक्ट बुकिंग बनाएं, कामगारों को काम सौंपें और मील के पत्थर प्रबंधित करें।",
      adminControl: "सिस्टम एडमिन कंट्रोल",
      adminControlDesc: "केवाईसी प्रोफाइल स्वीकृत करें, प्लेटफ़ॉर्म की कमाई और कमीशन विभाजन की निगरानी करें, और शिकायतों का निवारण करें।"
    }
  };

  const t = translations[language];

  const handleVoiceSearch = () => {
    setIsListening(true);
    setVoiceInput(language === 'en' ? 'Listening...' : 'सुन रहा हूँ...');
    
    // Simulate speech-to-text
    setTimeout(() => {
      setVoiceInput(language === 'en' ? 'Mujhe electrician chahiye' : 'मुझे इलेक्ट्रीशियन चाहिए');
      setIsListening(false);
      setSearchResult(
        language === 'en' 
          ? 'Translating "Mujhe electrician chahiye" -> Match Category: Electrician. Redirecting you to Electrician professionals...'
          : 'अनुवाद "मुझे इलेक्ट्रीशियन चाहिए" -> श्रेणी मिलान: इलेक्ट्रीशियन। आपको इलेक्ट्रीशियन विशेषज्ञों पर पुनर्निर्देशित किया जा रहा है...'
      );
    }, 2000);
  };

  const getEstimatedCost = () => {
    const rates: Record<string, number> = {
      Electrician: 200,
      Plumber: 250,
      Carpenter: 220,
      Painter: 180,
      Cleaner: 150,
    };
    const rate = rates[selectedCategory] || 150;
    const base = rate * Number(estimatedHours);
    const platformFee = 49;
    return `₹${base + platformFee} (${language === 'en' ? 'Includes' : 'शामिल है'} base rate + ₹${platformFee} platform fee)`;
  };

  const handleProtectedRoute = (targetPath: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      window.location.href = `/login?redirect=${encodeURIComponent(targetPath)}`;
    } else {
      window.location.href = targetPath;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-brand-navy brand-bg-image text-gray-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-brand-navy-light/70 border-b border-gray-150 dark:border-zinc-800/80 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-amber to-brand-orange flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">RozgaarHub</span>
        </div>
        
        {/* Removed 'Find Professionals' and 'Portals & Advanced Tools' Dropdown */}

        <div className="flex items-center gap-3">
          {/* Elegant Language Toggle */}
          <button 
            onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
            className="text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white px-3.5 py-2 rounded-xl transition-all shadow-sm border border-gray-200 dark:border-zinc-700"
          >
            🌐 {language === 'en' ? 'हिन्दी' : 'English'}
          </button>
          
          <Link 
            href="/admin" 
            onClick={(e) => {
              e.preventDefault();
              handleProtectedRoute('/admin');
            }}
            className="text-sm font-semibold px-4 py-2 text-brand-orange dark:text-brand-amber hover:bg-amber-50/50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {t.admin}
          </Link>
          
          <Link href="/login" className="text-sm font-semibold px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">{t.signIn}</Link>
          <Link href="/register" className="text-sm font-semibold bg-gradient-to-r from-brand-amber to-brand-orange text-white px-4 py-2 rounded-lg hover:opacity-95 shadow-sm transition-all">{t.register}</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-28 md:py-44 max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-8 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-brand-amber/10 text-brand-orange dark:text-brand-amber ring-1 ring-inset ring-brand-amber/20">
          {t.tagline}
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          {language === 'en' ? (
            <>
              Empowering Reliable <span className="bg-gradient-to-r from-brand-amber to-brand-orange bg-clip-text text-transparent">Daily Labour</span> & Pros
            </>
          ) : (
            <>
              भरोसेमंद <span className="bg-gradient-to-r from-brand-amber to-brand-orange bg-clip-text text-transparent">दैनिक कामगारों</span> का सशक्तिकरण
            </>
          )}
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-zinc-300 max-w-2xl leading-relaxed">
          {t.heroSub}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full max-w-md">
          <Link 
            href="/search" 
            onClick={(e) => {
              e.preventDefault();
              handleProtectedRoute('/search');
            }}
            className="flex-1 bg-gradient-to-r from-brand-amber to-brand-orange text-white text-center font-bold px-8 py-4 rounded-xl hover:opacity-95 shadow-lg shadow-brand-amber/20 transition-all transform hover:-translate-y-0.5"
          >
            {t.hirePro}
          </Link>
          <Link 
            href="/profile/setup" 
            onClick={(e) => {
              e.preventDefault();
              handleProtectedRoute('/profile/setup');
            }}
            className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center font-bold px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/80 shadow-sm transition-all"
          >
            {t.registerPartner}
          </Link>
        </div>
      </section>

      {/* Role Gateways Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t.dashboardsTitle}</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">{t.dashboardsSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow space-y-4">
            <div className="h-12 w-12 bg-amber-50 dark:bg-brand-amber/15 text-brand-orange dark:text-brand-amber rounded-xl flex items-center justify-center text-xl font-bold">
              👤
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.customerHub}</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400">{t.customerHubDesc}</p>
            <Link 
              href="/search" 
              onClick={(e) => {
                e.preventDefault();
                handleProtectedRoute('/search');
              }}
              className="inline-block text-xs font-semibold text-brand-orange dark:text-brand-amber hover:underline"
            >
              {language === 'en' ? 'Enter Customer Search →' : 'ग्राहक खोज शुरू करें →'}
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow space-y-4">
            <div className="h-12 w-12 bg-amber-50 dark:bg-brand-amber/15 text-brand-orange dark:text-brand-amber rounded-xl flex items-center justify-center text-xl font-bold">
              🔧
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.workerPortal}</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400">{t.workerPortalDesc}</p>
            <Link 
              href="/profile/setup" 
              onClick={(e) => {
                e.preventDefault();
                handleProtectedRoute('/profile/setup');
              }}
              className="inline-block text-xs font-semibold text-brand-orange dark:text-brand-amber hover:underline"
            >
              {language === 'en' ? 'Manage Partner Profile →' : 'कामगार प्रोफ़ाइल प्रबंधित करें →'}
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow space-y-4">
            <div className="h-12 w-12 bg-amber-50 dark:bg-brand-amber/15 text-brand-orange dark:text-brand-amber rounded-xl flex items-center justify-center text-xl font-bold">
              👥
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.contractorHub}</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400">{t.contractorHubDesc}</p>
            <Link 
              href="/bookings" 
              onClick={(e) => {
                e.preventDefault();
                handleProtectedRoute('/bookings');
              }}
              className="inline-block text-xs font-semibold text-brand-orange dark:text-brand-amber hover:underline"
            >
              {language === 'en' ? 'Manage Team Projects →' : 'टीम प्रोजेक्ट्स प्रबंधित करें →'}
            </Link>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow space-y-4">
            <div className="h-12 w-12 bg-amber-50 dark:bg-brand-amber/15 text-brand-orange dark:text-brand-amber rounded-xl flex items-center justify-center text-xl font-bold">
              ⚙️
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{t.adminControl}</h4>
            <p className="text-xs text-gray-500 dark:text-zinc-400">{t.adminControlDesc}</p>
            <Link 
              href="/admin" 
              onClick={(e) => {
                e.preventDefault();
                handleProtectedRoute('/admin');
              }}
              className="inline-block text-xs font-semibold text-brand-orange dark:text-brand-amber hover:underline"
            >
              {language === 'en' ? 'Access Admin Console →' : 'एडमिन कंसोल पर जाएं →'}
            </Link>
          </div>

        </div>
      </section>

      {/* Brand Core Values Bar - High-Fidelity Panel exactly aligned with the theme1.png layout */}
      <section className="border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-brand-navy-light/35 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full border border-brand-amber/40 dark:border-brand-amber/55 flex items-center justify-center text-brand-amber bg-brand-amber/5 text-lg shadow-sm">
              🛡️
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">Verified Workers</p>
              <p className="text-[10px] text-gray-400 hidden sm:block">Aadhaar KYC Certified</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full border border-brand-amber/40 dark:border-brand-amber/55 flex items-center justify-center text-brand-amber bg-brand-amber/5 text-lg shadow-sm">
              ✅
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">Safe & Trusted</p>
              <p className="text-[10px] text-gray-400 hidden sm:block">Secure Escrow Protection</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full border border-brand-amber/40 dark:border-brand-amber/55 flex items-center justify-center text-brand-amber bg-brand-amber/5 text-lg shadow-sm">
              ⚡
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">Quick Service</p>
              <p className="text-[10px] text-gray-400 hidden sm:block">Instant Booking Matching</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full border border-brand-amber/40 dark:border-brand-amber/55 flex items-center justify-center text-brand-amber bg-brand-amber/5 text-lg shadow-sm">
              ₹
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">Best Prices</p>
              <p className="text-[10px] text-gray-400 hidden sm:block">Direct Transparent Rates</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3 col-span-2 md:col-span-1">
            <div className="h-12 w-12 rounded-full border border-brand-amber/40 dark:border-brand-amber/55 flex items-center justify-center text-brand-amber bg-brand-amber/5 text-lg shadow-sm">
              🎧
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">24x7 Support</p>
              <p className="text-[10px] text-gray-400 hidden sm:block">Offline Support Syncing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-brand-navy-light px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-amber to-brand-orange flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <span className="font-bold text-gray-900 dark:text-white">RozgaarHub</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              India's premium online labour booking ecosystem. Connecting skilled daily wage workers & contractors directly with customers.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Ecosystem</h5>
            <ul className="text-xs text-gray-500 dark:text-zinc-400 space-y-2">
              <li><Link href="/search">Find Electricians</Link></li>
              <li><Link href="/search">Find Plumbers</Link></li>
              <li><Link href="/search">Find Carpenters</Link></li>
              <li><Link href="/search">Find Painters</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Legals & Support</h5>
            <ul className="text-xs text-gray-500 dark:text-zinc-400 space-y-2">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Refund Policy</a></li>
              <li><a href="#" className="hover:underline">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm text-gray-900 dark:text-white mb-3">Rozgaar Security</h5>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              All bookings are gated with 3 unique OTP milestones for ultimate transparency and secure wallet payments.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-150 dark:border-zinc-800 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} RozgaarHub Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
