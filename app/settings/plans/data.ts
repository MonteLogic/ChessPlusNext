// Dummy data for plans to ensure build success
export const features = {
  basic: ["Basic timecard management", "Simple scheduling", "Single route management", "Basic reporting", "Mobile app access"],
  pro: ["Advanced timecard management", "Multi-route scheduling", "Route optimization", "Detailed analytics", "Priority support", "Employee management", "Custom notifications"],
  max: ["Enterprise-grade scheduling", "Advanced route optimization", "Real-time GPS tracking", "Advanced reporting & analytics", "API access", "Dedicated account manager", "Custom integrations", "Bulk operations"],
  enterprise: ["All Max features", "Custom deployment", "24/7 premium support", "Unlimited users", "Custom feature development", "SLA guarantees", "Training & onboarding", "Security compliance"]
};

export const prices = {
  basic: 'Free',
  pro: '$49/month',
  max: '$99/month',
  enterprise: 'Custom'
} as const;

// Dummy product IDs for build
export const stripeProductIds = {
  basic: 'free',
  pro: 'prod_dummy_pro',
  max: 'prod_dummy_max',
  enterprise: 'custom'
} as const;

export type PricingTier = keyof typeof stripeProductIds;