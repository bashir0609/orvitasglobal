'use client';

import { useState } from 'react';
import { Clock, Plane, ArrowRight } from 'lucide-react';
import type { FlightOffer } from '@/types/amadeus';

interface FlightResultsProps {
  offers: FlightOffer[];
  dictionaries: any;
  onSelectFlight: (offer: FlightOffer) => void;
}

export default function FlightResults({ offers, dictionaries, onSelectFlight }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  // Format duration from ISO 8601 to readable format
  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    
    return `${hours}h ${minutes}m`;
  };

  // Format time from ISO 8601 to readable format
  const formatTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Format date
  const formatDate = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get airline name from code
  const getAirlineName = (code: string): string => {
    return dictionaries?.carriers?.[code] || code;
  };

  // Sort offers
  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(a.price.total) - parseFloat(b.price.total);
      case 'duration':
        return a.itineraries[0].duration.localeCompare(b.itineraries[0].duration);
      case 'departure':
        return a.itineraries[0].segments[0].departure.at.localeCompare(b.itineraries[0].segments[0].departure.at);
      default:
        return 0;
    }
  });

  if (offers.length === 0) {
    return (
      <div className="text-center py-16">
        <Plane className="mx-auto mb-4 text-muted-foreground" size={48} />
        <h3 className="text-xl font-semibold mb-2">No flights found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sort options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">
          {offers.length} Flight{offers.length !== 1 ? 's' : ''} Found
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('price')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'price'
                ? 'bg-accent text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            Cheapest
          </button>
          <button
            onClick={() => setSortBy('duration')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'duration'
                ? 'bg-accent text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            Fastest
          </button>
          <button
            onClick={() => setSortBy('departure')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === 'departure'
                ? 'bg-accent text-white'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            Earliest
          </button>
        </div>
      </div>

      {/* Flight offers */}
      <div className="space-y-4">
        {sortedOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all"
          >
            {offer.itineraries.map((itinerary, itineraryIndex) => {
              const firstSegment = itinerary.segments[0];
              const lastSegment = itinerary.segments[itinerary.segments.length - 1];
              const stops = itinerary.segments.length - 1;

              return (
                <div key={itineraryIndex} className={itineraryIndex > 0 ? 'mt-6 pt-6 border-t border-white/10' : ''}>
                  {/* Itinerary label */}
                  {offer.itineraries.length > 1 && (
                    <div className="text-sm text-muted-foreground mb-3">
                      {itineraryIndex === 0 ? 'Outbound' : 'Return'}
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Flight details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        {/* Airline logo placeholder */}
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                          <Plane className="text-accent" size={24} />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {getAirlineName(firstSegment.carrierCode)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {firstSegment.carrierCode} {firstSegment.number}
                            {stops > 0 && ` • ${stops} stop${stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                      </div>

                      {/* Time and route */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatTime(firstSegment.departure.at)}</div>
                          <div className="text-sm text-muted-foreground">{firstSegment.departure.iataCode}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(firstSegment.departure.at)}</div>
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                          <div className="text-sm text-muted-foreground mb-1">
                            {formatDuration(itinerary.duration)}
                          </div>
                          <div className="w-full h-px bg-white/20 relative">
                            <ArrowRight className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-muted-foreground" size={16} />
                          </div>
                          {stops > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              via {itinerary.segments.slice(0, -1).map(s => s.arrival.iataCode).join(', ')}
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatTime(lastSegment.arrival.at)}</div>
                          <div className="text-sm text-muted-foreground">{lastSegment.arrival.iataCode}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(lastSegment.arrival.at)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Price and select button (only show on first itinerary) */}
                    {itineraryIndex === 0 && (
                      <div className="lg:w-48 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-accent">
                            ${parseFloat(offer.price.total).toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {offer.price.currency}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {offer.travelerPricings.length} traveler{offer.travelerPricings.length > 1 ? 's' : ''}
                          </div>
                        </div>
                        <button
                          onClick={() => onSelectFlight(offer)}
                          className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-all whitespace-nowrap"
                        >
                          Select Flight
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Additional info */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Bookable seats: {offer.numberOfBookableSeats}</span>
              </div>
              {offer.travelerPricings[0]?.fareDetailsBySegment[0]?.includedCheckedBags && (
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>
                    {offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity || 0} checked bag
                    {(offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>Cabin: {offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'Economy'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
