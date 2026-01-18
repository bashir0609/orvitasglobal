'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Users, Plane } from 'lucide-react';
import type { Airport } from '@/types/amadeus';

interface FlightSearchProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  tripType: 'round-trip' | 'one-way';
}

export default function FlightSearch({ onSearch, isLoading = false }: FlightSearchProps) {
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState<'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'>('ECONOMY');
  
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  
  const originRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const passengerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationDropdown(false);
      }
      if (passengerRef.current && !passengerRef.current.contains(event.target as Node)) {
        setShowPassengerDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search airports
  const searchAirports = async (keyword: string, type: 'origin' | 'destination') => {
    if (keyword.length < 2) {
      if (type === 'origin') setOriginSuggestions([]);
      else setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/amadeus/airports?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (data.data) {
        if (type === 'origin') {
          setOriginSuggestions(data.data);
          setShowOriginDropdown(true);
        } else {
          setDestinationSuggestions(data.data);
          setShowDestinationDropdown(true);
        }
      }
    } catch (error) {
      console.error('Airport search error:', error);
    }
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    searchAirports(value, 'origin');
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    searchAirports(value, 'destination');
  };

  const selectAirport = (airport: Airport, type: 'origin' | 'destination') => {
    const displayValue = `${airport.cityName} (${airport.iataCode})`;
    if (type === 'origin') {
      setOrigin(displayValue);
      setShowOriginDropdown(false);
    } else {
      setDestination(displayValue);
      setShowDestinationDropdown(false);
    }
  };

  const extractIataCode = (value: string): string => {
    const match = value.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : value.toUpperCase().substring(0, 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: SearchParams = {
      origin: extractIataCode(origin),
      destination: extractIataCode(destination),
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      adults,
      children,
      infants,
      travelClass,
      tripType,
    };

    onSearch(params);
  };

  const totalPassengers = adults + children + infants;

  return (
    <form onSubmit={handleSubmit} className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
      {/* Trip Type Selector */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setTripType('round-trip')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            tripType === 'round-trip'
              ? 'bg-accent text-white'
              : 'bg-white/5 text-muted-foreground hover:bg-white/10'
          }`}
        >
          Round Trip
        </button>
        <button
          type="button"
          onClick={() => setTripType('one-way')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            tripType === 'one-way'
              ? 'bg-accent text-white'
              : 'bg-white/5 text-muted-foreground hover:bg-white/10'
          }`}
        >
          One Way
        </button>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Origin */}
        <div ref={originRef} className="relative">
          <label className="block text-sm font-medium mb-2">From</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              placeholder="City or Airport"
              required
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          {showOriginDropdown && originSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-secondary border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {originSuggestions.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectAirport(airport, 'origin')}
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="font-medium">{airport.cityName}</div>
                  <div className="text-sm text-muted-foreground">
                    {airport.name} ({airport.iataCode})
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination */}
        <div ref={destinationRef} className="relative">
          <label className="block text-sm font-medium mb-2">To</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90" size={20} />
            <input
              type="text"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              placeholder="City or Airport"
              required
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          {showDestinationDropdown && destinationSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-secondary border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {destinationSuggestions.map((airport) => (
                <button
                  key={airport.iataCode}
                  type="button"
                  onClick={() => selectAirport(airport, 'destination')}
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="font-medium">{airport.cityName}</div>
                  <div className="text-sm text-muted-foreground">
                    {airport.name} ({airport.iataCode})
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Departure</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>

        {/* Return Date */}
        {tripType === 'round-trip' && (
          <div>
            <label className="block text-sm font-medium mb-2">Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || new Date().toISOString().split('T')[0]}
                required={tripType === 'round-trip'}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Passengers and Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Passengers */}
        <div ref={passengerRef} className="relative">
          <label className="block text-sm font-medium mb-2">Passengers</label>
          <button
            type="button"
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <div className="flex items-center">
              <Users className="mr-3 text-muted-foreground" size={20} />
              <span>{totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}</span>
            </div>
          </button>
          {showPassengerDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-secondary border border-white/10 rounded-lg shadow-xl p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-muted-foreground">12+ years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(9, adults + 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-muted-foreground">2-11 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.min(9, children + 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-sm text-muted-foreground">Under 2 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{infants}</span>
                    <button
                      type="button"
                      onClick={() => setInfants(Math.min(adults, infants + 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Travel Class */}
        <div>
          <label className="block text-sm font-medium mb-2">Class</label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value as any)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First Class</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching Flights...
          </>
        ) : (
          <>
            <Search size={20} />
            Search Flights
          </>
        )}
      </button>
    </form>
  );
}
