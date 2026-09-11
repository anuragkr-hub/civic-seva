'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../Branding/Logo';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../types';
import {
  Bell,
  PlusCircle,
  Globe,
  Menu,
  X,
  User,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Shield,
  Award
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    role,
    isAuthenticated,
    logout,
    language,
    setLanguage,
    notifications,
    markNotificationRead,
    t
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login?redirect=/citizen';
    if (role === 'authority') return '/authority';
    if (role === 'admin') return '/admin';
    return '/citizen';
  };

  const navLinks = [
    { href: '/', label: t('home', 'Home') },
    {
      href: isAuthenticated ? '/report' : '/login?redirect=/report',
      label: t('reportIssue', 'Report Issue'),
      highlight: true
    },
    { href: '/map', label: t('civicMap', 'Civic Map') },
    { href: getDashboardLink(), label: t('myIssues', 'My Issues') },
    { href: '/analytics', label: t('civicInsights', 'Civic Insights') },
    { href: '/about', label: t('about', 'About') }
  ];

  const handleLangSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    router.push('/');
  };

  const getRoleBadge = () => {
    if (role === 'authority')
      return { label: t('roleAuthority', 'KMC Officer'), bg: 'bg-blue-600', icon: Shield };
    if (role === 'admin')
      return { label: t('roleAdmin', 'Admin'), bg: 'bg-purple-600', icon: Award };
    return { label: t('roleCitizen', 'Citizen'), bg: 'bg-orange-600', icon: User };
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-95 transition-opacity py-1">
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

        {/* Controls: Language, Notifications, Auth Session */}
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
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in fade-in">
                <button
                  onClick={() => handleLangSelect('en')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    language === 'en'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="text-orange-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handleLangSelect('bn')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    language === 'bn'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>বাংলা (Bengali)</span>
                  {language === 'bn' && <span className="text-orange-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handleLangSelect('hi')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    language === 'hi'
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {language === 'hi' && <span className="text-orange-600 font-bold">✓</span>}
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
                    {t('alerts', 'Civic Alerts')} ({unreadCount} new)
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {t('realTimeFeed', 'Real-time KMC feed')}
                  </span>
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

          {/* Authentication State: Logged In vs Logged Out */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-full ${roleInfo.bg} text-white flex items-center justify-center text-[10px] font-bold`}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block leading-none">
                  <div className="text-xs font-bold text-slate-900 max-w-[110px] truncate">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {roleInfo.label}
                  </div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {user.email || user.phone}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold text-white ${roleInfo.bg}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {roleInfo.label}
                    </span>
                  </div>

                  <div className="py-1 text-xs">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      {t('myDashboardActivity', 'My Dashboard & Activity')}
                    </Link>
                    <Link
                      href="/map"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      {t('civicMap', 'Civic Map')}
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('signOut', 'Sign Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t('signIn', 'Sign In')}
              </Link>
              <Link
                href="/login?tab=register"
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white shadow-sm transition-all hover:scale-105 hidden sm:inline-block"
              >
                {t('register', 'Register')}
              </Link>
            </div>
          )}

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
                pathname === link.href
                  ? 'bg-orange-50 text-orange-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                {t('signIn', 'Sign In')}
              </Link>
              <Link
                href="/login?tab=register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl bg-orange-600 text-white text-xs font-bold"
              >
                {t('register', 'Register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
