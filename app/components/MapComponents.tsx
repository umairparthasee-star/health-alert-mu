"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================
export interface Report {
  disease_type: string;
  risk_type: 'disease' | 'health_risk';
  location_name: string;
  description: string | null;
  severity_level: string;
  latitude: number;
  longitude: number;
}

// --- The Bulletproof Map Pin Fix ---
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- Helper Component to smoothly pan the map ---
function FlyToLocation({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 }); // Smooth animation
  }, [center, zoom, map]);
  return null;
}

// --- Mock Facilities (Hospitals of Mauritius) ---
const mockFacilities = [
  { id: 1, name: "Dr A. G. Jeetoo Hospital", type: "Regional Hospital", lat: -20.1625, lng: 57.4966, phone: "2031001" },
  { id: 2, name: "Victoria Hospital (Candos)", type: "Regional Hospital", lat: -20.2678, lng: 57.4894, phone: "4253031" },
  { id: 3, name: "Dr. Bruno Cheong Hospital", type: "Regional Hospital", lat: -20.1894, lng: 57.7145, phone: "4132532" },
  { id: 4, name: "SSRN Hospital", type: "Regional Hospital", lat: -20.0984, lng: 57.5701, phone: "2093400" },
  { id: 5, name: "Jawaharlal Nehru Hospital", type: "Regional Hospital", lat: -20.4045, lng: 57.5963, phone: "6032000" },
  { id: 6, name: "Souillac Hospital", type: "District Hospital", lat: -20.5186, lng: 57.5222, phone: "6038000" },
  { id: 7, name: "Yves Cantin Community Hospital", type: "Community Hospital", lat: -20.3601, lng: 57.3685, phone: "4122340" },
  { id: 8, name: "Goodlands Mediclinic", type: "Mediclinic", lat: -20.0381, lng: 57.6534, phone: "2821000" },
  { id: 9, name: "Wellkin Hospital", type: "Private Hospital", lat: -20.2316, lng: 57.5028, phone: "6051000" },
];

// --- Mock Data Fallback (Aligned with Supabase Database format) ---
const MOCK_REPORTS: Report[] = [
  { 
    disease_type: "Dengue", 
    risk_type: "disease", 
    location_name: "Port Louis Central", 
    description: "Multiple cases reported in this area.", 
    severity_level: "High", 
    latitude: -20.1609, 
    longitude: 57.5012 
  },
  { 
    disease_type: "Stagnant Water 💧", 
    risk_type: "health_risk", 
    location_name: "Victoria Park", 
    description: "Large pool of water behind the market.", 
    severity_level: "Medium", 
    latitude: -20.2678, 
    longitude: 57.4894 
  },
  { 
    disease_type: "Illegal Dumping 🗑️", 
    risk_type: "health_risk", 
    location_name: "Goodlands Coastline", 
    description: "Trash accumulating near the river.", 
    severity_level: "Low", 
    latitude: -20.0381, 
    longitude: 57.6534 
  }
];

interface MapComponentProps {
  reports?: Report[]; // Optional prop falling back to MOCK_REPORTS
}

export default function MapComponent({ reports = MOCK_REPORTS }: MapComponentProps) {
  // Geolocation States
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const defaultCenter: [number, number] = [-20.2838, 57.5458];

  // Robust risk color helper supporting multiple input naming conventions (High, Elevated, Medium, etc.)
  const getRiskColor = (level: string) => {
    const lower = level ? level.toLowerCase() : "";
    if (lower.includes("low")) return "#10b981"; // Emerald Green
    if (lower.includes("medium") || lower.includes("moderate") || lower.includes("elevated")) return "#f59e0b"; // Amber Orange
    return "#ef4444"; // Rose Red (High, Severe, Critical)
  };

  // --- Geolocation Handler ---
  const handleLocateMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLocating(false);
        },
        (error) => {
          console.error("Location error:", error);
          alert("Could not get your location. Please check browser permissions.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pan smoothly to the user location if calculated */}
        {userLocation && <FlyToLocation center={userLocation} zoom={13} />}

        {/* User Geolocation Blue Dot Marker */}
        {userLocation && (
          <CircleMarker 
            center={userLocation} 
            radius={8} 
            pathOptions={{ color: "white", weight: 2, fillColor: "#3b82f6", fillOpacity: 1 }}
          >
            <Popup><span className="font-bold text-blue-600">You are here</span></Popup>
          </CircleMarker>
        )}

        {/* Draw Hospitals */}
        {mockFacilities.map((facility) => (
          <Marker key={facility.id} position={[facility.lat, facility.lng]} icon={customIcon}>
            <Popup>
              <div className="font-bold text-emerald-700">{facility.name}</div>
              <div className="text-xs text-slate-500 mb-2">{facility.type}</div>
              <a href={`tel:${facility.phone}`} className="btn btn-xs btn-outline btn-success w-full">📞 {facility.phone}</a>
            </Popup>
          </Marker>
        ))}

        {/* Draw Dynamic Risk Circles (Updated with your database schema fields) */}
        {reports.map((report, idx) => {
          const areaColor = getRiskColor(report.severity_level);
          return (
            <Circle 
              key={idx}
              center={[report.latitude, report.longitude]} 
              pathOptions={{ color: areaColor, fillColor: areaColor, fillOpacity: 0.4 }}
              radius={1500} 
            >
              <Popup>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <strong style={{ color: areaColor }} className="block">
                    {report.risk_type === 'disease' ? '🦠' : '⚠️'} {report.disease_type}
                  </strong>
                  <span className="badge badge-sm font-bold opacity-80" style={{ backgroundColor: areaColor, color: 'white', border: 'none' }}>
                    {report.severity_level}
                  </span>
                </div>
                {report.location_name && (
                  <div className="text-xs font-semibold text-slate-500 mb-1.5">📍 {report.location_name}</div>
                )}
                {report.description && (
                  <p className="text-sm m-0 leading-tight text-slate-600">{report.description}</p>
                )}
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>

      {/* Floating Locate Button */}
      <div className="absolute bottom-6 right-4 z-[400]">
        <button 
          onClick={handleLocateMe} 
          disabled={isLocating}
          className="btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-none rounded-full px-6 flex items-center gap-2"
        >
          {isLocating ? (
            <span className="loading loading-spinner loading-sm animate-spin">🌀</span>
          ) : (
            <span className="text-lg">📍</span>
          )}
          {isLocating ? "Locating..." : "Find Nearby"}
        </button>
      </div>
    </div>
  );
}