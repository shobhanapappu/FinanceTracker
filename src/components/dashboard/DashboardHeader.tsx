import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { signOut, getCurrentUser } from '../../lib/supabase';

export const DashboardHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      if (demoMode) {
        setIsDemoUser(true);
        return;
      }

      const { user } = await getCurrentUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isDemoUser) {
      localStorage.removeItem('isDemoUser');
      navigate('/');
      return;
    }

    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', active: true },
    { name: 'Income', href: '/income' },
    { name: 'Expenses', href: '/expenses' },
    { name: 'Budgets', href: '/budgets' },
    { name: 'Investments', href: '/investments' },
    { name: 'Savings', href: '/savings' },
    { name: 'Reports', href: '/reports' },
    { name: 'Settings', href: '/settings' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              GrowEasy Tracker
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="User menu"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDemoUser 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                    : 'bg-gradient-to-br from-blue-500 to-teal-500'
                }`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDemoUser ? 'Demo User' : user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {!isDemoUser && (
                    <>
                      <a
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </a>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    {isDemoUser ? 'Exit Demo' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};