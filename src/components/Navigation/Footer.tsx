import React from 'react';
import Link from 'next/link';
import { Logo } from '../Branding/Logo';
import { ShieldCheck, Heart, Github, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3">
            <Logo size="md" inverse={true} />
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              AI-powered civic intelligence, smart deduplication, priority routing and citizen-verified resolution for Kolkata, West Bengal.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Detect &rarr; Prioritize &rarr; Route &rarr; Act &rarr; Verify
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Report Civic Issue
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white transition-colors">
                  Kolkata Civic Map & Heatmap
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="hover:text-white transition-colors">
                  Citizen Activity Portal
                </Link>
              </li>
              <li>
                <Link href="/authority" className="hover:text-white transition-colors">
                  KMC Officer Priority Queue
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-white transition-colors">
                  Ward-level Civic Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Kolkata Coverage */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Kolkata Coverage
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                <span>KMC Wards 1 to 144 (Boroughs I to XVI)</span>
              </li>
              <li className="text-[11px] text-slate-500">
                College Street • Shyambazar • Park Circus
              </li>
              <li className="text-[11px] text-slate-500">
                Gariahat • Behala • Jadavpur • B.B.D. Bagh
              </li>
              <li className="pt-1 text-slate-400">
                Connected with: KMC Roads, SWM, Sewerage & Drainage, WBSEDCL, Kolkata Police Traffic
              </li>
            </ul>
          </div>

          {/* Col 4: Hackathon Notice & Open Source */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Hackathon Project
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Built for production hackathon demonstration. Full source code structured for instant deployment to GitHub Pages and Vercel.
            </p>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CivicSeva Intelligence Core v1.0</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} CivicSeva Kolkata. “Turning Civic Problems into Civic Action.”
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400">
              Architecture & API
            </Link>
            <span>•</span>
            <span className="text-orange-400">KMC Demo Sandbox Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
