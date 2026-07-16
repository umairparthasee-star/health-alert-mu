"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./MapComponents"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 animate-pulse flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      <p className="text-slate-500 font-semibold">Loading Mauritius Health Radar...</p>
    </div>
  ),
});

export default function Map() { //
    //map funciton
  return <DynamicMap />;
}