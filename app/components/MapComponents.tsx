"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
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

// --- Mock Data for the Demo ---
const mockFacilities = [
  // 1. Port Louis
  { id: 1, name: "Dr A. G. Jeetoo Hospital", type: "Regional Hospital", lat: -20.1625, lng: 57.4966, phone: "2031001" },
  // 2. Plaines Wilhems
  { id: 2, name: "Victoria Hospital (Candos)", type: "Regional Hospital", lat: -20.2678, lng: 57.4894, phone: "4253031" },
  // 3. Flacq
  { id: 3, name: "Dr. Bruno Cheong Hospital", type: "Regional Hospital", lat: -20.1894, lng: 57.7145, phone: "4132532" },
  // 4. Pamplemousses
  { id: 4, name: "SSRN Hospital", type: "Regional Hospital", lat: -20.0984, lng: 57.5701, phone: "2093400" },
  // 5. Grand Port
  { id: 5, name: "Jawaharlal Nehru Hospital", type: "Regional Hospital", lat: -20.4045, lng: 57.5963, phone: "6032000" },
  // 6. Savanne
  { id: 6, name: "Souillac Hospital", type: "District Hospital", lat: -20.5186, lng: 57.5222, phone: "6038000" },
  // 7. Black River
  { id: 7, name: "Yves Cantin Community Hospital", type: "Community Hospital", lat: -20.3601, lng: 57.3685, phone: "4122340" },
  // 8. Rivière du Rempart
  { id: 8, name: "Goodlands Mediclinic", type: "Mediclinic", lat: -20.0381, lng: 57.6534, phone: "2821000" },
  // 9. Moka
  { id: 9, name: "Wellkin Hospital", type: "Private Hospital", lat: -20.2316, lng: 57.5028, phone: "6051000" },
];

const mockReports = [
  { risk_type: "Dengue Outbreak", description: "Multiple cases reported in this area.", lat: -20.1609, lng: 57.5012, riskLevel: "High" }
];

// --- Helper Component to catch map clicks ---
function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapComponent() {
  const [reports, setReports] = useState(mockReports);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Form State
  const [riskType, setRiskType] = useState("Stagnant Water 💧");
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState("High"); 

  const mauritiusCenter: [number, number] = [-20.2838, 57.5458];

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    setReports((prev) => [
      ...prev, 
      { 
        risk_type: riskType, 
        description, 
        lat: selectedLocation.lat, 
        lng: selectedLocation.lng, 
        riskLevel 
      }
    ]);
    
    const modal = document.getElementById('report-modal') as HTMLDialogElement;
    modal.close();
    setSelectedLocation(null);
    setDescription("");
    setRiskLevel("High");
  };

  const getRiskColor = (level: string) => {
    if (level === "Low") return "#10b981"; // Emerald Green
    if (level === "Medium") return "#f59e0b"; // Amber Orange
    return "#ef4444"; // Red (High)
  };

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer center={mauritiusCenter} zoom={11} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationPicker 
          onLocationSelect={(lat, lng) => {
            setSelectedLocation({ lat, lng });
            const modal = document.getElementById('report-modal') as HTMLDialogElement;
            modal.showModal();
          }} 
        />

        {mockFacilities.map((facility) => (
          <Marker key={facility.id} position={[facility.lat, facility.lng]} icon={customIcon}>
            <Popup>
              <div className="font-bold text-emerald-700">{facility.name}</div>
              <div className="text-xs text-slate-500 mb-2">{facility.type}</div>
              <a href={`tel:${facility.phone}`} className="btn btn-xs btn-outline btn-success w-full">📞 {facility.phone}</a>
            </Popup>
          </Marker>
        ))}

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
                <div className="flex items-center justify-between mb-1">
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

        {selectedLocation && (
           <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon}>
             <Popup>Drafting Report...</Popup>
           </Marker>
        )}
      </MapContainer>

      {/* Floating Instructions */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-slate-200">
        <p className="text-xs md:text-sm font-bold text-slate-700">Tap map to report risk ＋</p>
      </div>

      {/* Updated Modal: Forced to the middle, proper spacing */}
      <dialog id="report-modal" className="modal modal-middle">
        <div className="modal-box bg-white rounded-2xl p-6 shadow-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100" onClick={() => setSelectedLocation(null)}>✕</button>
          </form>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-full flex items-center justify-center">
              <span className="text-xl">🚨</span>
            </div>
            <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">Report Risk</h3>
          </div>
          
          <form onSubmit={handleSubmitReport} className="flex flex-col gap-5">
            
            {/* Forced flex-col to ensure label sits directly above input */}
            <div className="flex flex-col gap-1 w-full">
              <label className="font-bold text-slate-700 text-sm">Type of Health Risk</label>
              <select 
                className="select select-bordered w-full bg-slate-50 border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-slate-800 text-base" 
                value={riskType} 
                onChange={(e) => setRiskType(e.target.value)}
              >
                <option>Stagnant Water 💧</option>
                <option>High Mosquito Activity 🦟</option>
                <option>Illegal Dumping 🗑️</option>
                <option>Suspected Dengue Case 🤒</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="font-bold text-slate-700 text-sm">Severity Level</label>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="risk-level" className="radio radio-success radio-sm" value="Low" checked={riskLevel === "Low"} onChange={(e) => setRiskLevel(e.target.value)} />
                  <span className="text-slate-700 font-semibold text-sm">Low</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="risk-level" className="radio radio-warning radio-sm" value="Medium" checked={riskLevel === "Medium"} onChange={(e) => setRiskLevel(e.target.value)} />
                  <span className="text-slate-700 font-semibold text-sm">Medium</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="risk-level" className="radio radio-error radio-sm" value="High" checked={riskLevel === "High"} onChange={(e) => setRiskLevel(e.target.value)} />
                  <span className="text-slate-700 font-semibold text-sm">High</span>
                </label>
              </div>
            </div>

            {/* Forced flex-col fixes the squished text area bug */}
            <div className="flex flex-col gap-1 w-full">
              <label className="font-bold text-slate-700 text-sm">Additional Details</label>
              <textarea 
                className="textarea textarea-bordered w-full h-24 bg-slate-50 border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-slate-800 text-base resize-none leading-relaxed" 
                placeholder="e.g., Large pool of water breeding mosquitoes behind the market..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn bg-red-600 hover:bg-red-700 text-white border-none mt-2 rounded-xl shadow-lg shadow-red-200/50 text-lg h-12 w-full">
              Submit Alert
            </button>
          </form>
        </div>
        
        {/* Slightly darkened backdrop, and removed the word 'close' entirely */}
        <form method="dialog" className="modal-backdrop bg-slate-900/20 backdrop-blur-sm">
          <button onClick={() => setSelectedLocation(null)}>
            <span className="sr-only">Close</span>
          </button>
        </form>
      </dialog>
    </div>
  );
}