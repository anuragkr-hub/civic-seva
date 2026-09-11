'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../Branding/Logo';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../types';
import {
  Bell,
  MapPin,
  PlusCircle,
  BarChart3,
  Globe,
  Menu,
  X,
  User,
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, language, setLanguage, notifications, markNotificationRead, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/report', label: 'Report Issue', highlight: true },
    { href: '/map', label: 'Civic Map' },
    { href: role === 'authority' ? '/authority' : role === 'admin' ? '/admin' : '/citizen', label: 'My Issues' },
    { href: '/analytics', label: 'Civic Insights' },
    { href: '/about', label: 'About' },
  ];

  const handleLangSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-[37px] z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <Logo size="md" showTagline={true} />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow hover:scale-[1.02]"
                >
                  <PlusCircle className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-orange-600 bg-orange-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls: Language, Notifications, Role Profile */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'EN' : language === 'bn' ? 'বাংলা' : 'हिन्दी'}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in">
                <button
                  onClick={() => handleLangSelect('en')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    language === 'en' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  English {language === 'en' && '✓'}
                </button>
                <button
                  onClick={() => handleLangSelect('bn')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    language === 'bn' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  বাংলা (Bengali) {language === 'bn' && '✓'}
                </button>
                <button
                  onClick={() => handleLangSelect('hi')}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                    language === 'hi' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  हिन्दी (Hindi) {language === 'hi' && '✓'}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                    Civic Alerts ({unreadCount} new)
                  </div>
                  <span className="text-[11px] text-slate-400">Real-time KMC feed</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No alerts currently</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-lg transition-colors cursor-pointer text-xs ${
                          n.read ? 'opacity-70 hover:bg-slate-50' : 'bg-orange-50/50 hover:bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {n.type === 'escalation' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-snug">{n.message}</p>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => setNotifOpen(false)}
                            className="inline-block mt-1 text-[11px] font-medium text-orange-600 hover:underline"
                          >
                            View Incident &rarr;
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Badge */}
          <Link
            href={role === 'authority' ? '/authority' : role === 'admin' ? '/admin' : '/citizen'}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {role === 'authority' ? 'KMC' : role === 'admin' ? 'ADM' : 'CIT'}
            </div>
            <span className="text-xs font-semibold text-slate-800 capitalize hidden sm:inline">
              {role === 'authority' ? 'Officer' : role}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === link.href ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
