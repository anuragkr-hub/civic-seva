'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '../../context/AppContext';
import { CivicIncident } from '../../types';
import { KOLKATA_WARDS } from '../../data/kolkataWards';
import {
  MapPin,
  Flame,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Dynamically load the OpenStreetMap component on client side (prevents SSR window errors)
const OSMMap = dynamic(() => import('../../components/Map/OSMMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-3">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-xs font-bold text-slate-700">
        Loading Kolkata OpenStreetMap (OSM)...
      </div>
      <p className="text-[11px] text-slate-400">
        Connecting live Kolkata street tiles &amp; civic coordinates...
      </p>
    </div>
  )
});

export default function CivicMapPage() {
  const { incidents, t } = useApp();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isHeatmapMode, setIsHeatmapMode] = useState<boolean>(false);

  // Selected Incident for preview drawer
  const [activeIncident, setActiveIncident] = useState<CivicIncident | null>(null);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
      if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
      if (selectedWard !== 'all' && inc.ward !== Number(selectedWard)) return false;
      if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
      return true;
    });
  }, [incidents, selectedCategory, selectedSeverity, selectedWard, selectedStatus]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col relative overflow-hidden bg-slate-100">
      {/* Top Filter Floating Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 z-30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              {t('civicMap', 'Kolkata Civic Incident Map')}
            </h1>
            <span className="text-[11px] text-slate-500 font-medium">
              OpenStreetMap (OSM) Live Kolkata Grid
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold ml-2">
            {filteredIncidents.length} incidents
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            <option value="pothole">Potholes & Roads</option>
            <option value="open_manhole">Open Manholes</option>
            <option value="garbage_dump">Solid Waste / Dumps</option>
            <option value="waterlogging">Waterlogging</option>
            <option value="broken_streetlight">Broken Streetlights</option>
            <option value="damaged_footpath">Damaged Footpaths</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical (Score 85+)</option>
            <option value="high">High (Score 70-84)</option>
            <option value="medium">Medium Priority</option>
          </select>

          {/* Ward Filter */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-orange-500 max-w-[160px] truncate"
          >
            <option value="all">All Kolkata Wards (1-144)</option>
            {KOLKATA_WARDS.map((w) => (
              <option key={w.ward} value={w.ward}>
                Ward {w.ward} ({w.locality})
              </option>
            ))}
          </select>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setIsHeatmapMode(!isHeatmapMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              isHeatmapMode
                ? 'bg-orange-600 text-white shadow-sm'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap Density</span>
          </button>
        </div>
      </div>

      {/* Main Map Container using OpenStreetMap (OSM) */}
      <div className="flex-1 relative w-full h-full">
        <OSMMap
          incidents={filteredIncidents}
          activeIncident={activeIncident}
          onSelectIncident={(inc) => setActiveIncident(inc)}
          isHeatmapMode={isHeatmapMode}
          selectedWard={selectedWard}
        />

        {/* Floating Priority Legend */}
        <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 text-slate-800 text-xs space-y-2 shadow-xl">
          <div className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
            Priority Scoring Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 border border-white shadow-xs" />
            <span className="font-medium text-slate-700">Critical (Score 85–100)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-orange-600 border border-white shadow-xs" />
            <span className="font-medium text-slate-700">High Priority (70–84)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-xs" />
            <span className="font-medium text-slate-700">Medium Priority (&lt;70)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white shadow-xs" />
            <span className="font-medium text-slate-700">Citizen Verified Fixed</span>
          </div>
        </div>

        {/* Slide-Up Incident Preview Card */}
        {activeIncident && (
          <div className="absolute bottom-6 right-6 w-full max-w-sm sm:w-96 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 z-30 animate-in slide-in-from-bottom-5">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  #{activeIncident.id}
                </span>
                <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                  {activeIncident.categoryDisplay}
                </span>
              </div>
              <button
                onClick={() => setActiveIncident(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2.5 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                {activeIncident.title}
              </h4>

              <div className="flex items-center gap-2.5">
                <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                  <img
                    src={activeIncident.images[0]}
                    alt="Incident thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[11px] text-slate-600 leading-snug flex-1">
                  <div className="font-semibold text-slate-900">
                    Ward {activeIncident.ward} • {activeIncident.borough}
                  </div>
                  <div className="text-slate-500 line-clamp-1">
                    {activeIncident.address}
                  </div>
                  <div className="text-orange-600 font-bold mt-1 flex items-center justify-between">
                    <span>Priority Score: {activeIncident.priorityScore}/100</span>
                    <span className="text-slate-500 font-normal">
                      {activeIncident.confirmationCount} confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  activeIncident.status === 'verified_resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeIncident.status === 'marked_resolved'
                    ? 'bg-blue-100 text-blue-800'
                    : activeIncident.status === 'escalated'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeIncident.status.replace('_', ' ')}
              </span>

              <Link
                href={`/incident/${activeIncident.id}`}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
              >
                <span>Open Full Incident</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
