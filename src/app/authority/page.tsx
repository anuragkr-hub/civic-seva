'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CivicIncident, IncidentStatus } from '../../types';
import {
  Shield,
  Flame,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Filter,
  FileCheck,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function AuthorityDashboardPage() {
  const { incidents, refreshIncidents, addNotification, isAuthenticated, role, login } = useApp();
  const [departmentFilter, setDepartmentFilter] = useState('all');

  if (!isAuthenticated || (role !== 'authority' && role !== 'admin')) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Officer Clearance Required
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            KMC Operations Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            This operational dashboard and priority queue is restricted to authorized Kolkata Municipal Corporation engineers and department officers.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login?redirect=/authority"
            className="w-full block py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            Sign In with KMC Credentials &rarr;
          </Link>

          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => login('authority', { name: 'Er. A. K. Sengupta', emailOrPhone: 'roads.kmc.demo@kmcgov.in.demo', department: 'Civil Infrastructure & Roads' })}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>⚡ 1-Click Fast Officer Demo Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculations
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length;
  const highPriorityCount = incidents.filter((i) => i.severity === 'high').length;
  const unresolvedCount = incidents.filter((i) => i.status !== 'verified_resolved').length;
  const resolvedCount = incidents.filter((i) => i.status === 'marked_resolved' || i.status === 'verified_resolved').length;
  const awaitingVerifyCount = incidents.filter((i) => i.status === 'marked_resolved').length;
  const overdueCount = incidents.filter((i) => i.status === 'escalated').length || 1;

  // Priority Queue: Sorted descending by Priority Score
  const priorityQueue = [...incidents].sort((a, b) => b.priorityScore - a.priorityScore);

  const verifiedRate = Math.round(
    (incidents.filter((i) => i.status === 'verified_resolved').length /
      Math.max(1, incidents.filter((i) => i.status === 'marked_resolved' || i.status === 'verified_resolved').length)) *
      100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-600/30 text-orange-400 font-bold text-xs border border-orange-500/40">
              <Shield className="w-3.5 h-3.5" />
              KMC OPERATIONS CONTROL DESK
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Kolkata Grid
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Command &amp; Priority Queue
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Autonomous triage ranking driven by the 0–100 Civic Priority Engine. Incidents are prioritized by public safety hazard and citizen density rather than chronological FIFO queues.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center">
            <div className="text-xs text-slate-400">Citizen Verified Rate</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">
              {verifiedRate}%
            </div>
            <div className="text-[10px] text-slate-400">Audit-Approved</div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid (Section 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-soft">
          <div className="text-xs font-bold text-red-600 uppercase flex items-center gap-1">
            <Flame className="w-4 h-4" />
            Critical Issues
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {criticalCount}
          </div>
          <div className="text-[10px] text-red-500 font-medium mt-0.5">Immediate danger</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-200 shadow-soft">
          <div className="text-xs font-bold text-orange-600 uppercase flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            High Priority
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {highPriorityCount}
          </div>
          <div className="text-[10px] text-orange-600 font-medium mt-0.5">Score &gt; 70</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Unresolved
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {unresolvedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">In queue / action</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Resolved
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {resolvedCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Repairs completed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-soft">
          <div className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1">
            <FileCheck className="w-4 h-4" />
            Awaiting Verification
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">
            {awaitingVerifyCount}
          </div>
          <div className="text-[10px] text-blue-500 font-medium mt-0.5">Citizen inspection</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-300 shadow-soft bg-red-50/30">
          <div className="text-xs font-bold text-red-700 uppercase flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Overdue (&gt;7d)
          </div>
          <div className="text-2xl font-black text-red-700 mt-2">
            {overdueCount}
          </div>
          <div className="text-[10px] text-red-600 font-semibold mt-0.5">SLA breach notice</div>
        </div>
      </div>

      {/* 2-Column Section: Priority Queue & Ops Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Intelligent Priority Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Dynamic Civic Priority Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically ordered by civic impact, accident likelihood, and citizen confirmations.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Sorted by Priority Score &darr;
            </span>
          </div>

          <div className="space-y-3">
            {priorityQueue.map((inc, rankIdx) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                      rankIdx === 0
                        ? 'bg-red-600 text-white'
                        : rankIdx === 1
                        ? 'bg-orange-600 text-white'
                        : rankIdx === 2
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{rankIdx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-600">
                        #{inc.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold uppercase">
                        {inc.categoryDisplay}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        Ward {inc.ward} ({inc.borough})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {inc.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="text-orange-600 font-bold">
                        Score: {inc.priorityScore}/100
                      </span>
                      <span>•</span>
                      <span>{inc.confirmationCount} confirmations</span>
                      <span>•</span>
                      <span>Dept: {inc.responsibleAuthorityName.split(' ')[1] || 'Civil'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <Link
                    href={`/incident/${inc.id}`}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1 transition-transform hover:scale-105"
                  >
                    Take Action &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Kolkata Ward Distribution & Operations Analytics */}
        <div className="space-y-6">
          {/* Ward Hotspots */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              Most Reported Kolkata Hotspots
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Ward 48 (College Street / Bowbazar)</div>
                  <div className="text-[11px] text-slate-500">Borough V • Central Kolkata</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                  24 Reports
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Ward 10 (Shyambazar 5-Point)</div>
                  <div className="text-[11px] text-slate-500">Borough II • North Kolkata</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold">
                  19 Reports
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Ward 85 (Gariahat Crossing)</div>
                  <div className="text-[11px] text-slate-500">Borough VIII • South Kolkata</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  16 Reports
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Ward 64 (Park Circus 7-Point)</div>
                  <div className="text-[11px] text-slate-500">Borough VII • Central East</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                  14 Reports
                </span>
              </div>
            </div>
          </div>

          {/* Average Resolution Times */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Department Turnaround Times
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Solid Waste Management (SWM):</span>
                <span className="font-bold text-emerald-600">1.6 days</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[35%]" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600">Lighting &amp; Electrical Wing:</span>
                <span className="font-bold text-emerald-600">2.1 days</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[45%]" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600">Sewerage &amp; Drainage Dept:</span>
                <span className="font-bold text-orange-600">2.9 days</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[60%]" />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600">Roads &amp; Asphalt Division:</span>
                <span className="font-bold text-orange-600">3.8 days</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[75%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
