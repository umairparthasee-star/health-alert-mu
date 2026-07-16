import Map from "./Map"; 
import Link from "next/link"; 

export default function MapPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        {/* Navigation & Header */}
        <div className="space-y-3">
          <Link href="/" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Outbreak Map</h1>
          <p className="text-slate-500 text-sm md:text-base">
            View real-time case tracking, locate hospitals, and monitor health risks across districts.
          </p>
        </div>

        {/* Instruction Banner (Updated for Dashboard Mode) */}
        <div className="bg-[#ebfef4] border border-[#a7f3d0] rounded-xl p-4 flex gap-3 items-start shadow-sm">
          <span className="text-xl">📍</span>
          <div>
            <h3 className="font-bold text-[#065f46] text-sm md:text-base">Live Outbreak Dashboard</h3>
            <p className="text-[#064e3b] text-xs md:text-sm mt-1 leading-relaxed">
              This map displays real-time health risks reported by citizens. Tap any map marker to view hospital contact details, or tap a colored zone to read the local risk report.
            </p>
          </div>
        </div>

        {/* The Map Container - Responsive height & clean borders */}
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-2 md:p-4 h-[60vh] min-h-[500px] flex flex-col">
          <div className="flex-grow rounded-xl overflow-hidden border border-slate-100">
            <Map />
          </div>
        </div>

      </div>
    </main>
  );
}