import React, { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

declare global {
  interface Window {
    paypal: any;
  }
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ onSuccess, onError }) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const buttonInstanceRef = useRef<any>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadPayPalSDK = () => {
      // Check if PayPal SDK is already loaded
      if (window.paypal && scriptLoadedRef.current) {
        initializePayPalButton();
        return;
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (isMounted) {
            scriptLoadedRef.current = true;
            initializePayPalButton();
          }
        });
        return;
      }

      // Load PayPal SDK with enhanced configuration
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AYgjOrPLmtmsNTIOlRU_LOlj4YdXut9oxfx1PjS0bqzrOkpLtcvFelaNOF-g6SfwSGweGLN0ausBGwym&vault=true&intent=subscription&enable-funding=paypal&disable-funding=credit,card&currency=USD';
      script.async = true;
      script.setAttribute('data-partner-attribution-id', 'FinanceTracker_SP');
      
      script.onload = () => {
        if (isMounted) {
          scriptLoadedRef.current = true;
          initializePayPalButton();
        }
      };

      script.onerror = () => {
        if (isMounted) {
          setError('Failed to load PayPal SDK');
          setIsLoading(false);
        }
      };

      document.head.appendChild(script);
    };

    const initializePayPalButton = () => {
      if (!window.paypal || !paypalRef.current || !isMounted) {
        return;
      }

      try {
        // Clear any existing button instance
        if (buttonInstanceRef.current) {
          try {
            buttonInstanceRef.current.close();
          } catch (e) {
            console.warn('Error closing previous PayPal button:', e);
          }
        }

        // Clear the container
        if (paypalRef.current) {
          paypalRef.current.innerHTML = '';
        }

        // Create new PayPal button instance
        buttonInstanceRef.current = window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe',
            height: 50,
            tagline: false
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              'plan_id': 'P-2HF61636JC234640BNBGEIUI',
              'application_context': {
                'brand_name': 'FinanceTracker',
                'locale': 'en-US',
                'shipping_preference': 'NO_SHIPPING',
                'user_action': 'SUBSCRIBE_NOW',
                'payment_method': {
                  'payer_selected': 'PAYPAL',
                  'payee_preferred': 'IMMEDIATE_PAYMENT_REQUIRED'
                },
                'return_url': `${window.location.origin}/subscription?success=true`,
                'cancel_url': `${window.location.origin}/subscription?cancelled=true`
              }
            });
          },
          onApprove: function(data: any, actions: any) {
            // For sandbox testing, we'll simulate a successful subscription
            const subscriptionDetails = {
              id: data.subscriptionID || 'SANDBOX_SUB_' + Date.now(),
              status: 'ACTIVE',
              plan_id: 'P-2HF61636JC234640BNBGEIUI',
              subscriber: {
                email_address: 'subscriber@example.com'
              }
            };
            
            if (isMounted) {
              onSuccess(subscriptionDetails);
            }
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            if (isMounted) {
              onError(err);
            }
          },
          onCancel: function(data: any) {
            console.log('PayPal subscription cancelled:', data);
            if (isMounted) {
              setError('Payment was cancelled');
            }
          }
        });

        // Render the button
        if (paypalRef.current && isMounted) {
          buttonInstanceRef.current.render(paypalRef.current).then(() => {
            if (isMounted) {
              setIsLoading(false);
              setError(null);
            }
          }).catch((renderError: any) => {
            console.error('PayPal render error:', renderError);
            if (isMounted) {
              setError('Failed to render PayPal button');
              setIsLoading(false);
            }
          });
        }
      } catch (initError) {
        console.error('PayPal initialization error:', initError);
        if (isMounted) {
          setError('Failed to initialize PayPal button');
          setIsLoading(false);
        }
      }
    };

    loadPayPalSDK();

    // Cleanup function
    return () => {
      isMounted = false;
      
      // Clean up PayPal button instance
      if (buttonInstanceRef.current) {
        try {
          buttonInstanceRef.current.close();
        } catch (e) {
          console.warn('Error during PayPal button cleanup:', e);
        }
        buttonInstanceRef.current = null;
      }

      // Clear the container
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
    };
  }, [onSuccess, onError]);

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // Trigger re-initialization
              const event = new Event('load');
              window.dispatchEvent(event);
            }}
            className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading PayPal...</span>
        </div>
      )}
      
      <div ref={paypalRef} className={`min-h-[50px] ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
      
      {/* Enhanced Instructions */}
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🧪 PayPal Sandbox Testing
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Use these test credentials to login to PayPal:
          </p>
          <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-3 font-mono text-sm">
            <div className="mb-2">
              <strong>Email:</strong> sb-buyer@business.example.com
            </div>
            <div>
              <strong>Password:</strong> testpassword123
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            💡 How to Test PayPal Login
          </h4>
          <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
            <li>Click the PayPal button above</li>
            <li>On the PayPal page, click "Log in to your PayPal account"</li>
            <li>Use the test credentials provided above</li>
            <li>Complete the subscription flow</li>
          </ol>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            🔧 Production Setup
          </h4>
          <p className="text-sm text-green-600 dark:text-green-400">
            For PayPal callbacks to work in production, ensure you're using a public URL (e.g., via ngrok). 
            This environment is configured for ngrok URLs.
          </p>
        </div>
      </div>
    </div>
  );
};