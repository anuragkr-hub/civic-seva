'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Users, Shield, Award, RotateCcw, Sparkles, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const RoleBanner: React.FC = () => {
  const { role, setRole, resetAllData, incidents } = useApp();
  const [showTourModal, setShowTourModal] = useState(false);
  const router = useRouter();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'authority') {
      router.push('/authority');
    } else if (newRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/citizen');
    }
  };

  const handleReset = () => {
    if (confirm('Reset CivicSeva database to fresh Kolkata demo data?')) {
      resetAllData();
      alert('CivicSeva demo dataset re-initialized with College Street, Shyambazar, Park Circus & Gariahat incidents!');
    }
  };

  return (
    <>
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-600/20 text-orange-400 font-semibold text-[11px] border border-orange-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            HACKATHON JUDGE MODE
          </span>
          <span className="hidden md:inline text-slate-400">
            Kolkata Municipal Corporation (KMC) Sandbox
          </span>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => handleRoleChange('citizen')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              role === 'citizen'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Citizen
          </button>

          <button
            onClick={() => handleRoleChange('authority')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              role === 'authority'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            KMC Officer
          </button>

          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              role === 'admin'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Guided Tour & Reset Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTourModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:brightness-110 shadow-sm transition-all text-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Demo Guide
          </button>

          <button
            onClick={handleReset}
            title="Reset to default seed incidents"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>
        </div>
      </div>

      {/* Guided Tour Modal for Judges */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowTourModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Judges&apos; Complete Lifecycle Walkthrough
                </h3>
                <p className="text-xs text-slate-500">
                  Follow these steps to experience CivicSeva&apos;s end-to-end intelligence layer:
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">AI Report Wizard</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Click <strong>Report Issue</strong>, pick the preset <em>College Street Pothole</em> image. Watch the AI classify it (94% confidence), reverse-geocode to Ward 48, detect the duplicate #CS-1042, calculate the 91/100 Priority Score, and generate a formal email to KMC Roads Division.
                  </p>
                  <Link
                    href="/report"
                    onClick={() => setShowTourModal(false)}
                    className="inline-block mt-2 text-xs font-medium text-orange-600 hover:text-orange-700 underline"
                  >
                    Open Report Wizard &rarr;
                  </Link>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Authority Priority Queue</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Switch to <strong>KMC Officer</strong> persona. Check the <em>Priority Queue</em> sorted by the 0–100 Civic Priority Score (#1 Open Manhole 97/100, #2 Pothole 91/100). Take action on an incident, update status, and mark work completed.
                  </p>
                  <button
                    onClick={() => {
                      handleRoleChange('authority');
                      setShowTourModal(false);
                    }}
                    className="inline-block mt-2 text-xs font-medium text-orange-600 hover:text-orange-700 underline"
                  >
                    Go to KMC Officer Queue &rarr;
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">AI Before/After Citizen Verification</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Open incident <strong>#CS-1025 (Gariahat Garbage)</strong> or <strong>#CS-1042</strong>. As a citizen, inspect the authority&apos;s repair photo, test the AI Before/After Visual Comparison slider (94% match), and submit the final Citizen Verdict!
                  </p>
                  <Link
                    href="/incident/CS-1025"
                    onClick={() => {
                      setRole('citizen');
                      setShowTourModal(false);
                    }}
                    className="inline-block mt-2 text-xs font-medium text-orange-600 hover:text-orange-700 underline"
                  >
                    Open Gariahat Verification Demo &rarr;
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowTourModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Got it, start testing!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
