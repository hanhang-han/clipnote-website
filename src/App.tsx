import { useEffect } from 'react';
import { LanguageProvider } from './i18n';
import Navbar from './components/Navbar';
import PromoBar from './components/PromoBar';
import Hero from './components/Hero';
import MockupSection from './components/MockupSection';
import AIFeatures from './components/AIFeatures';
import Features from './components/Features';
import Comparison from './components/Comparison';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    fetch('https://clipnote-api.renqingbu.workers.dev/api/stats/pv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname }),
    }).catch(() => {});
  }, []);

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-[#111] text-white">
      <Navbar />
      <PromoBar />
      <main>
        <Hero />
        <MockupSection />
        <AIFeatures />
        <Features />
        <Comparison />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
    </LanguageProvider>
  );
}
