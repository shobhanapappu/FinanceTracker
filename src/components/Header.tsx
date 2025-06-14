import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="bg-dark-900/95 dark:bg-dark-950/95 backdrop-blur-sm shadow-lg border-b border-teal-800/30 dark:border-teal-700/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            GrowEasy Tracker
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="/features" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">
            Features
          </a>
          <a href="/pricing" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">
            Pricing
          </a>
          <a href="/about" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">
            About
          </a>
          <a href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a
            href="/auth"
            className="text-gray-300 hover:text-primary-400 transition-colors duration-200 font-medium"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
};