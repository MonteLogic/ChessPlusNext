/**
 * @fileoverview API route handler for checking Stripe subscription status (dummy version for build)
 * @module CheckSubscriptionRoute
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

/**
 * GET handler for subscription status check (dummy version)
 * @async
 * @returns {Promise<NextResponse>} JSON response with subscription status
 */
export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Dummy response for build - in production this would check actual Stripe subscription
    return NextResponse.json({
      isActive: false,
      planId: null,
      expiresAt: null,
      message: 'Dummy subscription check for build purposes'
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}