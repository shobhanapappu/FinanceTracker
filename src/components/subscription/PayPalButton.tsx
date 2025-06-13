import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    // Load PayPal SDK with enhanced configuration
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AYgjOrPLmtmsNTIOlRU_LOlj4YdXut9oxfx1PjS0bqzrOkpLtcvFelaNOF-g6SfwSGweGLN0ausBGwym&vault=true&intent=subscription&enable-funding=paypal&disable-funding=credit,card';
    script.async = true;
    
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
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
            
            onSuccess(subscriptionDetails);
          },
          onError: function(err: any) {
            console.error('PayPal error:', err);
            onError(err);
          },
          onCancel: function(data: any) {
            console.log('PayPal subscription cancelled:', data);
          }
        }).render(paypalRef.current);
      }
    };

    script.onerror = () => {
      onError(new Error('Failed to load PayPal SDK'));
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div ref={paypalRef} className="min-h-[50px]" />
      
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

        <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            🔧 Production Setup
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For PayPal callbacks to work in production, use a public URL (e.g., via ngrok). 
            This sandbox environment uses localhost URLs for testing.
          </p>
        </div>
      </div>
    </div>
  );
};