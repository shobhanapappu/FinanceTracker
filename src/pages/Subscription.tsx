import React, { useState, useEffect } from 'react';
import { Crown, Check, ArrowLeft, Loader } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Footer } from '../components/Footer';
import { PayPalButton } from '../components/subscription/PayPalButton';
import { Toast } from '../components/Toast';
import { getCurrentUser } from '../lib/supabase';
import { getUserSubscription, upgradeSubscription, hasPremiumAccess, getTrialEndDate, Subscription as SubscriptionType } from '../lib/subscription';

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
    'Create unlimited budgets',
    'Set savings goals with deadlines',
    'Delete entries and manage data',
    'Advanced charts and analytics',
    'Export data as CSV',
    'Priority customer support'
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

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Unlock powerful features to take control of your finances and achieve your goals faster
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Plan Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Current Plan
              </h2>
              
              {isDemoUser ? (
                <div className="text-center py-8">
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-xl mb-4">
                    <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                      Demo Mode
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                      Sign up to start your free trial and access premium features
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                  >
                    Sign Up Now
                  </button>
                </div>
              ) : isPremium ? (
                <div className="text-center py-8">
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-xl mb-4">
                    <Crown className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Premium Plan – Active
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      You have access to all premium features
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Thank you for being a premium subscriber!
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl mb-4">
                    <Crown className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                      Free Plan – Trial
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      Trial ends on {trialEndDate}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Upgrade now to keep access to premium features
                  </div>
                </div>
              )}
            </div>

            {/* Premium Benefits */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Premium Benefits
              </h2>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  $5<span className="text-lg font-normal text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Sandbox mode - No real charges
                </p>
              </div>
            </div>
          </div>

          {/* PayPal Subscription Button */}
          {!isDemoUser && !isPremium && (
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                Subscribe Now
              </h2>
              
              {upgrading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Activating your subscription...
                  </p>
                </div>
              ) : (
                <PayPalButton
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                />
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                This is a sandbox environment for testing. No real payments will be processed.
              </p>
            </div>
          )}
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