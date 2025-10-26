// Dummy Stripe utilities for build purposes

/**
 * Interface for customer metadata from Clerk
 * @interface
 */
export interface ClerkMetadata {
  /** Stripe customer ID stored in Clerk metadata */
  stripeCustomerId?: string;
  /** Any additional random metadata */
  randomMetaData?: number;
}

/**
 * Interface for the complete customer data response
 * @interface
 */
export interface CustomerDataResponse {
  /** The full Stripe customer object */
  customer: {
    id: string;
    email: string;
    created: number;
  };
  /** Array of active subscriptions for the customer */
  activeSubscriptions: any[];
  /** The most recent invoice for the customer, if any */
  latestInvoice: any | null;
}

/**
 * Retrieves detailed customer information (dummy version for build)
 * @param stripeCustomerId - The Stripe customer ID to lookup
 * @returns Promise resolving to customer details including subscriptions and latest invoice
 */
export async function getCustomerDetails(
  stripeCustomerId: string,
): Promise<CustomerDataResponse> {
  // Dummy response for build - in production this would fetch actual Stripe data
  return {
    customer: {
      id: stripeCustomerId,
      email: 'dummy@example.com',
      created: Date.now() / 1000,
    },
    activeSubscriptions: [],
    latestInvoice: null,
  };
}