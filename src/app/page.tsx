'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import {
  Camera,
  Sparkles,
  MapPin,
  Flame,
  Shield,
  FileText,
  ShieldCheck,
  CheckCircle,
  Layers
} from 'lucide-react';

export default function HomePage() {
  const { t } = useApp();
  const [demoActiveCategory, setDemoActiveCategory] = useState<'pothole' | 'manhole' | 'garbage'>('pothole');

  const demoData = {
    pothole: {
      title: 'Deep Asphalt Crater & Pothole',
      ward: 48,
      location: 'College Street, Bowbazar',
      confidence: 94,
      priority: 91,
      authority: 'KMC Roads & Asphalt Dept',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    },
    manhole: {
      title: 'Uncovered Sewage Manhole Cavity',
      ward: 10,
      location: 'Shyambazar 5-Point Crossing',
      confidence: 97,
      priority: 97,
      authority: 'KMC Sewerage & Drainage Dept',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    },
    garbage: {
      title: 'Illegal Solid Waste & Garbage Overflow',
      ward: 85,
      location: 'Gariahat Market Footpath',
      confidence: 93,
      priority: 78,
      authority: 'KMC Solid Waste Management (SWM)',
      image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    }
  };

  const activeDemo = demoData[demoActiveCategory];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              {t('kolkataCivicIntelligence', 'KOLKATA CIVIC INTELLIGENCE PLATFORM')}
            </div>

            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-orange-600">
                {t('brandName', 'CivicSeva')} • {t('tagline', 'See. Report. Resolve.')}
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                {t('heroHeadline', 'Turn everyday civic problems into visible civic action.')}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {t(
                'heroSubtitle',
                'Report roads, potholes, garbage dumps, drainage, streetlights, and waterlogging across Kolkata. CivicSeva converts scattered complaints into structured, deduplicated, prioritized Civic Incidents with citizen-verified resolution.'
              )}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/report"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-lg shadow-orange-600/20 transition-all hover:scale-105 hover:shadow-xl"
              >
                <Camera className="w-4 h-4" />
                {t('reportIssueCta', 'Report a Civic Issue')}
              </Link>
              <Link
                href="/map"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 text-sm font-bold shadow-sm transition-all hover:border-slate-400"
              >
                <MapPin className="w-4 h-4 text-orange-600" />
                {t('exploreMapCta', 'Explore Civic Map')}
              </Link>
            </div>

            {/* Quick Kolkata Municipal Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200/80">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {t('kmc144Wards', '144 KMC Wards')}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Shield className="w-4 h-4 text-orange-600" />
                {t('directKmcDeptRouting', 'Direct KMC Dept Routing')}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Sparkles className="w-4 h-4 text-purple-600" />
                {t('aiBeforeAfterVerification', 'AI Before/After Verification')}
              </span>
            </div>
          </div>

          {/* Right: Interactive AI Pipeline Live Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-elevated relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-mono text-slate-400 ml-1">
                    CivicSeva Vision Triage
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                  LIVE SIMULATION
                </span>
              </div>

              {/* Mini Selector */}
              <div className="flex items-center gap-1.5 py-2.5">
                <button
                  onClick={() => setDemoActiveCategory('pothole')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    demoActiveCategory === 'pothole'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pothole
                </button>
                <button
                  onClick={() => setDemoActiveCategory('manhole')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    demoActiveCategory === 'manhole'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Manhole
                </button>
                <button
                  onClick={() => setDemoActiveCategory('garbage')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                    demoActiveCategory === 'garbage'
                      ? 'bg-slate-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Garbage
                </button>
              </div>

              {/* Preview Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 mt-1 border border-slate-200">
                <img
                  src={activeDemo.image}
                  alt={activeDemo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-[10px] font-bold">
                  {t('confidence', 'AI Confidence')}: {activeDemo.confidence}%
                </div>
                <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-orange-600 text-white rounded text-[10px] font-extrabold shadow">
                  {t('priority', 'Priority')}: {activeDemo.priority}/100
                </div>
              </div>

              {/* AI Inference Details */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900">{activeDemo.title}</div>
                <div className="text-[11px] text-slate-500">
                  📍 {activeDemo.location} • {t('ward', 'Ward')} {activeDemo.ward}
                </div>
                <div className="text-[11px] text-orange-700 font-semibold pt-1 border-t border-slate-200">
                  ⚡ Auto-Routed to: {activeDemo.authority}
                </div>
              </div>

              <div className="mt-3 text-center">
                <Link
                  href="/report"
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  Test Full Reporting Flow &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 5-STAGE PROCESS PIPELINE */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <div>
            <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">
              {t('howItWorks', 'How CivicSeva Works')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('processPipeline', 'Detect → Prioritize → Route → Act → Verify')}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
              How CivicSeva replaces black-hole government complaints with transparent, verified civic resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-left">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-white text-sm">{t('snap', 'Snap Evidence')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Capture on-ground photos with automatic geolocation and Kolkata ward mapping.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-white text-sm">{t('aiAnalyze', 'AI Analyze')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vision models classify the issue, flag duplicates within 300m, and calculate a 0–100 priority score.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-white text-sm">{t('route', 'Route to Authority')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct matching with KMC Roads, SWM, Drainage, or Lighting divisions and official email generation.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-white text-sm">{t('track', 'Track Progress')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track crew mobilization transparently. Automatic escalation triggers if response exceeds 7 days.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h3 className="font-bold text-white text-sm">{t('verify', 'Citizen Verify')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Citizens inspect completed repairs using AI Before/After visual comparison before sign-off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE INNOVATION FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">
            ENGINEERED FOR REAL CIVIC IMPACT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Six Intelligent Layers Built Into Every Incident
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. AI Issue Detection
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computer vision instantly classifies potholes, open manholes, garbage heaps, and waterlogging with confidence scores, eliminating confusing manual forms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. {t('priorityScore', 'Civic Priority Score')} (0–100)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates urgency using safety hazard, citizen impact, and proximity to schools, hospitals, and transit hubs so critical emergencies are never buried.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. {t('duplicateDetection', 'Duplicate Issue Detection')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scans nearby existing reports within 300m. Citizens can confirm existing issues (&ldquo;I&rsquo;m facing this too&rdquo;) instead of generating 25 fragmented tickets.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              4. Smart Authority Routing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maps category and ward to the exact responsible Kolkata Municipal Corporation department and Executive Engineer with official contact details.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              5. {t('officialEmailGen', 'Official Grievance Generator')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drafts a formal, evidence-backed email to the Municipal Commissioner with exact GPS coordinates and citizen consent before sending.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              6. {t('beforeAfterAi', 'AI Before/After Resolution Verification')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorities cannot close tickets unilaterally. Citizens upload after-photos, and an AI visual comparison engine audits whether the hazard was actually fixed.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHAT MAKES CIVICSEVA DIFFERENT? */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">
              PARADIGM SHIFT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('whatMakesDifferent', 'What makes CivicSeva different?')}
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              {t(
                'differentDesc',
                'CivicSeva does not simply collect complaints. It converts citizen reports into structured civic incidents and follows them through resolution and citizen verification.'
              )}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="font-bold text-slate-500 text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Generic Complaint Portals
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Long, tedious text forms with manual category selection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Chronological FIFO queue: pothole filed yesterday waits behind non-urgent requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>25 citizens reporting the same pothole create 25 separate tickets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Authority marks &ldquo;Closed&rdquo; with no visual proof or citizen verification.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-orange-50/70 border-2 border-orange-300 space-y-4 shadow-sm">
              <div className="font-bold text-orange-700 text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                CivicSeva Intelligence Platform
              </div>
              <ul className="space-y-3 text-xs text-slate-800 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>AI auto-detects issue, coordinates, ward, and authority in 2 seconds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>0–100 Priority Engine elevates hazardous open manholes and hospital routes to the top.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Spatial clustering combines duplicate reports into 1 high-urgency Civic Incident.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Dual sign-off: Authority uploads completion photo &rarr; Citizen verifies with AI comparison.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold">
              Ready to take civic action in your ward?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Join thousands of Kolkata citizens turning municipal problems into verified, transparent public resolutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              href="/report"
              className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-lg transition-transform hover:scale-105"
            >
              {t('reportIssueCta', 'Report a Civic Issue Now')}
            </Link>
            <Link
              href="/map"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
            >
              {t('exploreMapCta', 'Explore Kolkata Civic Map')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
