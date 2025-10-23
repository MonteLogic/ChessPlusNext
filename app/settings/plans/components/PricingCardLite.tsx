'use client';

import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { PricingTier } from '../data';

interface PricingCardLiteProps {
  tier: PricingTier;
  title: string;
  price: string;
  features: string[];
  description: string;
}

export function PricingCardLite({
  tier,
  title,
  price,
  features,
  description,
}: Readonly<PricingCardLiteProps>) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      if (tier === 'enterprise') {
        window.location.href = '/contact-sales';
        return;
      }

      if (tier === 'basic') {
        window.location.href = '/dashboard';
        return;
      }

      // Without Clerk, send user to sign-in first
      window.location.href = '/sign-in?redirect=/settings/plans';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 relative hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-blue-600">{title}</h2>
        <div className="text-2xl font-bold mt-2 mb-4 text-white">{price}</div>
        <p className="text-gray-200 mb-4">{description}</p>
      </div>

      <ul className="space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="text-blue-500 h-4 w-4" />
            <span className="text-gray-200">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
     >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {tier === 'basic'
              ? 'Get Started'
              : tier === 'enterprise'
              ? 'Contact Sales'
              : `Upgrade to ${title.split(' ')[0]}`}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}

export default PricingCardLite;

