"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// --- Mock Data (9 Districts of Mauritius) ---
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

const mockReports = [
  { risk_type: "Dengue Outbreak", description: "Multiple cases reported in this area.", lat: -20.1609, lng: 57.5012, riskLevel: "High" },
  { risk_type: "Stagnant Water 💧", description: "Large pool of water behind the market.", lat: -20.2678, lng: 57.4894, riskLevel: "Medium" },
  { risk_type: "Illegal Dumping 🗑️", description: "Trash accumulating near the river.", lat: -20.0381, lng: 57.6534, riskLevel: "Low" }
];

export default function MapComponent() {
  const [reports, setReports] = useState(mockReports);
  
  // New States for Geolocation
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const defaultCenter: [number, number] = [-20.2838, 57.5458];

  const getRiskColor = (level: string) => {
    if (level === "Low") return "#10b981"; 
    if (level === "Medium") return "#f59e0b"; 
    return "#ef4444"; 
  };

  // --- Geolocation Function ---
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

        {/* If we have the user's location, pan the camera to them and zoom in */}
        {userLocation && <FlyToLocation center={userLocation} zoom={13} />}

        {/* Draw the "Blue Dot" for the User */}
        {userLocation && (
          <CircleMarker 
            center={userLocation} 
            radius={8} 
            pathOptions={{ color: "white", weight: 2, fillColor: "#3b82f6", fillOpacity: 1 }}
          >
            <Popup><span className="font-bold text-blue-600">You are here</span></Popup>
          </CircleMarker>
        )}

        {/* Draw the Hospitals */}
        {mockFacilities.map((facility) => (
          <Marker key={facility.id} position={[facility.lat, facility.lng]} icon={customIcon}>
            <Popup>
              <div className="font-bold text-emerald-700">{facility.name}</div>
              <div className="text-xs text-slate-500 mb-2">{facility.type}</div>
              <a href={`tel:${facility.phone}`} className="btn btn-xs btn-outline btn-success w-full">📞 {facility.phone}</a>
            </Popup>
          </Marker>
        ))}

        {/* Draw Risk Reports */}
        {reports.map((report, idx) => {
          const areaColor = getRiskColor(report.riskLevel);
          return (
            <Circle 
              key={idx}
              center={[report.lat, report.lng]} 
              pathOptions={{ color: areaColor, fillColor: areaColor, fillOpacity: 0.4 }}
              radius={1500} 
            >
              <Popup>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <strong style={{ color: areaColor }} className="block">{report.risk_type}</strong>
                  <span className="badge badge-sm font-bold opacity-80" style={{ backgroundColor: areaColor, color: 'white', border: 'none' }}>
                    {report.riskLevel}
                  </span>
                </div>
                <p className="text-sm m-0 leading-tight text-slate-600">{report.description}</p>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>

      {/* Floating "Locate Me" Button */}
      <div className="absolute bottom-6 right-4 z-[400]">
        <button 
          onClick={handleLocateMe} 
          disabled={isLocating}
          className="btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-none rounded-full px-6 flex items-center gap-2"
        >
          {isLocating ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <span className="text-lg">📍</span>
          )}
          {isLocating ? "Locating..." : "Find Nearby"}
        </button>
      </div>
    </div>
  );
}