import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

export const Hero: React.FC = () => {
  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-20 px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight">
          Simplify Your Finances with Smart Tracking Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Track income, expenses, investments, and savings with ease—designed for freelancers and small businesses.
        </p>
        
        <button
          onClick={handleGetStarted}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-bold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl animate-pulse-subtle"
          aria-label="Get started for free"
        >
          Get Started for Free
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <div className="mt-16 max-w-md mx-auto">
          <ProgressBar percentage={75} label="Financial Health" />
        </div>
      </div>
    </section>
  );
};