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
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AYgjOrPLmtmsNTIOlRU_LOlj4YdXut9oxfx1PjS0bqzrOkpLtcvFelaNOF-g6SfwSGweGLN0ausBGwym&vault=true&intent=subscription';
    script.async = true;
    
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe',
            height: 50
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              'plan_id': 'P-2HF61636JC234640BNBGEIUI', // Updated plan ID
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
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
          <strong>Note:</strong> For PayPal callbacks to work in production, use a public URL (e.g., via ngrok). 
          This sandbox environment uses localhost URLs for testing.
        </p>
      </div>
    </div>
  );
};