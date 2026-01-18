// Amadeus API Types

export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
  countryCode: string;
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}

export interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface Itinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees?: Array<{
    amount: string;
    type: string;
  }>;
  grandTotal: string;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags: {
      quantity?: number;
      weight?: number;
      weightUnit?: string;
    };
  }>;
}

export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface FlightOffersResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: FlightOffer[];
  dictionaries: {
    locations: Record<
      string,
      {
        cityCode: string;
        countryCode: string;
      }
    >;
    aircraft: Record<string, string>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

export interface Traveler {
  id: string;
  dateOfBirth: string;
  name: {
    firstName: string;
    lastName: string;
  };
  gender: "MALE" | "FEMALE";
  contact: {
    emailAddress: string;
    phones: Array<{
      deviceType: "MOBILE" | "LANDLINE";
      countryCallingCode: string;
      number: string;
    }>;
  };
  documents?: Array<{
    documentType: "PASSPORT" | "IDENTITY_CARD";
    birthPlace?: string;
    issuanceLocation?: string;
    issuanceDate?: string;
    number: string;
    expiryDate: string;
    issuanceCountry: string;
    validityCountry: string;
    nationality: string;
    holder: boolean;
  }>;
}

export interface BookingRequest {
  data: {
    type: "flight-order";
    flightOffers: FlightOffer[];
    travelers: Traveler[];
  };
}

export interface FlightOrder {
  type: string;
  id: string;
  queuingOfficeId: string;
  associatedRecords: Array<{
    reference: string;
    creationDate: string;
    originSystemCode: string;
    flightOfferId: string;
  }>;
  flightOffers: FlightOffer[];
  travelers: Traveler[];
  contacts?: Array<{
    addresseeName: {
      firstName: string;
      lastName: string;
    };
    companyName?: string;
    purpose: string;
    phones: Array<{
      deviceType: string;
      countryCallingCode: string;
      number: string;
    }>;
    emailAddress: string;
    address?: {
      lines: string[];
      postalCode: string;
      cityName: string;
      countryCode: string;
    };
  }>;
}

export interface BookingResponse {
  data: FlightOrder;
}

export interface PriceConfirmationRequest {
  data: {
    type: "flight-offers-pricing";
    flightOffers: FlightOffer[];
  };
}

export interface PriceConfirmationResponse {
  data: {
    type: string;
    flightOffers: FlightOffer[];
  };
}

export interface AmadeusError {
  errors: Array<{
    status: number;
    code: number;
    title: string;
    detail: string;
    source?: {
      parameter?: string;
      pointer?: string;
      example?: string;
    };
  }>;
}
