import React from 'react';
import Header from '../partials/Landing/Header';
import Hero from '../partials/Landing/Hero';
import Features from '../partials/Landing/Features';
import Footer from '../partials/Landing/Footer';


function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;