import { logger } from './logger';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

interface StripeConfig {
  isConfigured: boolean;
  publishableKey: string | null;
}

export const stripeConfig: StripeConfig = {
  isConfigured: !!STRIPE_PUBLISHABLE_KEY,
  publishableKey: STRIPE_PUBLISHABLE_KEY || null
};

export async function createCheckoutSession(priceId: string, userId: string): Promise<{ url: string } | null> {
  if (!stripeConfig.isConfigured) {
    logger.warn('Stripe not configured');
    throw new Error('Payment system is not configured. Please contact support.');
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/upgrade`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Failed to create checkout session', error as Error);
    throw error;
  }
}

export async function createPortalSession(customerId: string): Promise<{ url: string } | null> {
  if (!stripeConfig.isConfigured) {
    logger.warn('Stripe not configured');
    throw new Error('Payment system is not configured. Please contact support.');
  }

  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/dashboard/settings`
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Failed to create portal session', error as Error);
    throw error;
  }
}

export const STRIPE_PLANS = {
  premium: {
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      amount: 15,
      currency: 'USD'
    },
    yearly: {
      priceId: import.meta.env.VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID,
      amount: 144,
      currency: 'USD'
    }
  },
  enterprise: {
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
      amount: 50,
      currency: 'USD'
    },
    yearly: {
      priceId: import.meta.env.VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID,
      amount: 480,
      currency: 'USD'
    }
  }
} as const;
