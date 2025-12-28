// TypeScript types for Aviationstack API responses

export interface Airport {
  airport: string;
  timezone: string;
  iata: string;
  icao: string;
  terminal: string | null;
  gate: string | null;
  delay: number | null;
  scheduled: string;
  estimated: string;
  actual: string | null;
  estimated_runway: string | null;
  actual_runway: string | null;
}

export interface Airline {
  name: string;
  iata: string;
  icao: string;
}

export interface Flight {
  flight_date: string;
  flight_status: FlightStatus;
  departure: Airport;
  arrival: Airport;
  airline: Airline;
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: any | null;
  };
  aircraft: {
    registration: string | null;
    iata: string | null;
    icao: string | null;
    icao24: string | null;
  } | null;
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  } | null;
}

export type FlightStatus = 
  | 'scheduled' 
  | 'active' 
  | 'landed' 
  | 'cancelled' 
  | 'incident' 
  | 'diverted';

export interface AviationstackResponse {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Flight[];
}

export interface FlightSearchParams {
  flight_iata?: string;
  airline_iata?: string;
  dep_iata?: string;
  arr_iata?: string;
  flight_status?: FlightStatus;
}
