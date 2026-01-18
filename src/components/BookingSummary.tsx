'use client';

import { ArrowRight, Plane, Clock, Users } from 'lucide-react';
import type { FlightOffer, Traveler } from '@/types/amadeus';

interface BookingSummaryProps {
  flightOffer: FlightOffer;
  travelers: Traveler[];
  dictionaries: any;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function BookingSummary({ flightOffer, travelers, dictionaries, onConfirm, isLoading = false }: BookingSummaryProps) {
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
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get airline name from code
  const getAirlineName = (code: string): string => {
    return dictionaries?.carriers?.[code] || code;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Booking Summary</h2>

      {/* Flight Details */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Flight Details</h3>
        
        {flightOffer.itineraries.map((itinerary, itineraryIndex) => {
          const firstSegment = itinerary.segments[0];
          const lastSegment = itinerary.segments[itinerary.segments.length - 1];
          const stops = itinerary.segments.length - 1;

          return (
            <div key={itineraryIndex} className={itineraryIndex > 0 ? 'mt-6 pt-6 border-t border-white/10' : ''}>
              {/* Itinerary label */}
              {flightOffer.itineraries.length > 1 && (
                <div className="text-sm font-medium text-accent mb-3">
                  {itineraryIndex === 0 ? 'Outbound Flight' : 'Return Flight'}
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
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

              <div className="grid grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-2xl font-bold">{formatTime(firstSegment.departure.at)}</div>
                  <div className="text-sm font-medium">{firstSegment.departure.iataCode}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(firstSegment.departure.at)}</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <div className="flex-1 h-px bg-white/20" />
                    <Clock className="mx-2 text-muted-foreground" size={16} />
                    <div className="flex-1 h-px bg-white/20" />
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDuration(itinerary.duration)}</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">{formatTime(lastSegment.arrival.at)}</div>
                  <div className="text-sm font-medium">{lastSegment.arrival.iataCode}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(lastSegment.arrival.at)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Passenger Details */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users size={20} />
          Passengers ({travelers.length})
        </h3>
        <div className="space-y-3">
          {travelers.map((traveler, index) => (
            <div key={traveler.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <div>
                <div className="font-medium">
                  {traveler.name.firstName} {traveler.name.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Born: {new Date(traveler.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {traveler.gender.toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Base Fare ({travelers.length} passenger{travelers.length > 1 ? 's' : ''})</span>
            <span>${parseFloat(flightOffer.price.base).toFixed(2)}</span>
          </div>
          {flightOffer.price.fees && flightOffer.price.fees.length > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Taxes & Fees</span>
              <span>
                ${flightOffer.price.fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0).toFixed(2)}
              </span>
            </div>
          )}
          <div className="pt-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-xl font-bold">Total</span>
            <span className="text-3xl font-bold text-accent">
              ${parseFloat(flightOffer.price.total).toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            {flightOffer.price.currency}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          By confirming this booking, you agree to the airline's terms and conditions, fare rules, and cancellation policies.
        </p>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Confirming Booking...
          </>
        ) : (
          <>
            Confirm Booking
            <ArrowRight size={20} />
          </>
        )}
      </button>
    </div>
  );
}
