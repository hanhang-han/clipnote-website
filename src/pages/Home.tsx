import Hero from '../components/Hero';
import MockupSection from '../components/MockupSection';
import AIFeatures from '../components/AIFeatures';
import Features from '../components/Features';
import Comparison from '../components/Comparison';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <MockupSection />
      <AIFeatures />
      <Features />
      <Comparison />
      <FAQ />
      <FinalCTA />
    </>
  );
}
