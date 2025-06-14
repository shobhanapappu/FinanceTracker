import React, { useState } from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { supabase } from '../lib/supabase';

export const VerifyEmailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResendEmail = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: localStorage.getItem('pendingEmail') || '',
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      setMessage('Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              GrowEasy Tracker
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="py-20 px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Verify Your Email
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Please verify your email to continue. Check your inbox or spam folder for the verification link.
            </p>

            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Resend Email
                </>
              )}
            </button>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('sent') 
                  ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/auth"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
              >
                ← Back to Sign In
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};