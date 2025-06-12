import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

export const Hero: React.FC = () => {
  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  return (
    <section className="relative bg-hero-gradient min-h-screen flex items-center justify-center py-20 px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Simplify Your Finances with{' '}
          <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-teal-400 bg-clip-text text-transparent animate-glow">
            Smart Tracking Tools
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Track income, expenses, investments, and savings with ease—designed for freelancers and small businesses.
        </p>
        
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 animate-glow"
          aria-label="Get started for free"
        >
          Get Started for Free
          <ArrowRight className="w-6 h-6" />
        </button>
        
        <div className="mt-20 max-w-md mx-auto">
          <ProgressBar percentage={75} label="Financial Health" />
        </div>
      </div>
    </section>
  );
};