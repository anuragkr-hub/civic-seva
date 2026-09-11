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

const AUTH_STORAGE_KEY = 'civic_seva_auth_user_v1';

interface AppContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole, details: { name: string; emailOrPhone: string; ward?: number; department?: string }) => void;
  register: (role: UserRole, details: { name: string; emailOrPhone: string; ward?: number; department?: string }) => void;
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
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
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

  const loadData = () => {
    const data = getStoredIncidents();
    setIncidents([...data]);
  };

  useEffect(() => {
    loadData();

    // Check stored user session
    if (typeof window !== 'undefined') {
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
    details: { name: string; emailOrPhone: string; ward?: number; department?: string }
  ) => {
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: details.name || (userRole === 'admin' ? 'KMC Administrator' : userRole === 'authority' ? 'KMC Officer' : 'Kolkata Citizen'),
      email: details.emailOrPhone.includes('@') ? details.emailOrPhone : `${details.name.toLowerCase().replace(/\s+/g, '')}@civicseva.kolkata.gov.in`,
      phone: !details.emailOrPhone.includes('@') ? details.emailOrPhone : '+91-98300-12345',
      role: userRole,
      language,
      ward: details.ward || 48
    };

    setUser(newUser);
    setRoleState(userRole);

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    }

    addNotification({
      title: `Welcome, ${newUser.name}!`,
      message: `Signed in as ${userRole === 'authority' ? 'KMC Officer' : userRole === 'admin' ? 'Administrator' : 'Citizen'}. All features unlocked!`,
      type: 'success'
    });
  };

  const register = (
    userRole: UserRole,
    details: { name: string; emailOrPhone: string; ward?: number; department?: string }
  ) => {
    login(userRole, details);
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

  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || String(key);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
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
