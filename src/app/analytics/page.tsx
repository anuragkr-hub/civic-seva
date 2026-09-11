'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Clock,
  Users,
  ShieldCheck,
  AlertCircle,
  MapPin,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function AnalyticsPage() {
  const { incidents } = useApp();

  // Category counts
  const categoryCounts = {
    potholes: incidents.filter((i) => i.category === 'pothole' || i.category === 'road_damage').length,
    manholes: incidents.filter((i) => i.category === 'open_manhole').length,
    garbage: incidents.filter((i) => i.category === 'garbage_dump' || i.category === 'overflowing_waste').length,
    waterlogging: incidents.filter((i) => i.category === 'waterlogging' || i.category === 'drainage_blockage').length,
    lighting: incidents.filter((i) => i.category === 'broken_streetlight').length,
    footpath: incidents.filter((i) => i.category === 'damaged_footpath').length
  };

  const total = incidents.length || 1;
  const totalCitizensImpacted = incidents.reduce((acc, i) => acc + (i.affectedCitizenCount || 20), 0);

  // Verification metrics
  const markedByAuthority = incidents.filter(
    (i) => i.status === 'marked_resolved' || i.status === 'verified_resolved'
  ).length;
  const verifiedByCitizen = incidents.filter((i) => i.status === 'verified_resolved').length;
  const discrepancyCount = markedByAuthority - verifiedByCitizen;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          KOLKATA MUNICIPAL CIVIC INTELLIGENCE
        </span>
        <h1 className="text-2xl font-bold text-slate-900">
          Civic Insights &amp; Accountability Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
          Real-time accountability telemetry covering issue aging, departmental resolution turnaround, ward concentrations, and citizen ground verification rates.
        </p>
      </div>

      {/* Top Level Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Citizens Impacted</span>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {totalCitizensImpacted.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Calculated across {incidents.length} geo-clusters
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Average Resolution Time</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            2.8 Days
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Fastest: Solid Waste (1.6d) • Slowest: Heavy Infra (6.4d)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Citizen Verification Audit</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600 mt-2">
            {Math.round((verifiedByCitizen / Math.max(1, markedByAuthority)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {discrepancyCount} issues currently undergoing citizen inspection
          </div>
        </div>
      </div>

      {/* Grid: Issue Distribution & Aging Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Distribution (Section 22) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Issue Category Distribution
            </h3>
            <span className="text-xs text-slate-400">Total {incidents.length} cases</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Road Potholes &amp; Structural Damage</span>
                <span>{categoryCounts.potholes} ({Math.round((categoryCounts.potholes / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-600 h-full rounded-full"
                  style={{ width: `${Math.max(15, (categoryCounts.potholes / total) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Open &amp; Hazardous Manholes</span>
                <span>{categoryCounts.manholes} ({Math.round((categoryCounts.manholes / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full"
                  style={{ width: `${Math.max(10, (categoryCounts.manholes / total) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Garbage Dumps &amp; Waste Heaps</span>
                <span>{categoryCounts.garbage} ({Math.round((categoryCounts.garbage / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${Math.max(12, (categoryCounts.garbage / total) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Urban Waterlogging &amp; Drain Chokes</span>
                <span>{categoryCounts.waterlogging} ({Math.round((categoryCounts.waterlogging / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${Math.max(15, (categoryCounts.waterlogging / total) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Broken Streetlights / Dark Corridors</span>
                <span>{categoryCounts.lighting} ({Math.round((categoryCounts.lighting / total) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${Math.max(10, (categoryCounts.lighting / total) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aging Analysis (0-2d, 3-7d, 8-14d, 15+d) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Issue Aging Analysis
            </h3>
            <span className="text-xs text-slate-400">Response Latency</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-emerald-800 font-bold">0–2 Days (Fresh)</div>
              <div className="text-2xl font-black text-emerald-950 mt-1">42%</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Initial triage &amp; inspection</div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-blue-800 font-bold">3–7 Days (In Action)</div>
              <div className="text-2xl font-black text-blue-950 mt-1">36%</div>
              <div className="text-[10px] text-blue-700 mt-0.5">Crew dispatched on site</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-amber-800 font-bold">8–14 Days (Delayed)</div>
              <div className="text-2xl font-black text-amber-950 mt-1">14%</div>
              <div className="text-[10px] text-amber-700 mt-0.5">Approaching SLA breach</div>
            </div>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200">
              <div className="text-red-800 font-bold">15+ Days (Escalated)</div>
              <div className="text-2xl font-black text-red-950 mt-1">8%</div>
              <div className="text-[10px] text-red-700 mt-0.5">Dispatched to Commissioner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Analytics & Repeat Hotspots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Analytics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Authority Claimed vs Citizen Verified
          </h3>
          <p className="text-xs text-slate-500">
            CivicSeva solves false resolution claims by requiring citizen verification photos with AI visual comparison.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Authority Reported Completed:</span>
              <span className="font-bold text-slate-900">{markedByAuthority} cases</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-700">Citizen Verified on Ground:</span>
              <span className="font-bold text-emerald-700">{verifiedByCitizen} cases</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-700">Under Ground Verification:</span>
              <span className="font-bold text-amber-700">{discrepancyCount} cases</span>
            </div>
          </div>
        </div>

        {/* Repeat Hotspots */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            Chronic Repeat Hotspots
          </h3>
          <p className="text-xs text-slate-500">
            Areas where recurring civic breakdowns occur due to underlying infrastructure aging:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">College St &amp; Bowbazar (Ward 48)</span>
                <div className="text-[10px] text-slate-400">Recurring road subsidence &amp; tram track erosion</div>
              </div>
              <span className="font-mono text-xs font-bold text-red-600">High Recurring</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Park Circus 7-Point (Ward 64)</span>
                <div className="text-[10px] text-slate-400">Recurrent stormwater drainage choke</div>
              </div>
              <span className="font-mono text-xs font-bold text-orange-600">Seasonal Peak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
