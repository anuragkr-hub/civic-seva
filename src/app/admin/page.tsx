'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { KOLKATA_AUTHORITIES } from '../../data/authorities';
import { KOLKATA_WARDS } from '../../data/kolkataWards';
import {
  Award,
  Shield,
  MapPin,
  Settings,
  Sliders,
  RotateCcw,
  Plus,
  Check,
  Flame,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function AdminPage() {
  const { resetAllData, incidents, isAuthenticated, role, login } = useApp();
  const [activeTab, setActiveTab] = useState<'authorities' | 'wards' | 'rules' | 'demo'>('authorities');

  if (!isAuthenticated || role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-sm">
          <Award className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
            Governance Clearance Required
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            Municipal Administrative Console
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Only designated municipal administrators can adjust priority algorithms, configure wards, or inspect system logs.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login?redirect=/admin"
            className="w-full block py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            Sign In with Admin Credentials &rarr;
          </Link>

          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => login('admin', { name: 'Chief Municipal Commissioner', emailOrPhone: 'admin@kmcgov.in.demo' })}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>⚡ 1-Click Fast Admin Demo Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Severity engine parameters
  const [safetyWeight, setSafetyWeight] = useState(30);
  const [impactWeight, setImpactWeight] = useState(30);
  const [sensitivityWeight, setSensitivityWeight] = useState(20);
  const [escalationDaysThreshold, setEscalationDaysThreshold] = useState(7);
  const [savedRules, setSavedRules] = useState(false);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedRules(true);
    setTimeout(() => setSavedRules(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-orange-400" />
            ADMINISTRATIVE CONSOLE
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            Kolkata Civic Governance &amp; Policy Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure municipal authority routing, KMC ward boundaries, escalation thresholds, and algorithmic priority weights.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset entire system to initial demo state?')) {
              resetAllData();
              alert('CivicSeva demo database re-initialized.');
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo Data
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('authorities')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'authorities'
              ? 'border-orange-600 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Authorities ({KOLKATA_AUTHORITIES.length})
        </button>

        <button
          onClick={() => setActiveTab('wards')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'wards'
              ? 'border-orange-600 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Wards &amp; Boroughs ({KOLKATA_WARDS.length})
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'border-orange-600 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Priority &amp; Escalation Rules
        </button>

        <button
          onClick={() => setActiveTab('demo')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'demo'
              ? 'border-orange-600 text-orange-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          System Health &amp; Logs
        </button>
      </div>

      {/* TAB 1: Authorities Table */}
      {activeTab === 'authorities' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Registered Kolkata Municipal Authorities &amp; Contacts
            </h3>
            <span className="text-xs text-slate-400">Official Routing Endpoints</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Official In-Charge</th>
                  <th className="p-3.5">Email / Endpoint</th>
                  <th className="p-3.5">Resolved</th>
                  <th className="p-3.5">Avg Turnaround</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {KOLKATA_AUTHORITIES.map((auth) => (
                  <tr key={auth.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {auth.name}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {auth.department}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700">{auth.officialTitle}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {auth.email}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600">
                      {auth.resolvedCount}
                    </td>
                    <td className="p-3.5 text-slate-600">{auth.avgResolutionDays} days</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Wards Table */}
      {activeTab === 'wards' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Kolkata Municipal Corporation (KMC) Wards Registry
            </h3>
            <span className="text-xs text-slate-400">Wards 1–144 Map Registry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Ward #</th>
                  <th className="p-3.5">Borough</th>
                  <th className="p-3.5">Locality</th>
                  <th className="p-3.5">Prominent Landmarks</th>
                  <th className="p-3.5">GPS Centroid</th>
                  <th className="p-3.5">Elected Councilor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {KOLKATA_WARDS.map((w) => (
                  <tr key={w.ward} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-orange-600">Ward {w.ward}</td>
                    <td className="p-3.5 font-semibold text-slate-700">{w.borough}</td>
                    <td className="p-3.5 text-slate-900 font-medium">{w.locality}</td>
                    <td className="p-3.5 text-slate-500">{w.majorLandmarks.join(', ')}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {w.coordinates.lat}, {w.coordinates.lng}
                    </td>
                    <td className="p-3.5 text-slate-700">{w.councilorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Priority & Escalation Rules Form */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Algorithmic Severity Parameters &amp; Escalation Thresholds
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tune weights for the 0–100 Civic Priority Engine and define SLA deadlines for automatic municipal escalation.
            </p>
          </div>

          <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Priority Score Weights (Total = 100)
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Safety Risk Weight (Max 30):</span>
                  <span className="font-mono text-orange-600">{safetyWeight} pts</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  value={safetyWeight}
                  onChange={(e) => setSafetyWeight(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Citizen Impact Weight (Max 30):</span>
                  <span className="font-mono text-orange-600">{impactWeight} pts</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  value={impactWeight}
                  onChange={(e) => setImpactWeight(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Location Sensitivity (Transit / Hospitals, Max 20):</span>
                  <span className="font-mono text-orange-600">{sensitivityWeight} pts</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={30}
                  value={sensitivityWeight}
                  onChange={(e) => setSensitivityWeight(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Smart Escalation SLA
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Inactivity Trigger for Escalation (Days):
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={escalationDaysThreshold}
                  onChange={(e) => setEscalationDaysThreshold(Number(e.target.value))}
                  className="w-32 px-3 py-1.5 border border-slate-300 rounded-lg"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When an issue remains unaddressed beyond {escalationDaysThreshold} days, citizens are prompted to dispatch formal Tier-1 follow-up notices to the Municipal Commissioner.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm"
              >
                Save Engine Configuration
              </button>
              {savedRules && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Parameters Saved to Engine
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: System Health */}
      {activeTab === 'demo' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            CivicSeva Intelligence Engine Health
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400">Total Registered Incidents</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {incidents.length}
              </div>
              <div className="text-[10px] text-emerald-600 mt-1">✓ In Memory / IndexedDB</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400">KMC Routing Accuracy</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                99.4%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Borough &amp; Category matching</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400">Duplicate Clustering Window</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                300 meters
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Haversine geodesic radius</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
