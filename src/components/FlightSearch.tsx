'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Calendar, Users, Plane, MapPin, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<Airport | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState<'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'>('ECONOMY');
  
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [isSearchingDestination, setIsSearchingDestination] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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

  // Debounced airport search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (originInput.length >= 2 && !selectedOrigin) {
        searchAirports(originInput, 'origin');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [originInput, selectedOrigin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (destinationInput.length >= 2 && !selectedDestination) {
        searchAirports(destinationInput, 'destination');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [destinationInput, selectedDestination]);

  // Search airports
  const searchAirports = async (keyword: string, type: 'origin' | 'destination') => {
    if (keyword.length < 2) {
      if (type === 'origin') setOriginSuggestions([]);
      else setDestinationSuggestions([]);
      return;
    }

    if (type === 'origin') setIsSearchingOrigin(true);
    else setIsSearchingDestination(true);

    try {
      setErrorMessage(null);
      const response = await fetch(`/api/amadeus/airports?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (!response.ok) {
        const details = data.details ? JSON.stringify(data.details) : '';
        setErrorMessage(data.message || data.error || 'Airport search failed');
        if (details) console.log('Error details:', details); // Log details to console
        
        if (type === 'origin') {
            setOriginSuggestions([]);
            setShowOriginDropdown(true);
        } else {
            setDestinationSuggestions([]);
            setShowDestinationDropdown(true);
        }
        return;
      }

      if (data.data) {
        if (type === 'origin') {
          setOriginSuggestions(data.data);
          setShowOriginDropdown(true);
        } else {
          setDestinationSuggestions(data.data);
          setShowDestinationDropdown(true);
        }
      } else {
        // Even if empty, show dropdown to display "No results" message
        if (type === 'origin') {
            setOriginSuggestions([]);
            setShowOriginDropdown(true);
        } else {
            setDestinationSuggestions([]);
            setShowDestinationDropdown(true);
        }
      }
    } catch (error) {
      console.error('Airport search error:', error);
    } finally {
      if (type === 'origin') setIsSearchingOrigin(false);
      else setIsSearchingDestination(false);
    }
  };

  const selectAirport = (airport: Airport, type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setSelectedOrigin(airport);
      setOriginInput(`${airport.cityName}, ${airport.countryName} (${airport.iataCode})`);
      setShowOriginDropdown(false);
    } else {
      setSelectedDestination(airport);
      setDestinationInput(`${airport.cityName}, ${airport.countryName} (${airport.iataCode})`);
      setShowDestinationDropdown(false);
    }
  };

  const clearOrigin = () => {
    setSelectedOrigin(null);
    setOriginInput('');
    setOriginSuggestions([]);
  };

  const clearDestination = () => {
    setSelectedDestination(null);
    setDestinationInput('');
    setDestinationSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrigin || !selectedDestination || !departureDate) {
      alert('Please select origin, destination, and departure date');
      return;
    }

    if (tripType === 'round-trip' && !returnDate) {
      alert('Please select return date for round-trip');
      return;
    }

    const params: SearchParams = {
      origin: selectedOrigin.iataCode,
      destination: selectedDestination.iataCode,
      departureDate: departureDate.toISOString().split('T')[0],
      returnDate: tripType === 'round-trip' && returnDate ? returnDate.toISOString().split('T')[0] : undefined,
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
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={20} />
            <input
              type="text"
              value={originInput}
              onChange={(e) => {
                setOriginInput(e.target.value);
                if (selectedOrigin) setSelectedOrigin(null);
              }}
              onFocus={() => originSuggestions.length > 0 && setShowOriginDropdown(true)}
              placeholder="Type city or airport..."
              required
              className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {(originInput || selectedOrigin) && (
              <button
                type="button"
                onClick={clearOrigin}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
              >
                <X size={16} />
              </button>
            )}
            {isSearchingOrigin && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            )}
          </div>
            {showOriginDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-secondary border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                {errorMessage ? (
                  <div className="p-4 text-center text-red-400">
                    <p className="font-medium mb-1">Search Error</p>
                    <p className="text-xs">{errorMessage}</p>
                    <p className="text-xs opacity-70 mt-1">Check API credentials in dashboard</p>
                  </div>
                ) : originSuggestions.length > 0 ? (
                  originSuggestions.map((airport) => (
                    <button
                      key={airport.iataCode}
                      type="button"
                      onClick={() => selectAirport(airport, 'origin')}
                      className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{airport.cityName}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {airport.name}
                          </div>
                        </div>
                        <div className="text-accent font-bold ml-2">{airport.iataCode}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    <p className="font-medium mb-1">No results found</p>
                    <p className="text-xs opacity-70">
                      Test Mode likely supports only: US, UK, ES, DE, IN
                    </p>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Destination */}
        <div ref={destinationRef} className="relative">
          <label className="block text-sm font-medium mb-2">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" size={20} />
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => {
                setDestinationInput(e.target.value);
                if (selectedDestination) setSelectedDestination(null);
              }}
              onFocus={() => setShowDestinationDropdown(true)}
              placeholder="Type city or airport..."
              required
              className="w-full pl-11 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {/* Same clear button and spinner code... */}
            {(destinationInput || selectedDestination) && (
              <button
                type="button"
                onClick={clearDestination}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
              >
                <X size={16} />
              </button>
            )}
            {isSearchingDestination && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {showDestinationDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-secondary border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {errorMessage ? (
                <div className="p-4 text-center text-red-400">
                  <p className="font-medium mb-1">Search Error</p>
                  <p className="text-xs">{errorMessage}</p>
                </div>
              ) : destinationSuggestions.length > 0 ? (
                destinationSuggestions.map((airport) => (
                  <button
                    key={airport.iataCode}
                    type="button"
                    onClick={() => selectAirport(airport, 'destination')}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{airport.cityName}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {airport.name}
                        </div>
                      </div>
                      <div className="text-accent font-bold ml-2">{airport.iataCode}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <p className="font-medium mb-1">No results found</p>
                  <p className="text-xs opacity-70">
                    Test Mode likely supports only: US, UK, ES, DE, IN
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Departure Date */}
        <div className="flight-datepicker">
          <label className="block text-sm font-medium mb-2">Departure</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={20} />
            <DatePicker
              selected={departureDate}
              onChange={(date: Date | null) => setDepartureDate(date)}
              minDate={new Date()}
              dateFormat="MMM dd, yyyy"
              placeholderText="Select date"
              required
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground"
            />
          </div>
        </div>

        {/* Return Date */}
        {tripType === 'round-trip' && (
          <div className="flight-datepicker">
            <label className="block text-sm font-medium mb-2">Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={20} />
              <DatePicker
                selected={returnDate}
                onChange={(date: Date | null) => setReturnDate(date)}
                minDate={departureDate || new Date()}
                dateFormat="MMM dd, yyyy"
                placeholderText="Select date"
                required={tripType === 'round-trip'}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground"
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
