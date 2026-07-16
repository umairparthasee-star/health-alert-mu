"use client";

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
  const [showAgeModal, setShowAgeModal] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'child' | 'adult' | 'elderly' | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const emergencyNumbers = [
    { label: "Medical Emergency / Ambulance", number: "114" },
    { label: "Ministry of Health Outbreak Hotline", number: "8924" },
    { label: "Police Emergency", number: "999 / 112" },
    { label: "SAMU", number: "114" }
  ];

  const handleAgeSelect = (role: 'child' | 'adult' | 'elderly') => {
    setUserRole(role);
    setShowAgeModal(false);
  };

  const handleFormSubmit = async (data: SubmitData) => {
    setIsSubmitting(true);

    const unifiedPayload = {
      disease_type: data.type === 'disease' ? data.diseaseType : data.title,
      risk_type: data.type, // 'disease' | 'health_risk'
      location_name: data.locationName,
      
      // Updated: Returns the actual description for a health risk, or null for a disease
      description: data.type === 'health_risk' ? data.description : null,
      
      severity_level: data.severityType,
      latitude: data.latitude,
      longitude: data.longitude
    };

    try {
      const response = await fetch('/api/heatzones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unifiedPayload),
      });

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      alert('Report successfully submitted to database!');
      setShowFormModal(false);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to send report. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
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

      {/* --- REFERENCED SUBMIT FORM COMPONENT --- */}
      <SubmitFormModal 
        isOpen={showFormModal} 
        onClose={() => setShowFormModal(false)} 
        onSubmit={handleFormSubmit} 
      />

      {/* --- TOP HEADER SECTION --- */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold tracking-tight text-emerald-700">
          🩺 Health App
        </h1>
        
        <div className="flex items-center gap-3">
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
        
        <div className="text-center sm:text-left mt-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Health Alert System
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Stay informed about local health conditions and outbreaks.
          </p>
        </div>

        {/* Rectangular Pro Tip Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <h3 className="font-bold text-emerald-900 text-base">
              Pro Tip: Health Outbreak Advisory
            </h3>
          </div>
          <p className="text-emerald-800 text-sm leading-relaxed">
            Flu and seasonal respiratory infections are currently elevated in Mauritius. 
            {userRole === 'elderly' && <strong className="block mt-1 text-purple-950">🚨 Senior Notice: High risk groups qualify for fast-tracked flu vaccines at local dispensaries.</strong>}
            {userRole === 'child' && <strong className="block mt-1 text-sky-950">🎒 School Notice: Avoid sharing water bottles or stationery items at school during flu surges.</strong>}
            {(!userRole || userRole === 'adult') && " Remember to wash your hands frequently and consult a health center if you develop a fever."}
          </p>
        </div>

        {/* 2. Three Aligned Clickable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
          
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

          {/* Map Card */}
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
            <Link
              href="/mappage"
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
            </Link>
          )}

          {/* Submit Details Card */}
          {userRole === 'child' || userRole === 'elderly' ? (
            <div 
              className="bg-slate-100 border border-slate-200 opacity-60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-not-allowed relative group"
              title="This high-density data data submission feature is limited for your user profile."
            >
              <div className="absolute top-3 right-3 text-xs font-semibold bg-slate-200 px-2 py-0.5 rounded text-slate-600">
                🔒 Restricted
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xl font-bold mb-4">
                📝
              </div>
              <span className="text-xl font-bold text-slate-400">
                Submit Details
              </span>
              <p className="text-slate-400 text-xs mt-2 max-w-[200px]">
                Only available for adult user profiles.
              </p>
            </div>
          ) : (
            <button 
              onClick={() => setShowFormModal(true)}
              className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all group focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-105 transition-transform">
                📝
              </div>
              <span className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                Submit Details
              </span>
              <p className="text-slate-500 text-xs mt-2 max-w-[200px]">
                Fill in details for specific risk track mapping.
              </p>
            </button>
          )}

        </div>
      </main>

      {/* --- BOTTOM EMERGENCY BANNER W/ DROP-UP --- */}
      <footer className="w-full sticky bottom-0 z-40 shadow-2xl">
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

        <button 
          onClick={() => setShowEmergencyList(!showEmergencyList)}
          className={[
            "w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
            "text-slate-950 font-bold py-4 px-6 text-center transition-colors",
            "duration-150 flex items-center justify-center gap-2 text-sm",
            "sm:text-base tracking-wide focus:outline-none focus:ring-4",
            "focus:ring-amber-300 focus:ring-inset"
          ].join(" ")}
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