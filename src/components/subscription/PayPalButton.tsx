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
              'plan_id': 'P-5ML4271244454362WXNWU5NQ', // This would be your actual plan ID
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
            const mockSubscriptionDetails = {
              id: data.subscriptionID || 'MOCK_SUB_' + Date.now(),
              status: 'ACTIVE',
              plan_id: 'P-5ML4271244454362WXNWU5NQ',
              subscriber: {
                email_address: 'subscriber@example.com'
              }
            };
            
            onSuccess(mockSubscriptionDetails);
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
    </div>
  );
};