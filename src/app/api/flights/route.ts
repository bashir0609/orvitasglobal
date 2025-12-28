import { NextRequest, NextResponse } from 'next/server';
import type { AviationstackResponse, FlightSearchParams } from '@/types/flight';

const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;
const AVIATIONSTACK_BASE_URL = 'http://api.aviationstack.com/v1';

export async function GET(request: NextRequest) {
    try {
        // Check if API key is configured
        if (!AVIATIONSTACK_API_KEY) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        // Get search parameters from URL
        const searchParams = request.nextUrl.searchParams;
        const flight_iata = searchParams.get('flight_iata');
        const airline_iata = searchParams.get('airline_iata');
        const dep_iata = searchParams.get('dep_iata');
        const arr_iata = searchParams.get('arr_iata');
        const flight_status = searchParams.get('flight_status');

        // Build API URL with parameters
        const apiUrl = new URL(`${AVIATIONSTACK_BASE_URL}/flights`);
        apiUrl.searchParams.append('access_key', AVIATIONSTACK_API_KEY);

        // Add search parameters if provided
        if (flight_iata) apiUrl.searchParams.append('flight_iata', flight_iata);
        if (airline_iata) apiUrl.searchParams.append('airline_iata', airline_iata);
        if (dep_iata) apiUrl.searchParams.append('dep_iata', dep_iata);
        if (arr_iata) apiUrl.searchParams.append('arr_iata', arr_iata);
        if (flight_status) apiUrl.searchParams.append('flight_status', flight_status);

        // Limit results to 10 for better performance
        apiUrl.searchParams.append('limit', '10');

        // Fetch data from Aviationstack API
        const response = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Cache for 5 minutes to reduce API calls
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    error: 'Failed to fetch flight data',
                    details: errorData
                },
                { status: response.status }
            );
        }

        const data: AviationstackResponse = await response.json();

        // Return the flight data
        return NextResponse.json(data);

    } catch (error) {
        console.error('Flight API Error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
