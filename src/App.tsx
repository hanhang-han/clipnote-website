import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n';
import Navbar from './components/Navbar';
import PromoBar from './components/PromoBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Docs from './pages/Docs';
import Download from './pages/Download';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/download" element={<Download />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
