// Dummy subscription webhook handler for build purposes
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Dummy webhook handler for build - in production this would handle actual subscription webhooks
    console.log('Dummy subscription webhook received for build purposes');
    
    return NextResponse.json({ 
      success: true,
      message: 'Dummy subscription webhook handler for build purposes'
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}