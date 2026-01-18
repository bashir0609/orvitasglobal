import { NextRequest, NextResponse } from 'next/server';
import getAmadeusClient from '@/lib/amadeus';
import type { Airport, AmadeusError } from '@/types/amadeus';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    // Validate keyword parameter
    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        { error: 'Keyword must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Get Amadeus client
    const amadeus = getAmadeusClient();

    // Search for airports and cities
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: 'AIRPORT,CITY',
    });

    console.log('Amadeus Response Data:', JSON.stringify(response.data, null, 2));

    // Determine correct data path
    const dataList = Array.isArray(response.data) ? response.data : (response.data?.data || []);


    // Format response
    const airports: Airport[] = dataList.map((location: any) => ({
      iataCode: location.iataCode,
      name: location.name,
      cityName: location.address?.cityName || '',
      countryName: location.address?.countryName || '',
      countryCode: location.address?.countryCode || '',
    }));

    return NextResponse.json({
      data: airports,
    });

  } catch (error: any) {
    console.error('Amadeus Airport Search Error:', error);

    // Handle Amadeus API errors
    if (error.response?.body) {
      const amadeusError = error.response.body as AmadeusError;
      return NextResponse.json(
        {
          error: 'Airport search failed',
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
