'use client';

import React from 'react';
import { Logo } from '../../components/Branding/Logo';
import {
  ShieldCheck,
  Cpu,
  Layers,
  MapPin,
  Flame,
  CheckCircle,
  Github,
  Mail,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Logo size="lg" className="justify-center" />
        <h1 className="text-3xl font-extrabold text-slate-900 mt-4">
          Architecting the Future of Civic Accountability
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          CivicSeva is an AI-powered municipal intelligence and verified resolution platform specifically built for <strong>Kolkata, West Bengal, India</strong>.
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            The Problem in Indian Cities
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Existing civic complaint portals function as passive black-hole suggestion boxes. Citizens face clunky manual forms, complaints sit in chronological queues without urgency sorting, multiple citizens file 30 duplicate reports for the same crater, and authorities mark tickets &ldquo;Closed&rdquo; with zero independent verification.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            The CivicSeva Innovation
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            CivicSeva wraps an end-to-end intelligence layer around the entire incident lifecycle: instant AI vision identification, 0–100 multi-factor priority scoring, Haversine duplicate grouping, smart KMC department dispatch, and <strong>AI Before/After Visual Comparison</strong> ensuring citizen sign-off.
          </p>
        </div>
      </div>

      {/* Architectural Pipeline */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-elevated space-y-6">
        <div>
          <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">
            TECHNICAL ARCHITECTURE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            System Architecture &amp; Data Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="font-bold text-orange-400">1. Perception &amp; Triage</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Vision classification model analyzes uploaded frames, extracts structural defect signatures (asphalt cavitation, sewage exposure), and suggests descriptions.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="font-bold text-orange-400">2. Geo-spatial Deduplication</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Haversine geodesic math clusters nearby reports within 300 meters into a single unified Civic Incident, accumulating community confirmations.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="font-bold text-emerald-400">3. Verification &amp; Auditing</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Side-by-side computer vision comparison scores surface repair grade, matching the before and after photos before granting Verified Resolution status.
            </p>
          </div>
        </div>
      </div>

      {/* Kolkata Coverage */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          Coverage: Kolkata Municipal Corporation (KMC)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          CivicSeva is pre-configured with the administrative divisions of Kolkata: Wards 1 to 144 across Boroughs I to XVI, covering North, Central, South, and East Kolkata with routing rules for KMC Civil Roads, Solid Waste Management, Sewerage &amp; Drainage, Lighting, and Kolkata Police Traffic.
        </p>
        <div className="pt-2">
          <Link
            href="/map"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
          >
            Explore Interactive Kolkata Map &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
