'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, SupportedLanguage, CivicIncident } from '../types';
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

interface AppContextType {
  role: UserRole;
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

    // Listen for cross-component storage updates
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('civic_data_updated', handleUpdate);
    return () => window.removeEventListener('civic_data_updated', handleUpdate);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
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
        role,
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
