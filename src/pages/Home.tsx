import Hero from '../components/Hero';
import MockupSection from '../components/MockupSection';
import AIFeatures from '../components/AIFeatures';
import Features from '../components/Features';
import Comparison from '../components/Comparison';
import JackSection from '../components/JackSection';
import WorkflowSection from '../components/WorkflowSection';
import TodaySection from '../components/TodaySection';
import AgentV2Section from '../components/AgentV2Section';
import NotesSection from '../components/NotesSection';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <MockupSection />
      <AIFeatures />
      <JackSection />
      <WorkflowSection />
      <TodaySection />
      <AgentV2Section />
      <NotesSection />
      <Features />
      <Comparison />
      <FAQ />
      <FinalCTA />
    </>
  );
}
