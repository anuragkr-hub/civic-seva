'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Activity,
  CheckCircle,
  ShieldCheck,
  ThumbsUp,
  AlertTriangle,
  PlusCircle,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function CitizenDashboardPage() {
  const { incidents, t, isAuthenticated, login } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            {t('citizenProfileRequired', 'Citizen Profile Required')}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            {t('myActivityTitle', 'My Civic Activity')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {t(
              'citizenSignInNotice',
              'Please sign in to track your submitted reports, view community confirmations, and inspect completed government work.'
            )}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login?redirect=/citizen"
            className="w-full block py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            {t('signIn', 'Sign In')} &rarr;
          </Link>

          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() =>
                login('citizen', {
                  emailOrPhone: 'suvro@kolkata.in'
                })
              }
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-orange-50 hover:border-orange-300 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{t('quickCitizenDemo', '⚡ 1-Click Fast Citizen Demo Login')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalReports = incidents.length + 6;
  const activeCount = incidents.filter((i) => i.status !== 'verified_resolved').length;
  const resolvedCount = incidents.filter(
    (i) => i.status === 'marked_resolved' || i.status === 'verified_resolved'
  ).length;
  const verifiedCount = incidents.filter((i) => i.status === 'verified_resolved').length;
  const totalConfirmations = incidents.reduce((acc, i) => acc + i.confirmationCount, 0);
  const totalEscalations = incidents.reduce((acc, i) => acc + i.escalationCount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {t('citizenDesk', 'CITIZEN ACCOUNTABILITY DESK')}
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('myActivityTitle', 'My Civic Activity & Kolkata Reports')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'myActivitySubtitle',
              'Track your submitted civic issues, confirm neighborhood reports, and inspect completed government repairs.'
            )}
          </p>
        </div>

        <Link
          href="/report"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow transition-transform hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          {t('reportNewIssue', 'Report New Issue')}
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-orange-600" />
            {t('totalReports', 'Total Reports')}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalReports}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across Kolkata</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-600" />
            {t('activeIssues', 'Active')}
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-2">{activeCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In KMC pipeline</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {t('resolvedWork', 'Resolved')}
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{resolvedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Work finished</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            {t('citizenVerified', 'Verified')}
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{verifiedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Citizen verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <ThumbsUp className="w-4 h-4 text-purple-600" />
            {t('communityConfirmations', 'Confirmations')}
          </div>
          <div className="text-2xl font-extrabold text-purple-600 mt-2">
            {totalConfirmations}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">&ldquo;Facing this too&rdquo;</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            {t('totalEscalations', 'Escalations')}
          </div>
          <div className="text-2xl font-extrabold text-red-600 mt-2">{totalEscalations}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Tier-1 &amp; 2 notices</div>
        </div>
      </div>

      {/* Citizen Action Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {t('myActivityTitle', 'Recent Civic Incidents in Your Area')}
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Live updates from KMC Boroughs
          </span>
        </div>

        <div className="space-y-3">
          {incidents.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              {t('noIncidentsYet', 'No incidents reported in this view.')}
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                    <img
                      src={inc.images[0]}
                      alt={inc.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-600">
                        #{inc.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold uppercase">
                        {inc.categoryDisplay}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inc.status === 'verified_resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inc.status === 'marked_resolved'
                            ? 'bg-blue-100 text-blue-800'
                            : inc.status === 'escalated'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inc.status === 'verified_resolved'
                          ? t('verifiedResolution', 'Verified Resolution')
                          : inc.status === 'marked_resolved'
                          ? t('awaitingVerification', 'Awaiting Verification')
                          : inc.status === 'escalated'
                          ? t('escalated', 'Escalated')
                          : inc.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">{inc.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-600" />
                        {t('ward', 'Ward')} {inc.ward} ({inc.borough})
                      </span>
                      <span>•</span>
                      <span className="text-orange-600 font-semibold">
                        {t('priority', 'Priority')}: {inc.priorityScore}/100
                      </span>
                      <span>•</span>
                      <span>
                        {inc.confirmationCount} {t('communityConfirmations', 'confirmations')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <Link
                    href={`/incident/${inc.id}`}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>{t('viewDetailsBtn', 'Track & Verify')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
