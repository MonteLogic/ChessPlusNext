// Dummy webhook handler for build purposes
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Dummy webhook handler for build - in production this would handle actual Clerk webhooks
        console.log('Dummy Clerk webhook received for build purposes');
        
        return NextResponse.json({ 
            success: true,
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