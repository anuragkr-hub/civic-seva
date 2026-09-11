'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, SupportedLanguage, CivicIncident, User } from '../types';
import { getStoredIncidents, resetDemoIncidents } from '../lib/storage';
import { TRANSLATIONS } from '../data/translations';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert' | 'escalation';
  timestamp: string;
  link?: string;
  read: boolean;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

const AUTH_STORAGE_KEY = 'civic_seva_auth_user_v1';
const LANG_STORAGE_KEY = 'civic_seva_lang_v1';
const REGISTERED_USERS_STORAGE_KEY = 'civic_seva_registered_users_v2';

export const DEFAULT_REGISTERED_USERS: User[] = [
  // 1. Citizen Accounts
  {
    id: 'usr_citizen_demo_1',
    name: 'Suvro Mukherjee',
    email: 'suvro@kolkata.in',
    phone: '+91-98300-12345',
    role: 'citizen',
    language: 'en',
    ward: 48,
    password: 'password123'
  },
  {
    id: 'usr_citizen_demo_2',
    name: 'Suvro Mukherjee',
    email: 'suvro.mukherjee@kolkata.in',
    phone: '9830012345',
    role: 'citizen',
    language: 'en',
    ward: 48,
    password: 'password123'
  },
  {
    id: 'usr_citizen_demo_3',
    name: 'Priya Sharma',
    email: 'citizen@kolkata.in',
    phone: '+91-98310-54321',
    role: 'citizen',
    language: 'en',
    ward: 85,
    password: 'password123'
  },

  // 2. KMC Officer Accounts
  {
    id: 'usr_officer_demo_1',
    name: 'Er. A. K. Sengupta',
    email: 'roads.kmc.demo@kmcgov.in.demo',
    phone: '+91-98301-99887',
    role: 'authority',
    language: 'en',
    ward: 48,
    department: 'Civil Infrastructure & Roads',
    password: 'password123'
  },
  {
    id: 'usr_officer_demo_2',
    name: 'Er. A. K. Sengupta',
    email: 'roads.kmc.demo@kolkatamunicipalcorporation.gov.in.demo',
    phone: '9830199887',
    role: 'authority',
    language: 'en',
    ward: 48,
    department: 'Civil Infrastructure & Roads',
    password: 'password123'
  },
  {
    id: 'usr_officer_demo_3',
    name: 'Dr. S. Banerjee (SWM)',
    email: 'officer@kmcgov.in.demo',
    phone: '+91-98302-11223',
    role: 'authority',
    language: 'en',
    ward: 85,
    department: 'Solid Waste & Sanitation',
    password: 'password123'
  },

  // 3. Admin Accounts
  {
    id: 'usr_admin_demo_1',
    name: 'Chief Municipal Commissioner',
    email: 'admin@kmcgov.in.demo',
    phone: '+91-98300-00001',
    role: 'admin',
    language: 'en',
    department: 'Governance & Wards Administration',
    password: 'admin123'
  },
  {
    id: 'usr_admin_demo_2',
    name: 'Chief Municipal Commissioner',
    email: 'commissioner@kmcgov.in.demo',
    phone: 'admin',
    role: 'admin',
    language: 'en',
    department: 'Governance & Wards Administration',
    password: 'admin123'
  }
];

interface AppContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  registeredUsers: User[];
  login: (
    role: UserRole,
    details: { emailOrPhone: string; password?: string; name?: string; ward?: number; department?: string }
  ) => AuthResponse;
  register: (
    role: UserRole,
    details: { name: string; emailOrPhone: string; password?: string; ward?: number; department?: string }
  ) => AuthResponse;
  logout: () => void;
  setRole: (role: UserRole) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  incidents: CivicIncident[];
  refreshIncidents: () => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  resetAllData: () => void;
  t: (key: string, defaultText?: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n_1',
    title: 'AI Verification Completed',
    message: 'Incident #CS-1042 at College Street verified by AI. Priority score: 91/100.',
    type: 'info',
    timestamp: '10 mins ago',
    link: '/incident/CS-1042',
    read: false
  },
  {
    id: 'n_2',
    title: 'Citizen Verification Requested',
    message: 'KMC Solid Waste Dept completed clean-up at Gariahat (#CS-1025). Please verify!',
    type: 'success',
    timestamp: '25 mins ago',
    link: '/incident/CS-1025',
    read: false
  },
  {
    id: 'n_3',
    title: 'Smart Escalation Alert',
    message: 'Hazardous Manhole #CS-1038 has exceeded 7-day resolution window. Tier-2 Escalated.',
    type: 'escalation',
    timestamp: '1 hour ago',
    link: '/incident/CS-1038',
    read: false
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('citizen');
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [incidents, setIncidents] = useState<CivicIncident[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(DEFAULT_REGISTERED_USERS);

  const loadData = () => {
    const data = getStoredIncidents();
    setIncidents([...data]);
  };

  useEffect(() => {
    loadData();

    if (typeof window !== 'undefined') {
      // 1. Load language preference
      try {
        const storedLang = localStorage.getItem(LANG_STORAGE_KEY) as SupportedLanguage | null;
        if (storedLang && (storedLang === 'en' || storedLang === 'bn' || storedLang === 'hi')) {
          setLanguageState(storedLang);
        }
      } catch (err) {
        console.error('Failed to load language', err);
      }

      // 2. Load registered users
      try {
        const storedUsers = localStorage.getItem(REGISTERED_USERS_STORAGE_KEY);
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const defaultEmails = new Set(DEFAULT_REGISTERED_USERS.map((u) => u.email.toLowerCase()));
            const custom = parsed.filter((u: User) => !defaultEmails.has(u.email.toLowerCase()));
            const merged = [...DEFAULT_REGISTERED_USERS, ...custom];
            setRegisteredUsers(merged);
          } else {
            localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_REGISTERED_USERS));
          }
        } else {
          localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(DEFAULT_REGISTERED_USERS));
        }
      } catch (err) {
        console.error('Failed to parse registered users', err);
      }

      // 3. Load active auth session
      try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setRoleState(parsed.role);
        }
      } catch (err) {
        console.error('Failed to parse auth user', err);
      }
    }

    // Listen for cross-component storage updates
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('civic_data_updated', handleUpdate);
    return () => window.removeEventListener('civic_data_updated', handleUpdate);
  }, []);

  const login = (
    userRole: UserRole,
    details: { emailOrPhone: string; password?: string; name?: string; ward?: number; department?: string }
  ): AuthResponse => {
    const query = (details.emailOrPhone || '').trim().toLowerCase();
    if (!query) {
      return { success: false, error: 'Please enter your email address or mobile number.' };
    }

    // Strict validation: user MUST already be in registeredUsers
    const foundUser = registeredUsers.find((u) => {
      const emailMatch = u.email.toLowerCase() === query;
      const phoneDigits = query.replace(/[^0-9]/g, '');
      const userPhoneDigits = u.phone.toLowerCase().replace(/[^0-9]/g, '');
      const phoneMatch = phoneDigits.length >= 5 && userPhoneDigits.includes(phoneDigits);
      const rawPhoneMatch = u.phone.toLowerCase() === query;
      return (emailMatch || phoneMatch || rawPhoneMatch) && u.role === userRole;
    });

    if (!foundUser) {
      const roleName = userRole === 'authority' ? 'KMC Officer' : userRole === 'admin' ? 'Administrator' : 'Citizen';
      return {
        success: false,
        error: `⚠️ Account Not Registered: No registered ${roleName} account was found for "${details.emailOrPhone}". Unregistered IDs cannot log in. Please switch to "Create New Account" to register first.`
      };
    }

    // Admin passcode check
    if (
      userRole === 'admin' &&
      details.password &&
      details.password !== 'admin123' &&
      details.password !== 'kmcadmin' &&
      details.password !== foundUser.password
    ) {
      return {
        success: false,
        error: '⚠️ Incorrect Administrative Passcode. (Demo Passcode: admin123)'
      };
    }

    // Authenticate
    setUser(foundUser);
    setRoleState(userRole);

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
    }

    addNotification({
      title: `Welcome back, ${foundUser.name}!`,
      message: `Signed in as ${userRole === 'authority' ? 'KMC Officer' : userRole === 'admin' ? 'Administrator' : 'Citizen'}. All features unlocked!`,
      type: 'success'
    });

    return { success: true, user: foundUser };
  };

  const register = (
    userRole: UserRole,
    details: { name: string; emailOrPhone: string; password?: string; ward?: number; department?: string }
  ): AuthResponse => {
    const query = (details.emailOrPhone || '').trim().toLowerCase();
    if (!query) {
      return { success: false, error: 'Please provide an email address or mobile number.' };
    }
    if (!details.name || !details.name.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }

    // Check if already registered
    const existing = registeredUsers.find((u) => {
      const emailMatch = u.email.toLowerCase() === query;
      const phoneDigits = query.replace(/[^0-9]/g, '');
      const userPhoneDigits = u.phone.toLowerCase().replace(/[^0-9]/g, '');
      const phoneMatch = phoneDigits.length >= 5 && userPhoneDigits.includes(phoneDigits);
      const rawPhoneMatch = u.phone.toLowerCase() === query;
      return (emailMatch || phoneMatch || rawPhoneMatch) && u.role === userRole;
    });

    if (existing) {
      return {
        success: false,
        error: `⚠️ Account Already Exists: An account with "${details.emailOrPhone}" is already registered. Please switch to "Sign In" to access your account.`
      };
    }

    const isEmail = query.includes('@');
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: details.name.trim(),
      email: isEmail ? details.emailOrPhone.trim() : `${details.name.toLowerCase().replace(/\s+/g, '')}@kolkata.in`,
      phone: !isEmail ? details.emailOrPhone.trim() : '+91-98300-' + Math.floor(10000 + Math.random() * 90000),
      role: userRole,
      language,
      ward: details.ward || 48,
      department: details.department || 'Civil Infrastructure & Roads',
      password: details.password || 'password123'
    };

    const updated = [newUser, ...registeredUsers];
    setRegisteredUsers(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem(REGISTERED_USERS_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }

    setUser(newUser);
    setRoleState(userRole);

    addNotification({
      title: `Welcome to CivicSeva, ${newUser.name}!`,
      message: `Registered successfully as ${userRole === 'authority' ? 'KMC Officer' : userRole === 'admin' ? 'Administrator' : 'Citizen'}. All features unlocked!`,
      type: 'success'
    });

    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setRoleState('citizen');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    addNotification({
      title: 'Signed Out',
      message: 'You have signed out. Please log in again to report or verify issues.',
      type: 'info'
    });
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      }
    }
  };

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    }
  };

  const refreshIncidents = () => {
    loadData();
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: 'notif_' + Date.now(),
      timestamp: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const resetAllData = () => {
    resetDemoIncidents();
    loadData();
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = (TRANSLATIONS as any)[language] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    if ((TRANSLATIONS.en as any)[key]) {
      return (TRANSLATIONS.en as any)[key];
    }
    return defaultText || key;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        registeredUsers,
        login,
        register,
        logout,
        setRole,
        language,
        setLanguage,
        incidents,
        refreshIncidents,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        resetAllData,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
