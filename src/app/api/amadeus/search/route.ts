import { NextRequest, NextResponse } from 'next/server';
import getAmadeusClient from '@/lib/amadeus';
import type { FlightSearchParams, FlightOffersResponse, AmadeusError } from '@/types/amadeus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract search parameters
    const params: FlightSearchParams = {
      originLocationCode: searchParams.get('origin') || '',
      destinationLocationCode: searchParams.get('destination') || '',
      departureDate: searchParams.get('departureDate') || '',
      returnDate: searchParams.get('returnDate') || undefined,
      adults: parseInt(searchParams.get('adults') || '1'),
      children: searchParams.get('children') ? parseInt(searchParams.get('children')!) : undefined,
      infants: searchParams.get('infants') ? parseInt(searchParams.get('infants')!) : undefined,
      travelClass: (searchParams.get('travelClass') as any) || 'ECONOMY',
      nonStop: searchParams.get('nonStop') === 'true',
      currencyCode: searchParams.get('currency') || 'USD',
      max: parseInt(searchParams.get('max') || '50'),
    };

    // Validate required parameters
    if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: origin, destination, and departureDate are required' },
        { status: 400 }
      );
    }

    // Get Amadeus client
    const amadeus = getAmadeusClient();

    // Search for flight offers
    const response = await amadeus.shopping.flightOffersSearch.get(params);

    // Return flight offers
    return NextResponse.json({
      meta: response.data.meta || { count: response.data.data?.length || 0 },
      data: response.data.data || [],
      dictionaries: response.data.dictionaries || {},
    } as FlightOffersResponse);

  } catch (error: any) {
    console.error('Amadeus Flight Search Error:', error);

    // Handle Amadeus API errors
    if (error.response?.body) {
      const amadeusError = error.response.body as AmadeusError;
      return NextResponse.json(
        {
          error: 'Flight search failed',
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
