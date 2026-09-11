'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIncident, IncidentCategory, IncidentSeverity, IncidentStatus } from '../../types';
import { KOLKATA_WARDS } from '../../data/kolkataWards';
import {
  MapPin,
  Filter,
  Flame,
  Layers,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Sparkles,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function CivicMapPage() {
  const { incidents } = useApp();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isHeatmapMode, setIsHeatmapMode] = useState<boolean>(false);

  // Selected Incident for preview drawer
  const [activeIncident, setActiveIncident] = useState<CivicIncident | null>(null);

  // Map viewport bounds for Kolkata
  // Lat: 22.46 (South Kolkata) to 22.63 (North Kolkata) -> Span = 0.17
  // Lng: 88.28 (Howrah / West) to 88.43 (Salt Lake / East) -> Span = 0.15
  const mapBounds = {
    minLat: 22.46,
    maxLat: 22.63,
    minLng: 88.28,
    maxLng: 88.43
  };

  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

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

  const getMarkerColor = (inc: CivicIncident) => {
    if (inc.status === 'verified_resolved') return 'bg-emerald-500 ring-emerald-300';
    if (inc.severity === 'critical') return 'bg-red-600 ring-red-300';
    if (inc.severity === 'high') return 'bg-orange-500 ring-orange-300';
    if (inc.severity === 'medium') return 'bg-amber-500 ring-amber-300';
    return 'bg-slate-500 ring-slate-300';
  };

  return (
    <div className="h-[calc(100vh-101px)] flex flex-col relative overflow-hidden bg-slate-100">
      {/* Top Filter Floating Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 z-30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          <h1 className="text-sm font-bold text-slate-900">
            Kolkata Civic Incident Map
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
            {filteredIncidents.length} active incidents shown
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
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>

          {/* Ward Filter */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All Wards (1-144)</option>
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
            <span>Heatmap Hotspots</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 relative w-full h-full bg-slate-900 overflow-hidden select-none">
        {/* Vector Kolkata Base Grid (Hooghly River, Bridges, Key Roads) */}
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          preserveAspectRatio="none"
          viewBox="0 0 1000 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Map Tint */}
          <rect width="1000" height="700" fill="#0F172A" />

          {/* Grid lines */}
          <g stroke="#1E293B" strokeWidth="0.8">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v_${i}`} x1={i * 50} y1="0" x2={i * 50} y2="700" />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <line key={`h_${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
            ))}
          </g>

          {/* River Hooghly (West Kolkata Boundary) */}
          <path
            d="M 220 0 C 230 150, 180 300, 200 450 C 220 580, 250 650, 270 700"
            stroke="#1E3A8A"
            strokeWidth="45"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Howrah Bridge Connection */}
          <line x1="170" y1="230" x2="270" y2="245" stroke="#EA580C" strokeWidth="4" strokeDasharray="3 2" />
          <text x="140" y="220" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
            Howrah Bridge
          </text>

          {/* Vidyasagar Setu Connection */}
          <line x1="180" y1="410" x2="290" y2="425" stroke="#EA580C" strokeWidth="4" strokeDasharray="3 2" />
          <text x="130" y="400" fill="#94A3B8" fontSize="11" fontFamily="sans-serif">
            Vidyasagar Setu (2nd Hooghly Bridge)
          </text>

          {/* Major Kolkata Arteries: Central Ave, EM Bypass, Diamond Harbour Rd */}
          {/* Central Avenue / CR Avenue */}
          <path d="M 380 90 L 390 380 L 410 650" stroke="#334155" strokeWidth="3" />
          <text x="395" y="180" fill="#64748B" fontSize="10" transform="rotate(85 395 180)">
            Central Avenue / Shyambazar Corridor
          </text>

          {/* EM Bypass Corridor */}
          <path d="M 680 70 C 720 250, 750 450, 780 680" stroke="#334155" strokeWidth="4" />
          <text x="730" y="320" fill="#64748B" fontSize="10" transform="rotate(75 730 320)">
            Eastern Metropolitan (EM) Bypass
          </text>

          {/* Diamond Harbour Road */}
          <path d="M 320 420 L 260 680" stroke="#334155" strokeWidth="3" />
          <text x="270" y="550" fill="#64748B" fontSize="10" transform="rotate(75 270 550)">
            Diamond Harbour Rd (Behala)
          </text>
        </svg>

        {/* Heatmap Layer (Glowing density circles if toggled) */}
        {isHeatmapMode && (
          <div className="absolute inset-0 pointer-events-none">
            {filteredIncidents.map((inc) => {
              const { x, y } = projectToMap(inc.latitude, inc.longitude);
              return (
                <div
                  key={`heat_${inc.id}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-orange-600/30 blur-2xl animate-pulse"
                />
              );
            })}
          </div>
        )}

        {/* Interactive Incident Markers */}
        <div className="absolute inset-0">
          {filteredIncidents.map((inc) => {
            const { x, y } = projectToMap(inc.latitude, inc.longitude);
            const isSelected = activeIncident?.id === inc.id;

            return (
              <div
                key={inc.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                onClick={() => setActiveIncident(inc)}
              >
                {/* Ping animation for critical issues */}
                {inc.severity === 'critical' && (
                  <span className="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75" />
                )}

                {/* Marker Badge */}
                <div
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full text-white font-extrabold text-[11px] shadow-lg ring-4 transition-transform hover:scale-125 ${getMarkerColor(
                    inc
                  )} ${isSelected ? 'scale-125 ring-white' : ''}`}
                >
                  {inc.priorityScore}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                  <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-xl border border-slate-700">
                    <div className="font-bold">
                      #{inc.id} • {inc.categoryDisplay}
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Ward {inc.ward} • {inc.priorityScore}/100 Priority
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Controls (Zoom / Legend) */}
        <div className="absolute bottom-6 right-6 z-30 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-white text-xs space-y-2 shadow-xl">
          <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
            Priority Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-300" />
            <span>Critical (&gt;85)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-300" />
            <span>High Priority (70-84)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-300" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300" />
            <span>Citizen Verified Fixed</span>
          </div>
        </div>
      </div>

      {/* Slide-Up Incident Preview Card */}
      {activeIncident && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-white rounded-2xl p-4 shadow-elevated border border-slate-200 z-40 animate-in slide-in-from-bottom">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                #{activeIncident.id}
              </span>
              <span className="text-xs font-bold text-slate-900">
                {activeIncident.categoryDisplay}
              </span>
            </div>
            <button
              onClick={() => setActiveIncident(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-2.5 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
              {activeIncident.title}
            </h4>

            <div className="flex items-center gap-2">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={activeIncident.images[0]}
                  alt="Incident thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-[11px] text-slate-600 leading-snug">
                <div className="font-semibold text-slate-900">
                  Ward {activeIncident.ward} • {activeIncident.borough}
                </div>
                <div className="text-slate-500 truncate max-w-[200px]">
                  {activeIncident.address}
                </div>
                <div className="text-orange-600 font-bold mt-0.5">
                  Score: {activeIncident.priorityScore}/100 • {activeIncident.confirmationCount} Confirmations
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              {activeIncident.status.replace('_', ' ')}
            </span>
            <Link
              href={`/incident/${activeIncident.id}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm"
            >
              Open Details &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
