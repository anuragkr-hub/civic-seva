'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { KOLKATA_WARDS } from '../../data/kolkataWards';
import { Logo } from '../../components/Branding/Logo';
import {
  Users,
  Shield,
  Award,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  LogIn,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';
  const tabParam = searchParams.get('tab');

  const { login, register } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    tabParam === 'register' ? 'register' : 'login'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');

  // Form inputs
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [ward, setWard] = useState<number>(48);
  const [department, setDepartment] = useState('Civil Infrastructure & Roads');
  const [adminKey, setAdminKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailOrPhone.trim()) {
      setErrorMessage('Please provide an email address or mobile number.');
      return;
    }

    if (activeTab === 'register' && !name.trim()) {
      setErrorMessage('Please enter your full name to register.');
      return;
    }

    let res;
    if (activeTab === 'register') {
      res = register(selectedRole, {
        name: name.trim(),
        emailOrPhone: emailOrPhone.trim(),
        password: password || 'password123',
        ward,
        department
      });
    } else {
      res = login(selectedRole, {
        emailOrPhone: emailOrPhone.trim(),
        password: password || adminKey
      });
    }

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed.');
      return;
    }

    // Only redirect when authentication succeeds
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      if (selectedRole === 'authority') router.push('/authority');
      else if (selectedRole === 'admin') router.push('/admin');
      else router.push('/citizen');
    }
  };

  // Quick 1-Click Fast Persona Logins (Pre-seeded in demo registry)
  const handleQuickLogin = (role: UserRole) => {
    setErrorMessage('');
    if (role === 'citizen') {
      const res = login('citizen', {
        emailOrPhone: 'suvro@kolkata.in'
      });
      if (res.success) {
        router.push(redirectUrl || '/citizen');
      }
    } else if (role === 'authority') {
      const res = login('authority', {
        emailOrPhone: 'roads.kmc.demo@kmcgov.in.demo'
      });
      if (res.success) {
        router.push(redirectUrl || '/authority');
      }
    } else {
      const res = login('admin', {
        emailOrPhone: 'admin@kmcgov.in.demo',
        password: 'admin123'
      });
      if (res.success) {
        router.push(redirectUrl || '/admin');
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
          <Logo size="lg" className="justify-center" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          {activeTab === 'login' ? 'Sign In to CivicSeva' : 'Register New Account'}
        </h1>
        <p className="text-xs text-slate-500">
          Access AI civic reporting, municipal routing, and verified resolution across Kolkata.
        </p>
      </div>

      {/* Role Selector Tabs (Citizen, KMC Officer, Admin) */}
      <div className="bg-slate-100 p-1 rounded-2xl grid grid-cols-3 gap-1 border border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => {
            setSelectedRole('citizen');
            setErrorMessage('');
          }}
          className={`py-2 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            selectedRole === 'citizen'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Citizen</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole('authority');
            setErrorMessage('');
          }}
          className={`py-2 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            selectedRole === 'authority'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>KMC Officer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedRole('admin');
            setErrorMessage('');
          }}
          className={`py-2 px-2 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            selectedRole === 'admin'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>

      {/* Login vs Register Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-5">
        <div className="flex border-b border-slate-100 pb-3 text-xs font-semibold gap-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === 'register'
                ? 'border-orange-600 text-orange-600 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-snug font-medium">{errorMessage}</div>
            </div>
            {activeTab === 'login' && errorMessage.includes('Not Registered') && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 bg-white hover:bg-orange-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register {emailOrPhone} now &rarr;</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {activeTab === 'register' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={
                    selectedRole === 'authority'
                      ? 'Er. A. K. Sengupta'
                      : selectedRole === 'admin'
                      ? 'Administrator Name'
                      : 'Suvro Mukherjee'
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              {selectedRole === 'authority'
                ? 'Official KMC Email or Mobile Number'
                : selectedRole === 'admin'
                ? 'Admin Username / Email'
                : 'Mobile Number or Email Address'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder={
                  selectedRole === 'authority'
                    ? 'officer@kmcgov.in.demo'
                    : selectedRole === 'admin'
                    ? 'admin@kmcgov.in.demo'
                    : 'suvro@kolkata.in or +91-98300-12345'
                }
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              {activeTab === 'login' && selectedRole === 'admin'
                ? 'Admin Passcode (Demo: admin123)'
                : 'Password / Passcode'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder={selectedRole === 'admin' ? 'admin123' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
            </div>
          </div>

          {/* Citizen Ward Selection */}
          {selectedRole === 'citizen' && activeTab === 'register' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Primary Kolkata Ward (1–144)
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              >
                {KOLKATA_WARDS.map((w) => (
                  <option key={w.ward} value={w.ward}>
                    Ward {w.ward} ({w.locality})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* KMC Officer Department Selection */}
          {selectedRole === 'authority' && activeTab === 'register' && (
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                KMC Department Division
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              >
                <option value="Civil Infrastructure & Roads">KMC Roads & Asphalt Department</option>
                <option value="Solid Waste & Sanitation">KMC Solid Waste Management (SWM)</option>
                <option value="Drainage & Waterlogging Mitigation">KMC Sewerage & Drainage Department</option>
                <option value="Street Lighting & Urban Power">KMC Lighting & Electricity Wing</option>
                <option value="Urban Mobility & Traffic Safety">Kolkata Police Traffic Department</option>
                <option value="Flyovers, Bridges & Metropolitan Infra">KMDA Metropolitan Infrastructure</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {activeTab === 'login'
                ? `Sign In as ${selectedRole === 'authority' ? 'KMC Officer' : selectedRole === 'admin' ? 'Admin' : 'Citizen'}`
                : `Register as ${selectedRole === 'authority' ? 'KMC Officer' : selectedRole === 'admin' ? 'Admin' : 'Citizen'}`}
            </span>
          </button>
        </form>

        {/* 1-Click Fast Login Demo Shortcuts (Pre-registered) */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick 1-Click Demo Accounts (Pre-Registered):
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('citizen')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50/70 hover:border-orange-300 transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">👤 Citizen Login:</span>
                <span className="text-slate-500 ml-1.5">Suvro Mukherjee (Ward 48 - College St)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('authority')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50/70 hover:border-orange-300 transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">🛡️ KMC Officer:</span>
                <span className="text-slate-500 ml-1.5">Er. A. K. Sengupta (Roads Division)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-orange-50/70 hover:border-orange-300 transition-all flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">👑 Admin Login:</span>
                <span className="text-slate-500 ml-1.5">Chief Municipal Commissioner</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <Suspense fallback={<div className="text-xs text-slate-500">Loading CivicSeva Authentication...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
