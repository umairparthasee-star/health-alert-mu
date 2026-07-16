"use client";
import Image from 'next/image';
import chatbotImg from './chatbot.png';
//import React, { useState } from 'react';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================
export type SubmitData =
  | {
      type: 'disease';
      diseaseType: string;
      locationName: string;
      latitude: number;
      longitude: number;
      severityType: string;
    }
  | {
      type: 'health_risk';
      title: string;
      description: string;
      locationName: string;
      latitude: number;
      longitude: number;
      severityType: string;
    };

// ============================================================================
// 2. SUBMIT FORM MODAL COMPONENT (WITH REAL INTERACTIVE OPENSTREETMAP)
// ============================================================================
interface SubmitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => void;
}

function SubmitFormModal({ isOpen, onClose, onSubmit }: SubmitFormModalProps) {
  const [reportType, setReportType] = useState<'disease' | 'health_risk'>('disease');
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);
  
  // Leaflet CDN loading & Map Reference states
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const [fields, setFields] = useState({
    diseaseType: '',
    title: '',
    description: '',
    severityType: '',
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  const [tempLocation, setTempLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  // --- DYNAMICALLY LOAD LEAFLET MAP SCRIPTS FROM CDN ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Append Leaflet Stylesheet
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(stylesheet);

    // Append Leaflet Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // --- INITIALIZE REAL MAP OVER MAURITIUS ---
  useEffect(() => {
    if (!leafletLoaded || !showMapPicker || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Prevent duplicate map initialization
    if (mapInstance.current) return;

    // Center map specifically over Mauritius
    const map = L.map(mapContainerRef.current, {
      center: [-20.2759, 57.5522],
      zoom: 10,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstance.current = map;

    // Click handler to drop pin and geocode real area location name
    map.on('click', async (e: any) => {
      const { lat, lng } = e.latlng;

      if (markerInstance.current) {
        markerInstance.current.setLatLng([lat, lng]);
      } else {
        markerInstance.current = L.marker([lat, lng]).addTo(map);
      }

      // Query OpenStreetMap free reverse geocoding service
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`
        );
        const data = await response.json();
        const address = data.address || {};
        
        const town = address.suburb || address.village || address.town || address.city || "Local Area";
        const district = address.state || address.county || "Mauritius";
        const matchedName = `${town}, ${district}`;

        setTempLocation({
          name: matchedName,
          lat: parseFloat(lat.toFixed(4)),
          lng: parseFloat(lng.toFixed(4)),
        });
      } catch (error) {
        setTempLocation({
          name: "Custom Spot in Mauritius",
          lat: parseFloat(lat.toFixed(4)),
          lng: parseFloat(lng.toFixed(4)),
        });
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [leafletLoaded, showMapPicker]);

  // Clean form details on visibility shifts
  useEffect(() => {
    if (isOpen) {
      setFields({ diseaseType: '', title: '', description: '', severityType: '' });
      setSelectedLocation(null);
      setTempLocation(null);
      setShowMapPicker(false);
    }
  }, [reportType, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const confirmMapLocation = () => {
    if (tempLocation) {
      setSelectedLocation(tempLocation);
    }
    setShowMapPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please open the map and pin a location before submitting.");
      return;
    }

    if (reportType === 'disease') {
      onSubmit({
        type: 'disease',
        diseaseType: fields.diseaseType,
        locationName: selectedLocation.name,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        severityType: fields.severityType,
      });
    } else {
      onSubmit({
        type: 'health_risk',
        title: fields.title,
        description: fields.description,
        locationName: selectedLocation.name,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        severityType: fields.severityType,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative">
        
        {/* --- MAP CANVAS DRAWER PANEL --- */}
        {showMapPicker && (
          <div className="absolute inset-0 bg-white rounded-2xl p-6 z-50 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-bold text-slate-950">Interactive Map Location Picker</h4>
                <button 
                  type="button" 
                  onClick={() => setShowMapPicker(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
                >
                  Back
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Click anywhere on the map grid below to plant a pin and extract coordinates.
              </p>

              {/* REAL Leaflet Interactive Map Container */}
              <div 
                ref={mapContainerRef}
                className="w-full h-64 bg-slate-100 rounded-xl border-2 border-slate-200 relative overflow-hidden shadow-inner z-0"
              >
                {!leafletLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-xs font-semibold text-slate-500">
                    🌀 Loading OpenStreetMap...
                  </div>
                )}
              </div>

              {/* Real-time Address & Coordinates Readout */}
              {tempLocation && (
                <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1 animate-in fade-in duration-150">
                  <div className="font-bold text-slate-700">📍 Pinned Spot:</div>
                  <div className="text-emerald-800 font-semibold truncate">{tempLocation.name}</div>
                  <div className="flex gap-4 text-slate-500 font-mono mt-1 pt-1 border-t border-slate-200/60">
                    <div>Lat: <span className="text-slate-800 font-bold">{tempLocation.lat}</span></div>
                    <div>Lng: <span className="text-slate-800 font-bold">{tempLocation.lng}</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 mt-4">
              <button 
                type="button"
                onClick={() => setShowMapPicker(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={!tempLocation}
                onClick={confirmMapLocation}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}

        {/* --- MAIN ROOT FORM --- */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Submit Health Report</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg focus:outline-none"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 text-center">
              Report Category
            </label>
            <div className="bg-slate-100 p-1 rounded-xl flex items-center relative grid grid-cols-2 border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => setReportType('disease')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center focus:outline-none ${
                  reportType === 'disease'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50 scale-[1.01]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🦠 Disease
              </button>

              <button
                type="button"
                onClick={() => setReportType('health_risk')}
                className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center focus:outline-none ${
                  reportType === 'health_risk'
                    ? 'bg-white text-amber-700 shadow-sm border border-slate-200/50 scale-[1.01]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ⚠️ Health Risk
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {reportType === 'disease' ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                  Disease Type
                </label>
                <input 
                  type="text" 
                  name="diseaseType"
                  required
                  value={fields.diseaseType}
                  onChange={handleInputChange}
                  placeholder="e.g., Dengue Fever, Influenza"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                  Title
                </label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={fields.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Stagnant Water Accumulation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
                  Description
                </label>
                <textarea 
                  name="description"
                  required
                  rows={2}
                  value={fields.description}
                  onChange={handleInputChange}
                  placeholder="Describe the nature of the public health risk..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none text-slate-800"
                />
              </div>
            </div>
          )}

          {/* Map Location Selector Button */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Geographic Location Area of the Issue
            </label>
            
            <button
              type="button"
              onClick={() => setShowMapPicker(true)}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              📍 {selectedLocation ? "Modify Pinned Coordinates" : "Open Map Workspace & Drop Pin"}
            </button>

            {selectedLocation && (
              <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs animate-in fade-in tracking-wide">
                <div className="font-bold text-emerald-900 flex items-center gap-1">
                  <span>✨</span> <span className="truncate">{selectedLocation.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  GPS Position: {selectedLocation.lat}°N, {selectedLocation.lng}°E
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Severity Type
            </label>
            <input 
              type="text" 
              name="severityType"
              required
              value={fields.severityType}
              onChange={handleInputChange}
              placeholder="e.g., Low, Moderate, Severe Outbreak"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 3. MAIN PAGE / HOME COMPONENT (DEFAULT EXPORT)
// ============================================================================
export default function Home() {
  const [showEmergencyList, setShowEmergencyList] = useState<boolean>(false);

  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(true);
  const [showAgeModal, setShowAgeModal] = useState<boolean>(false);
  
  // Stores current active role state: 'child' | 'adult'
  const [userRole, setUserRole] = useState<'child' | 'adult'>('child');

  // --- SIDE PANEL STATE ---
  const [showSidePanel, setShowSidePanel] = useState<boolean>(false);

  // --- SUBMIT FORM MODAL STATE ---
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  // --- NEW: CHATBOT STATE ---
  const [showChatbotModal, setShowChatbotModal] = useState<boolean>(false);

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

const handleSubmitForm = async (data: SubmitData) => {

    try {
      // Maps React camelCase states to the Supabase database snake_case columns
      const payload = {
        risk_type: data.type, // 'disease' or 'health_risk'
        disease_type: data.type === 'disease' ? data.diseaseType : null,
        location_name: data.locationName,
        description: data.type === 'health_risk' 
          ? data.description 
          : `Monitored tracking for ${data.diseaseType} active.`,
        severity_level: data.severityType,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      const response = await fetch('/api/heatzones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Database rejected the submission.');
      }

      console.log('Saved to Supabase successfully:', result.data);
      setShowFormModal(false);
      alert('Thank you! Your health report has been submitted and saved.');

    } catch (error: any) {
      console.error('Submission Failed:', error);
      alert(`Could not save report: ${error.message || 'Server offline'}`);
    } finally {
     
    }
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
          <Link 
          href={userRole === 'child' ? '/quiz/kids' : '/quiz'} 
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
        </Link>

          {/* Map Card - Completely removed from layout when profile mode is 'child' */}
    

          {/* Map Card */}
          {userRole === 'child' ? (
            <div 
              className="bg-slate-100 border-2 border-slate-200 opacity-60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-not-allowed relative group"
              title="This high-density data map features are limited for your user profile."
            >
              <div className="absolute top-3 right-3 text-xs font-semibold bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                🔒 Restricted
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-3xl mb-4">
                📍
              </div>
              <span className="text-2xl font-black text-slate-400">
                Outbreak Map
              </span>
              <p className="text-slate-400 text-sm sm:text-base font-bold mt-2.5 max-w-[240px]">
                {userRole === 'child' ? 'Not available for accounts under 18.' : 'Simplified viewing mode requested.'}
              </p>
            </div>
          ) : (
            <Link
              href="/mappage"
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
            </Link>
          )}

          {/* Submit Details Card */}
         {/* Submit Details Card */}
        {userRole === 'child' ? (
          <div 
            className="bg-slate-100 border-2 border-slate-200 opacity-60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-not-allowed relative group"
            title="This high-density data data submission feature is limited for your user profile."
          >
            <div className="absolute top-3 right-3 text-xs font-semibold bg-slate-200 px-2 py-0.5 rounded text-slate-600">
              🔒 Restricted
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-3xl mb-4">
              📝
            </div>
            <span className="text-2xl font-black text-slate-400">
              Submit Details
            </span>
            <p className="text-slate-400 text-sm sm:text-base font-bold mt-2.5 max-w-[240px]">
              Only available for adult user profiles.
            </p>
          </div>
        ) : (
          <button 
            onClick={() => setShowFormModal(true)}
            className="bg-white border-2 border-slate-200 hover:border-emerald-600 hover:shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all group focus:outline-none focus:ring-3 focus:ring-emerald-500 animate-in fade-in zoom-in-95 duration-200 w-full"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
              📝
            </div>
            <span className="text-2xl font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
              Submit Details
            </span>
            <p className="text-slate-700 text-sm sm:text-base font-bold mt-2.5 max-w-[240px]">
              Fill in details for specific risk track mapping.
            </p>
          </button>
        )}

        </div>
      </main>

      <SubmitFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSubmitForm}
      />

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