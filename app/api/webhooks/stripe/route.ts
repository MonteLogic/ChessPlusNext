/**
 * @file app/api/webhooks/stripe/route.ts
 * @description Webhook handler for Stripe events (dummy version for build)
 */

import { NextResponse } from 'next/server';

/**
 * Dummy webhook handler for Stripe events
 * @param req - The incoming request
 * @returns Promise<NextResponse> with success response
 */
export async function POST(req: Request) {
  try {
    // Dummy webhook handler for build - in production this would handle actual Stripe events
    console.log('Dummy Stripe webhook received for build purposes');
    
    return NextResponse.json({ 
      received: true,
      message: 'Dummy webhook handler for build purposes'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    );
  }
}