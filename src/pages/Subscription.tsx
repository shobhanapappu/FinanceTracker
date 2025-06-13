import React, { useState, useEffect } from 'react';
import { Crown, Check, ArrowLeft, Loader, Clock, Star, Info } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Footer } from '../components/Footer';
import { PayPalButton } from '../components/subscription/PayPalButton';
import { Toast } from '../components/Toast';
import { getCurrentUser } from '../lib/supabase';
import { getUserSubscription, upgradeSubscription, hasPremiumAccess, getTrialEndDate, getTrialDaysRemaining, Subscription as SubscriptionType } from '../lib/subscription';

export const Subscription: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionType | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadSubscription = async () => {
      const demoMode = localStorage.getItem('isDemoUser') === 'true';
      
      if (demoMode) {
        setIsDemoUser(true);
        setLoading(false);
        return;
      }

      try {
        const { user } = await getCurrentUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data, error } = await getUserSubscription(user.id);
        if (!error && data) {
          setSubscription(data);
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
        setToast({ message: 'Failed to load subscription details', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();

    // Check for success/cancel parameters
    const success = searchParams.get('success');
    const cancelled = searchParams.get('cancelled');
    
    if (success === 'true') {
      setToast({ message: 'Subscription activated successfully!', type: 'success' });
    } else if (cancelled === 'true') {
      setToast({ message: 'Subscription cancelled', type: 'error' });
    }
  }, [navigate, searchParams]);

  const handlePayPalSuccess = async (details: any) => {
    setUpgrading(true);
    
    try {
      const { user } = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await upgradeSubscription(user.id);
      if (error) {
        throw error;
      }

      // Reload subscription data
      const { data } = await getUserSubscription(user.id);
      if (data) {
        setSubscription(data);
      }

      setToast({ message: 'Subscription activated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      setToast({ message: 'Failed to activate subscription. Please try again.', type: 'error' });
    } finally {
      setUpgrading(false);
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    setToast({ message: 'Payment failed. Please try again.', type: 'error' });
  };

  const benefits = [
    { text: 'Create unlimited budgets', icon: '📊' },
    { text: 'Set savings goals with deadlines', icon: '🎯' },
    { text: 'Delete entries and manage data', icon: '🗑️' },
    { text: 'Advanced charts and analytics', icon: '📈' },
    { text: 'Export data as CSV', icon: '📄' },
    { text: 'Priority customer support', icon: '🚀' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const isPremium = subscription && hasPremiumAccess(subscription);
  const trialEndDate = subscription ? getTrialEndDate(subscription) : '';
  const daysRemaining = subscription ? getTrialDaysRemaining(subscription) : 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        
        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg animate-pulse-subtle">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Unlock powerful features to take control of your finances and achieve your goals faster
            </p>
          </div>

          {/* PayPal Testing Notice */}
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  PayPal Sandbox Testing
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  This is a test environment. Use the following credentials to test PayPal login:
                </p>
                <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-4 font-mono text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-blue-800 dark:text-blue-200">Test Email:</strong>
                      <div className="text-blue-700 dark:text-blue-300">sb-buyer@business.example.com</div>
                    </div>
                    <div>
                      <strong className="text-blue-800 dark:text-blue-200">Test Password:</strong>
                      <div className="text-blue-700 dark:text-blue-300">testpassword123</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Current Plan Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                Current Plan
              </h2>
              
              {isDemoUser ? (
                <div className="text-center py-8">
                  <div className="p-6 bg-purple-100 dark:bg-purple-900/20 rounded-xl mb-6 border border-purple-200 dark:border-purple-800">
                    <Crown className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                      Demo Mode
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Sign up to start your free trial and access premium features
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Sign Up Now
                  </button>
                </div>
              ) : isPremium ? (
                <div className="text-center py-8">
                  <div className="p-6 bg-green-100 dark:bg-green-900/20 rounded-xl mb-6 border border-green-200 dark:border-green-800">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-green-500 rounded-full">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                      Premium Plan – Active
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      You have access to all premium features
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Thank you for being a premium subscriber! 🎉
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-6 bg-blue-100 dark:bg-blue-900/20 rounded-xl mb-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-500 rounded-full">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Free Plan – Trial Active
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      Trial ends on {trialEndDate}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-200 dark:bg-blue-800 rounded-full">
                      <Clock className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {daysRemaining} days remaining
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Upgrade now to keep access to premium features
                  </div>
                </div>
              )}
            </div>

            {/* Premium Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                Premium Benefits
              </h2>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $5<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Simple, transparent pricing
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    Sandbox mode - No real charges
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PayPal Subscription Button */}
          {!isDemoUser && !isPremium && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8 flex items-center justify-center gap-3">
                <Crown className="w-6 h-6 text-blue-500" />
                Subscribe Now
              </h2>
              
              {upgrading ? (
                <div className="text-center py-12">
                  <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Activating your subscription...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please wait while we process your payment
                  </p>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <PayPalButton
                    onSuccess={handlePayPalSuccess}
                    onError={handlePayPalError}
                  />
                </div>
              )}
            </div>
          )}

          {/* Features Comparison */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Feature Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 text-gray-900 dark:text-white font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-gray-900 dark:text-white font-semibold">Free</th>
                    <th className="text-center py-4 px-6 text-blue-600 dark:text-blue-400 font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Add Income & Expenses</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Basic Dashboard</td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Create Budgets</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-400">Trial Only</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Savings Goals</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-400">Trial Only</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Delete Entries</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-400">Trial Only</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300">Export Data</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-gray-400">Limited</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};