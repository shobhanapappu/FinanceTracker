import React, { useState } from 'react';
import { Mail, Lock, User, ChevronDown } from 'lucide-react';
import { signUp, signInWithGoogle } from '../lib/supabase';

export const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'freelancer' as 'freelancer' | 'e-commerce'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.userType
      );

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setMessage(error.message);
      }
    } catch (error) {
      setMessage('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="signup-form" className="py-20 px-8 bg-gradient-to-b from-dark-800 to-dark-900">
      <div className="max-w-md mx-auto">
        <div className="bg-card-gradient backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-teal-800/30">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Join Thousands of{' '}
            <span className="bg-gradient-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent">
              Smart Users
            </span>
          </h2>
          
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">
                Step {currentStep}/3: {currentStep === 1 ? 'Personal Info' : currentStep === 2 ? 'Account Details' : 'User Type'}
              </span>
              <span className="text-sm font-bold text-primary-400">
                {Math.round((currentStep / 3) * 100)}%
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-teal-700/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-dark-800/50 text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!formData.name.trim()}
                  className="w-full bg-gradient-to-r from-primary-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                >
                  Next Step
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-teal-700/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-dark-800/50 text-white placeholder-gray-400"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-teal-700/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-dark-800/50 text-white placeholder-gray-400"
                      placeholder="Create a password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-dark-700 text-gray-300 py-3 rounded-lg font-bold hover:bg-dark-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!formData.email.trim() || !formData.password.trim()}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-2">
                    I am a...
                  </label>
                  <div className="relative">
                    <select
                      id="userType"
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-teal-700/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-dark-800/50 text-white appearance-none"
                      required
                    >
                      <option value="freelancer">Freelancer</option>
                      <option value="e-commerce">E-commerce Business Owner</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-dark-700 text-gray-300 py-3 rounded-lg font-bold hover:bg-dark-600 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-secondary-500 to-primary-500 text-white py-3 rounded-lg font-bold hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-teal-700/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-400">Or continue with</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full bg-dark-700/50 border border-teal-700/50 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-dark-600/50 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm ${
              message.includes('successfully') 
                ? 'bg-teal-900/50 text-teal-300 border border-teal-700/50'
                : 'bg-red-900/50 text-red-300 border border-red-700/50'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};