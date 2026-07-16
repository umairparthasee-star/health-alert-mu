"use client";
import Image from 'next/image';
import chatbotImg from './chatbot.png';
import React, { useState } from 'react';

export default function Home() {
  const [showEmergencyList, setShowEmergencyList] = useState<boolean>(false);

  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(true);
  const [showAgeModal, setShowAgeModal] = useState<boolean>(false);
  
  // Stores current active role state: 'child' | 'adult'
  const [userRole, setUserRole] = useState<'child' | 'adult'>('child');

  // --- SIDE PANEL STATE ---
  const [showSidePanel, setShowSidePanel] = useState<boolean>(false);

  // --- NEW: CHATBOT STATE ---
  const [showChatbotModal, setShowChatbotModal] = useState<boolean>(false);

  // Hardcoded emergency contacts for Mauritius
  const emergencyNumbers = [
    { label: "Medical Emergency / Ambulance", number: "114" },
    { label: "Ministry of Health Outbreak Hotline", number: "8924" },
    { label: "Police Emergency", number: "999 / 112" },
    { label: "SAMU", number: "114" }
  ];

  // Handles state setting when profile changes
  const handleAgeSelect = (role: 'child' | 'adult') => {
    setUserRole(role);
    setShowAgeModal(false);
  };

  // Helper function to trigger emergency display from the side panel
  const handleEmergencyClickFromPanel = () => {
    setShowSidePanel(false);
    setShowEmergencyList(true);
  };

  // Content for the scrolling marquee banner (Mauritius Health Alerts)
  const alertText = "🚨 ACTIVE OUTBREAK: Chikungunya cases rising across Plaines Wilhems, Quatre-Bornes, Rose-Hill, & Stanley. Use daytime insect repellent! • ☔ PREVENTATIVE HEALTH ALERT: No major Leptospirosis outbreak, but heavy rain has increased risk. Do NOT walk barefoot in floodwaters or wet mud! • 📢 HEALTH MONITORING: Enhanced health screenings active at airport arrivals for regional travelers. • 🩺 NOTICE: Fast-track flu vaccines are still available at your local dispensary. • ";
  return (
    /* MODIFIED: Children background image for child mode, and an appropriate professional soft teal-slate tint for adult mode */
    <div className={`min-h-screen flex flex-col justify-between font-sans antialiased text-slate-900 relative overflow-x-hidden transition-all duration-300
      ${userRole === 'child' 
        ? "bg-[url('childrenbackground.jpg')] bg-cover bg-center bg-no-repeat" 
        : "bg-emerald-50/20"
      }`}
    >
      
      {/* 📥 INJECTED STYLES: Handled directly in this file for infinite seamless scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes inlineMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .custom-marquee-container {
          display: flex;
          width: max-content;
          animation: inlineMarquee 45s linear infinite;
        }
        .custom-marquee-container:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* --- HAMBURGER SIDE PANEL DRAWERS --- */}
      {showSidePanel && (
        <>
          {/* Backdrop Click Shield overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setShowSidePanel(false)}
          />
          
          {/* Main Slide-out Panel container from left side */}
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white shadow-2xl z-50 p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <span className="font-bold text-xl text-emerald-400">Health Alert</span>
                <button 
                  onClick={() => setShowSidePanel(false)}
                  className="text-slate-300 hover:text-white font-bold text-2xl p-2 focus:outline-none"
                  aria-label="Close panel"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Quick Links */}
              <nav className="flex flex-col gap-3">
                <a 
                  href="/quiz"
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-800 text-slate-100 hover:text-white text-base sm:text-lg font-bold transition-colors border border-slate-800"
                >
                  <span className="text-2xl">❓</span> Health Quiz Page
                </a>
                
                {userRole === 'adult' && (
                  <a 
                    href="/map"
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-800 text-slate-100 hover:text-white text-base sm:text-lg font-bold transition-colors border border-slate-800 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <span className="text-2xl">📍</span> Outbreak Map Page
                  </a>
                )}

                <button 
                  onClick={handleEmergencyClickFromPanel}
                  className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-base sm:text-lg font-bold transition-colors focus:outline-none border border-slate-800"
                >
                  <span className="text-2xl">🚨</span> Emergency Hotlines
                </button>
              </nav>
            </div>

            {/* Profile configuration tracking badge container inside sidebar bottom */}
            <div className="border-t border-slate-800 pt-5 mt-auto">
              <p className="text-xs text-slate-400 font-bold mb-3 uppercase tracking-wider">User Account Settings</p>
              <button
                onClick={() => { setShowSidePanel(false); setShowAgeModal(true); }}
                className="w-full flex justify-between items-center text-sm bg-slate-800 hover:bg-slate-700 p-4 rounded-xl font-bold tracking-wide transition-colors uppercase text-slate-200 focus:outline-none border border-slate-700"
              >
                <span>Active Profile: {userRole}</span>
                <span className="text-xs text-emerald-400 font-extrabold">Change</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- ONLOAD DISCLAIMER POPUP (HIGH CONTRAST / ACCESSIBLE) --- */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Right 'X' Close Button */}
            <button 
              onClick={() => setShowDisclaimerModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 font-extrabold text-2xl p-2 transition-colors focus:outline-none"
              title="Close disclaimer"
            >
              ✕
            </button>

            <div className="text-center mt-3">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">System Notice</h3>
              
              <div className="my-5 bg-slate-100 border-2 border-slate-200 p-4 rounded-xl text-left">
                <p className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Current Default Mode</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-2xl">🎒</span>
                  <span className="font-extrabold text-lg text-sky-950 capitalize">{userRole} Mode</span>
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold pb-2">
                 If you need full features, please change your profile mode to Adult using the header button.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- AGE POPUP DIALOG (OVERLAY - CHILD/ADULT ONLY) --- */}
      {showAgeModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-slate-900 mt-3 tracking-tight">Change Age Profile</h3>
              <p className="text-base text-slate-600 font-semibold mt-1">
                Select your age range to adjust your viewing experience and features.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Option 1: Child */}
              <button 
                onClick={() => handleAgeSelect('child')}
                className="w-full text-left bg-sky-50 hover:bg-sky-100 border-2 border-sky-300 hover:border-sky-400 p-5 rounded-2xl transition-colors flex items-center gap-4 group focus:ring-4 focus:ring-sky-200 focus:outline-none"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">🎒</span>
                <div>
                  <div className="font-extrabold text-sky-950 text-lg">Child</div>
                </div>
              </button>

              {/* Option 2: Adult */}
              <button 
                onClick={() => handleAgeSelect('adult')}
                className="w-full text-left bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 hover:border-emerald-400 p-5 rounded-2xl transition-colors flex items-center gap-4 group focus:ring-4 focus:ring-emerald-200 focus:outline-none"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">💼</span>
                <div>
                  <div className="font-extrabold text-emerald-950 text-lg">Adult</div>
                </div>
              </button>
            </div>

            {/* Cancel button inside modal */}
            <button 
              onClick={() => setShowAgeModal(false)}
              className="mt-6 w-full text-center text-base font-extrabold text-slate-500 hover:text-slate-800 py-3 transition-colors border-t border-slate-100 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- STICKY HEADER & TICKER WRAPPER --- */}
      <div className="sticky top-0 z-30 w-full flex flex-col shadow-md">
        {/* TOP HEADER SECTION (Identical semi-transparent frosted glass design for both modes) */}
        <header className="w-full bg-white/70 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
          {/* Left Side Grouping: Hamburger Icon + App Name Branding */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidePanel(true)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 active:bg-slate-200 transition-colors focus:outline-none focus:ring-3 focus:ring-emerald-500"
              aria-label="Open side panel menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-emerald-800">
            Health Alert
            </h1>
          </div>
          
          {/* Right Corner: Profile State Trigger Link */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAgeModal(true)}
              title="Click to change your age profile"
              className="text-lg sm:text-xl font-black px-6 py-3 rounded-2xl bg-slate-100/90 hover:bg-slate-200 text-slate-900 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-emerald-500"
            >
              Mode: <span className="underline decoration-3 decoration-emerald-500 capitalize">{userRole}</span> 
            </button>
          </div>
        </header>

        {/* --- STICKY CONTINUOUS OUTBREAK TICKER BANNER (Identical dark styling for both modes) --- */}
        <div className="w-full bg-zinc-100 text-slate-100 border-b border-red-500/30 py-3.5 overflow-hidden select-none shadow-[0_4px_12px_rgba(239,68,68,0.1)]">
        <div className="custom-marquee-container whitespace-nowrap text-base sm:text-lg font-bold tracking-wide">
          <span className="text-red-800 font-extrabold">{alertText}</span>
          <span className="text-red-800 font-extrabold">{alertText}</span>
        </div>
      </div>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-4xl w-full mx-auto p-6 flex-grow flex flex-col gap-7 pb-36">
        
        {/* Main Application Title */}
        <div className="text-center sm:text-left mt-3">
          <p className="text-slate-600 text-lg font-bold mt-1.5">
            Stay informed about local health conditions and outbreaks.
          </p>
        </div>

        {/* 1. Rectangular Pro Tip Card */}
        <div className="bg-white/90 backdrop-blur-xs border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
          {/* Dynamic Heading based on the user's role */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💡</span>
            <h3 className="font-extrabold text-emerald-950 text-lg sm:text-xl">
              {userRole === 'child' ? ' Be a Health Hero!' : 'Pro Tip: Health Outbreak Advisory'}
            </h3>
          </div>

          {/* Dynamic Body Text based on the user's role */}
          <div className="text-emerald-900 text-base sm:text-lg leading-relaxed font-semibold">
            {userRole === 'child' ? (
              <div className="flex flex-col gap-2">
                <p className="font-black text-xl text-emerald-950 mb-1">
                  Lots of people in Mauritius are catching the flu right now. Follow these simple rules to keep yourself safe and strong:
                </p>
                <ul className="list-none flex flex-col gap-2 pl-1">
                  <li>🧼 <strong className="text-emerald-950">Wash your hands:</strong> Scrub with soap for 20 seconds after playing and before eating.</li>
                  <li>🥤 <strong className="text-emerald-950">Keep your own things:</strong> Do not share water bottles, juice boxes, snacks, or pencils at school.</li>
                  <li>🤧 <strong className="text-emerald-950">Sneeze into your elbow:</strong> If you feel a cough or a sneeze coming, catch it in your inner sleeve!</li>
                </ul>
              </div>
            ) : (
              <p>
                Flu and seasonal respiratory infections are currently elevated in Mauritius. 
                Remember to wash your hands frequently and consult a health center if you develop a fever.
              </p>
            )}
          </div>
        </div>

        {/* 2. Dynamic Adaptive Grid */}
        <div className={`grid gap-5 my-2 ${userRole === 'child' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          
          {/* Quiz Card */}
          <a 
            href="/quiz" 
            className={`backdrop-blur-xs border-2 border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all group focus:outline-none focus:ring-3 focus:ring-emerald-500
              ${userRole === 'child' 
                ? 'bg-white/95 shadow-md animate-pulse hover:animate-none active:scale-95 hover:scale-[1.02] border-emerald-300' 
                : 'bg-white hover:border-emerald-600 hover:shadow-lg'
              }`}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
              ❓
            </div>
            <span className="text-2xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
              Health Quiz
            </span>
            <p className="text-slate-700 text-sm sm:text-base font-bold mt-2.5 max-w-[240px]">
              Test your knowledge on preventing local outbreaks.
            </p>
          </a>

          {/* Map Card - Completely removed from layout when profile mode is 'child' */}
          {userRole === 'adult' && (
            <a 
              href="/map" 
              className="bg-white border-2 border-slate-200 hover:border-emerald-600 hover:shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all group focus:outline-none focus:ring-3 focus:ring-emerald-500 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                📍
              </div>
              <span className="text-2xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                Outbreak Map
              </span>
              <p className="text-slate-700 text-sm sm:text-base font-bold mt-2.5 max-w-[240px]">
                View real-time case tracking across districts.
              </p>
            </a>
          )}

        </div>
      </main>

     {/* --- NEW: FLOATING CHATBOT IMAGE LINK (ADULT MODE ONLY) --- */}
      {userRole === 'adult' && (
        <a
          href="/chat" /* 🔄 Changed button to link. Set this to your desired page path */
          className="fixed bottom-24 right-6 z-30 w-24 h-24 rounded-full overflow-hidden shadow-2xl border-2 border-emerald-500 hover:scale-110 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-emerald-300 flex items-center justify-center"
          title="Open Assistant Chat"
        >
          <Image 
            src={chatbotImg} 
            alt="Chatbot" 
            width={103} 
            height={103} 
            className="w-full h-full object-cover"
          />
        </a>
      )}

      {/* --- FLOATING FIXED EMERGENCY BANNER (ALWAYS VISIBLE AT BOTTOM) --- */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.15)] bg-slate-900 border-t-2 border-slate-800">
        
        {/* The Drop-up List */}
        {showEmergencyList && (
          <div className="text-white w-full px-6 py-5 border-b-2 border-slate-800 max-h-[60vh] overflow-y-auto relative">
            <div className="max-w-4xl mx-auto">
              
              {/* Absolute positioned "X" button at top-right corner of header section */}
              <div className="flex justify-between items-center mb-5 pb-2 border-b border-slate-800 relative">
                <h4 className="text-sm font-extrabold tracking-wider text-slate-300 uppercase">
                  Mauritius Emergency Hotlines 📞
                </h4>
                <button 
                  onClick={() => setShowEmergencyList(false)}
                  className="absolute -top-1 -right-2 text-slate-400 hover:text-white text-2xl font-black p-2 transition-colors focus:outline-none"
                  title="Close hotlines"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {emergencyNumbers.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-950 px-5 py-4 rounded-xl border border-slate-800">
                    <span className="text-base sm:text-lg font-bold text-slate-200">{item.label}</span>
                    <a 
                      href={`tel:${item.number}`} 
                      className="text-amber-400 hover:text-amber-300 text-lg sm:text-xl font-black tracking-wider focus:outline-none bg-slate-900 px-4 py-2 rounded-lg border border-slate-750 hover:bg-slate-800 transition-colors"
                    >
                      {item.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* The Main Clickable Banner */}
        <button 
          onClick={() => setShowEmergencyList(!showEmergencyList)}
          className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black py-5 px-6 text-center transition-colors duration-150 flex items-center justify-center gap-3 text-base sm:text-lg tracking-wide focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-inset"
        >
          <span className="animate-pulse text-2xl">🚨</span> 
          <span>CRITICAL EMERGENCY? CLICK HERE FOR HELPLINE NUMBERS</span>
          <span className={`transform transition-transform duration-200 text-sm ml-1 ${showEmergencyList ? 'rotate-180' : ''}`}>
            ▲
          </span>
        </button>
      </footer>

    </div>
  );
}