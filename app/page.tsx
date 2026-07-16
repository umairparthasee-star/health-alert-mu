"use client";

import React, { useState } from 'react';

export default function Home() {
  const [showEmergencyList, setShowEmergencyList] = useState<boolean>(false);
  
  // --- AGE PERMISSION STATES WITH TYPESCRIPT TYPING ---
  // Tracks if the popup modal is open
  const [showAgeModal, setShowAgeModal] = useState<boolean>(true);
  // Stores the selected user type: 'child' | 'adult' | 'elderly' | null
  const [userRole, setUserRole] = useState<'child' | 'adult' | 'elderly' | null>(null);

  // Hardcoded emergency contacts for Mauritius
  const emergencyNumbers = [
    { label: "Medical Emergency / Ambulance", number: "114" },
    { label: "Ministry of Health Outbreak Hotline", number: "8924" },
    { label: "Police Emergency", number: "999 / 112" },
    { label: "SAMU", number: "114" }
  ];

  // TypeScript typed handler to resolve the ts(7006) error
  const handleAgeSelect = (role: 'child' | 'adult' | 'elderly') => {
    setUserRole(role);
    setShowAgeModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans antialiased text-slate-800 relative">
      
      {/* --- AGE POPUP DIALOG (OVERLAY) --- */}
      {showAgeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-5">
              <span className="text-3xl">👋</span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Welcome to Health App</h3>
              <p className="text-sm text-slate-500 mt-1">
                Please select your age range to help us customize your experience and permissions.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              {/* Option 1: Child */}
              <button 
                onClick={() => handleAgeSelect('child')}
                className="w-full text-left bg-sky-50 hover:bg-sky-100 border border-sky-200 p-3.5 rounded-xl transition-colors flex items-center gap-3 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">🎒</span>
                <div>
                  <div className="font-bold text-sky-900 text-sm">Child / Youth</div>
                  <div className="text-xs text-sky-700">Under 18 years</div>
                </div>
              </button>

              {/* Option 2: Adult */}
              <button 
                onClick={() => handleAgeSelect('adult')}
                className="w-full text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-3.5 rounded-xl transition-colors flex items-center gap-3 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">💼</span>
                <div>
                  <div className="font-bold text-emerald-900 text-sm">Adult</div>
                  <div className="text-xs text-emerald-700">18 – 64 years</div>
                </div>
              </button>

              {/* Option 3: Elderly */}
              <button 
                onClick={() => handleAgeSelect('elderly')}
                className="w-full text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 p-3.5 rounded-xl transition-colors flex items-center gap-3 group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">👵</span>
                <div>
                  <div className="font-bold text-purple-900 text-sm">Senior / Elderly</div>
                  <div className="text-xs text-purple-700">65+ years</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOP HEADER SECTION --- */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-emerald-700">
          🩺 Health App
        </h1>
        
        {/* Right Corner Side Panel */}
        <div className="flex items-center gap-3">
          {/* Visual indicator showcasing their current profile rule */}
          {userRole && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 capitalize">
              Mode: {userRole}
            </span>
          )}
          <button 
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={() => alert(`Side panel clicked. Current profile role is: ${userRole || 'Not selected yet'}`)}
          >
            Menu
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="max-w-4xl w-full mx-auto p-6 flex-grow flex flex-col gap-6">
        
        {/* Main Application Title */}
        <div className="text-center sm:text-left mt-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Health Alert System
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Stay informed about local health conditions and outbreaks.
          </p>
        </div>

        {/* 1. Rectangular Pro Tip Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <h3 className="font-bold text-emerald-900 text-base">
              Pro Tip: Health Outbreak Advisory
            </h3>
          </div>
          {/* Dynamic Advisory text tailored to vulnerable groups if applicable */}
          <p className="text-emerald-800 text-sm leading-relaxed">
            Flu and seasonal respiratory infections are currently elevated in Mauritius. 
            {userRole === 'elderly' && <strong className="block mt-1 text-purple-950">🚨 Senior Notice: High risk groups qualify for fast-tracked flu vaccines at local dispensaries.</strong>}
            {userRole === 'child' && <strong className="block mt-1 text-sky-950">🎒 School Notice: Avoid sharing water bottles or stationery items at school during flu surges.</strong>}
            {(!userRole || userRole === 'adult') && " Remember to wash your hands frequently and consult a health center if you develop a fever."}
          </p>
        </div>

        {/* 2. Two Aligned Clickable Square Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
          
          {/* Quiz Card */}
          <a 
            href="/quiz" 
            className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-105 transition-transform">
              ❓
            </div>
            <span className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
              Health Quiz
            </span>
            <p className="text-slate-500 text-xs mt-2 max-w-[200px]">
              Test your knowledge on preventing local outbreaks.
            </p>
          </a>

          {/* Map Card (🔒 LOCKED FOR CHILDREN & ELDERLY) */}
          {userRole === 'child' || userRole === 'elderly' ? (
            <div 
              className="bg-slate-100 border border-slate-200 opacity-60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-not-allowed relative group"
              title="This high-density data map features are limited for your user profile."
            >
              <div className="absolute top-3 right-3 text-xs font-semibold bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                🔒 Restricted
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xl font-bold mb-4">
                📍
              </div>
              <span className="text-xl font-bold text-slate-400">
                Outbreak Map
              </span>
              <p className="text-slate-400 text-xs mt-2 max-w-[200px]">
                {userRole === 'child' ? 'Not available for accounts under 18.' : 'Simplified viewing mode requested.'}
              </p>
            </div>
          ) : (
            /* Regular Active Map Card for Adults */
            <a 
              href="/map" 
              className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-105 transition-transform">
                📍
              </div>
              <span className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                Outbreak Map
              </span>
              <p className="text-slate-500 text-xs mt-2 max-w-[200px]">
                View real-time case tracking across districts.
              </p>
            </a>
          )}

        </div>
      </main>

      {/* --- BOTTOM EMERGENCY BANNER W/ DROP-UP --- */}
      <footer className="w-full sticky bottom-0 z-40 shadow-2xl">
        
        {/* The Drop-up List */}
        {showEmergencyList && (
          <div className="bg-slate-900 text-white w-full px-6 py-4 border-b border-slate-800">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Mauritius Emergency Hotlines
                </h4>
                <button 
                  onClick={() => setShowEmergencyList(false)}
                  className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1 focus:outline-none"
                >
                  ✕ Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                {emergencyNumbers.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700">
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                    <a href={`tel:${item.number}`} className="text-amber-400 hover:text-amber-300 font-bold text-base tracking-wide focus:outline-none">
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
          className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold py-4 px-6 text-center transition-colors duration-150 flex items-center justify-center gap-2 text-sm sm:text-base tracking-wide focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-inset"
        >
          <span className="animate-pulse text-base">🚨</span> 
          <span>CRITICAL HEALTH EMERGENCY? CLICK HERE FOR NUMBERS</span>
          <span className={`transform transition-transform duration-200 text-xs ml-1 ${showEmergencyList ? 'rotate-180' : ''}`}>
            ▲
          </span>
        </button>
      </footer>

    </div>
  );
}