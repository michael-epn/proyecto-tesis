import React from 'react';
import Header from '../partials/Landing/Header';
import Features from '../partials/Landing/Features';
import Footer from '../partials/Landing/Footer';
import Hero from '../partials/Landing/Hero';
import Steps from '../partials/Landing/Steps';
import CTA from '../partials/Landing/CTA';

function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-inter selection:bg-[#0032a0] selection:text-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Steps />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;