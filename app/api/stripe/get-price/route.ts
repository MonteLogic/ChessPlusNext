/**
 * @file app/api/stripe/get-price/route.ts
 * @description API route handler for fetching Stripe product prices (dummy version for build)
 */

import { NextResponse } from 'next/server';

/**
 * Fetches the price for a given Stripe product (dummy version)
 * @param request - The incoming HTTP request
 * @returns Promise<NextResponse> with price data
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 },
      );
    }

    // Dummy response for build - in production this would fetch actual Stripe prices
    return NextResponse.json({
      price: 4999, // $49.99 in cents
      currency: 'usd',
      message: 'Dummy price data for build purposes'
    });
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}