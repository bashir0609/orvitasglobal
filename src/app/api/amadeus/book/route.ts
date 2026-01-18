import { NextRequest, NextResponse } from 'next/server';
import getAmadeusClient from '@/lib/amadeus';
import type { BookingRequest, BookingResponse, AmadeusError } from '@/types/amadeus';

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    // Validate request body
    if (!body.data?.flightOffers || !Array.isArray(body.data.flightOffers) || body.data.flightOffers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: flightOffers array is required' },
        { status: 400 }
      );
    }

    if (!body.data?.travelers || !Array.isArray(body.data.travelers) || body.data.travelers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: travelers array is required' },
        { status: 400 }
      );
    }

    // Get Amadeus client
    const amadeus = getAmadeusClient();

    // Create flight order (booking)
    const response = await amadeus.booking.flightOrders.post(
      JSON.stringify(body)
    );

    // Return booking confirmation
    return NextResponse.json({
      data: response.data.data || {},
    } as BookingResponse);

  } catch (error: any) {
    console.error('Amadeus Booking Error:', error);

    // Handle Amadeus API errors
    if (error.response?.body) {
      const amadeusError = error.response.body as AmadeusError;
      return NextResponse.json(
        {
          error: 'Booking failed',
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
