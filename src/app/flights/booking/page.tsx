'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PassengerForm from "@/components/PassengerForm";
import BookingSummary from "@/components/BookingSummary";
import { Plane, ArrowLeft } from "lucide-react";
import type { FlightOffer, Traveler, BookingRequest } from '@/types/amadeus';

export default function BookingPage() {
    const router = useRouter();
    const [flightOffer, setFlightOffer] = useState<FlightOffer | null>(null);
    const [dictionaries, setDictionaries] = useState<any>(null);
    const [step, setStep] = useState<'passenger-info' | 'review'>('passenger-info');
    const [travelers, setTravelers] = useState<Traveler[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load selected flight from sessionStorage
        const selectedFlight = sessionStorage.getItem('selectedFlight');
        const flightDictionaries = sessionStorage.getItem('flightDictionaries');
        
        if (!selectedFlight) {
            router.push('/flights');
            return;
        }

        setFlightOffer(JSON.parse(selectedFlight));
        if (flightDictionaries) {
            setDictionaries(JSON.parse(flightDictionaries));
        }
    }, [router]);

    const handlePassengerSubmit = async (passengerData: Traveler[]) => {
        setIsLoading(true);
        setError(null);

        try {
            // First, confirm the price
            const priceResponse = await fetch('/api/amadeus/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: {
                        type: 'flight-offers-pricing',
                        flightOffers: [flightOffer],
                    },
                }),
            });

            const priceData = await priceResponse.json();

            if (!priceResponse.ok) {
                throw new Error(priceData.error || 'Failed to confirm price');
            }

            // Update flight offer with confirmed pricing
            if (priceData.data?.flightOffers?.[0]) {
                setFlightOffer(priceData.data.flightOffers[0]);
            }

            setTravelers(passengerData);
            setStep('review');
        } catch (err: any) {
            console.error('Price confirmation error:', err);
            setError(err.message || 'Failed to confirm pricing. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const bookingRequest: BookingRequest = {
                data: {
                    type: 'flight-order',
                    flightOffers: [flightOffer!],
                    travelers: travelers,
                },
            };

            const response = await fetch('/api/amadeus/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingRequest),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Booking failed');
            }

            // Store booking confirmation
            sessionStorage.setItem('bookingConfirmation', JSON.stringify(data.data));
            sessionStorage.removeItem('selectedFlight');
            sessionStorage.removeItem('flightDictionaries');

            // Redirect to confirmation page
            router.push('/flights/confirmation');
        } catch (err: any) {
            console.error('Booking error:', err);
            setError(err.message || 'Booking failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!flightOffer) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    const passengerCount = flightOffer.travelerPricings.length;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
            <Navbar />

            <section className="pt-32 pb-16">
                <div className="container px-4 mx-auto max-w-6xl">
                    {/* Back button */}
                    <button
                        onClick={() => step === 'review' ? setStep('passenger-info') : router.push('/flights')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </button>

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-6">
                            <Plane className="text-accent" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            {step === 'passenger-info' ? 'Passenger Details' : 'Review Booking'}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {step === 'passenger-info' 
                                ? 'Please provide passenger information for all travelers'
                                : 'Review your booking details before confirming'
                            }
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                            <h3 className="font-semibold text-red-400 mb-2">Error</h3>
                            <p className="text-red-300">{error}</p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {step === 'passenger-info' ? (
                                <PassengerForm
                                    passengerCount={passengerCount}
                                    onSubmit={handlePassengerSubmit}
                                    isLoading={isLoading}
                                />
                            ) : (
                                <BookingSummary
                                    flightOffer={flightOffer}
                                    travelers={travelers}
                                    dictionaries={dictionaries}
                                    onConfirm={handleConfirmBooking}
                                    isLoading={isLoading}
                                />
                            )}
                        </div>

                        {/* Sidebar - Flight Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24">
                                <h3 className="text-lg font-semibold mb-4">Flight Summary</h3>
                                
                                {flightOffer.itineraries.map((itinerary, index) => {
                                    const firstSegment = itinerary.segments[0];
                                    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                                    
                                    return (
                                        <div key={index} className={index > 0 ? 'mt-4 pt-4 border-t border-white/10' : ''}>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                {flightOffer.itineraries.length > 1 ? (index === 0 ? 'Outbound' : 'Return') : 'Flight'}
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium">{firstSegment.departure.iataCode}</span>
                                                <Plane className="text-muted-foreground" size={16} />
                                                <span className="font-medium">{lastSegment.arrival.iataCode}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(firstSegment.departure.at).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-muted-foreground">Passengers</span>
                                        <span className="font-medium">{passengerCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-accent">
                                            ${parseFloat(flightOffer.price.total).toFixed(0)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
