/**
 * @file app/api/stripe/create-subscription/route.ts
 * @description API route handler for creating Stripe subscriptions (dummy version for build)
 */

import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';

/**
 * Interface for the expected request body
 * @interface CreateSubscriptionRequest
 */
interface CreateSubscriptionRequest {
  /** Stripe product ID to subscribe to */
  productId: string;
  /** User ID from Clerk */
  userId: string;
}

/**
 * Helper function to get base URL depending on environment
 * @returns The base URL of the application
 */
function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return 'https://cbud.app';
  }
  // toDo: Change this to the process url being used
  // not just a hard-coded value.
  return 'http://localhost:3000';
}

/**
 * Creates a Stripe Checkout session for subscription (dummy version)
 * @param request - The incoming HTTP request
 * @returns Promise<NextResponse> with checkout URL or error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId }: CreateSubscriptionRequest = await request.json();

    // Dummy response for build - in production this would use actual Stripe
    const baseUrl = getBaseUrl();
    
    return NextResponse.json({ 
      url: `${baseUrl}/settings?session_id=dummy_session_id&product_id=${productId}`,
      message: 'Dummy subscription created for build purposes'
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}