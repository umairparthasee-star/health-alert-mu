// components/SubmitFormModal.tsx
import React, { useState, useEffect, useRef } from 'react';

// Strict Discriminated Union for TypeScript Compile-Time Safety
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

interface SubmitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => void;
}

export default function SubmitFormModal({ isOpen, onClose, onSubmit }: SubmitFormModalProps) {
  const [reportType, setReportType] = useState<'disease' | 'health_risk'>('disease');
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Core Form Input State
  const [fields, setFields] = useState({
    diseaseType: '',
    title: '',
    description: '',
    severityType: '',
  });

  // Confirmed Location States
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
    pinX: number;
    pinY: number;
  } | null>(null);

  // Temporary staging placement while choosing points on map
  const [tempLocation, setTempLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
    pinX: number;
    pinY: number;
  } | null>(null);

  // Clear modal states cleanly when changing windows or modes
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

  // Calculates click points relative to map canvas bounding boundaries
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = x / rect.width;
    const pctY = y / rect.height;

    // Generates realistic coordinates matching Mauritius bounds 
    const calculatedLat = parseFloat((-20.0 - pctY * 0.4).toFixed(4)); 
    const calculatedLng = parseFloat((57.3 + pctX * 0.5).toFixed(4));

    // Dynamic localization layout naming simulator
    let mockName = "Moka District, Mauritius";
    if (pctX < 0.35 && pctY < 0.35) mockName = "Port Louis City Centre";
    else if (pctX >= 0.6 && pctY < 0.4) mockName = "Flacq District Landmark";
    else if (pctX < 0.4 && pctY >= 0.6) mockName = "Flic en Flac Coastal Area";
    else if (pctX >= 0.55 && pctY >= 0.65) mockName = "SSR International Airport, Grand Port";

    setTempLocation({
      name: mockName,
      lat: calculatedLat,
      lng: calculatedLng,
      pinX: pctX * 100,
      pinY: pctY * 100,
    });
  };

  const confirmMapLocation = () => {
    if (tempLocation) setSelectedLocation(tempLocation);
    setShowMapPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) {
      alert("Please select and pin a map location before submitting the report.");
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
        
        {/* --- MAP CANVAS WORKSPACE DRAWER PANEL --- */}
        {showMapPicker && (
          <div className="absolute inset-0 bg-white rounded-2xl p-6 z-10 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-base font-bold text-slate-900">Map Location Picker</h4>
                <button 
                  type="button" 
                  onClick={() => setShowMapPicker(false)}
                  className="text-slate-400 hover:text-slate-600 font-medium text-xs"
                >
                  Back
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Click anywhere on the map area below to plot a specific point.
              </p>

              {/* Graphical Visual Canvas Interface */}
              <div 
                ref={mapRef}
                onClick={handleMapClick}
                className="w-full h-52 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 relative overflow-hidden cursor-crosshair shadow-inner flex items-center justify-center select-none"
              >
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Visual Island Center Simulation Mass */}
                <div className="w-32 h-40 bg-emerald-100/60 border border-emerald-200/50 rounded-[45%_55%_35%_65%] blur-[1px] transform rotate-12 flex items-center justify-center text-[9px] text-emerald-800/40 font-bold tracking-widest">
                  MAURITIUS
                </div>

                {tempLocation ? (
                  <div 
                    className="absolute text-2xl transform -translate-x-1/2 -translate-y-full animate-bounce"
                    style={{ left: `${tempLocation.pinX}%`, top: `${tempLocation.pinY}%` }}
                  >
                    📍
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 pointer-events-none text-center px-4">
                    Tap to drop target location pin
                  </span>
                )}
              </div>

              {/* Calculated GPS Details Log */}
              {tempLocation && (
                <div className="mt-4 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1 animate-in fade-in">
                  <div className="font-bold text-slate-700">📍 Pinned Spot:</div>
                  <div className="text-slate-600 truncate">{tempLocation.name}</div>
                  <div className="flex gap-4 text-slate-500 font-mono mt-1 pt-1 border-t border-slate-200/60">
                    <div>Lat: <span className="text-slate-800">{tempLocation.lat}</span></div>
                    <div>Lng: <span className="text-slate-800">{tempLocation.lng}</span></div>
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}

        {/* --- MAIN ROOT REPORT FORM LAYOUT --- */}
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
          
          {/* Segmented Category Selection Selector */}
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

          {/* DYNAMIC BLOCK FIELDS */}
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

          {/* MAP EXTRACTOR INTERACTIVE TRIGGER BUTTON ELEMENT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
              Geographic Location
            </label>
            <button
              type="button"
              onClick={() => setShowMapPicker(true)}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-none"
            >
              📍 {selectedLocation ? "Change Pinned Location" : "Select & Pin Location on Map"}
            </button>

            {selectedLocation && (
              <div className="mt-2 bg-emerald-50 border border-emerald-200/60 rounded-xl p-2.5 text-xs animate-in fade-in">
                <div className="font-semibold text-emerald-900 truncate">
                  ✅ {selectedLocation.name}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                  Coords: {selectedLocation.lat}°N, {selectedLocation.lng}°E
                </div>
              </div>
            )}
          </div>

          {/* Severity Field Box */}
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
              placeholder="e.g., Low, Elevated, Critical Outbreak"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800"
            />
          </div>

          {/* Submit Actions Button Controls */}
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