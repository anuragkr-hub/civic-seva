import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { RoleBanner } from '../components/Navigation/RoleBanner';
import { Navbar } from '../components/Navigation/Navbar';
import { Footer } from '../components/Navigation/Footer';

export const metadata: Metadata = {
  title: 'CivicSeva — See. Report. Resolve. (Kolkata)',
  description: 'AI-Powered Civic Issue Reporting, Duplicate Detection, Priority Routing & Citizen-Verified Resolution for Kolkata, West Bengal.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900">
        <AppProvider>
          <RoleBanner />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
