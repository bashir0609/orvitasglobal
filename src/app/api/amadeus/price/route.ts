import { NextRequest, NextResponse } from 'next/server';
import getAmadeusClient from '@/lib/amadeus';
import type { PriceConfirmationRequest, PriceConfirmationResponse, AmadeusError } from '@/types/amadeus';

export async function POST(request: NextRequest) {
  try {
    const body: PriceConfirmationRequest = await request.json();

    // Validate request body
    if (!body.data?.flightOffers || !Array.isArray(body.data.flightOffers) || body.data.flightOffers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: flightOffers array is required' },
        { status: 400 }
      );
    }

    // Get Amadeus client
    const amadeus = getAmadeusClient();

    // Confirm flight offer pricing
    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify(body)
    );

    // Return confirmed pricing
    return NextResponse.json({
      data: response.data.data || {},
    } as PriceConfirmationResponse);

  } catch (error: any) {
    console.error('Amadeus Price Confirmation Error:', error);

    // Handle Amadeus API errors
    if (error.response?.body) {
      const amadeusError = error.response.body as AmadeusError;
      return NextResponse.json(
        {
          error: 'Price confirmation failed',
          details: amadeusError.errors || [],
        },
        { status: error.response.statusCode || 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
