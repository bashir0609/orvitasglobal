'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlightSearch, { SearchParams } from "@/components/FlightSearch";
import FlightResults from "@/components/FlightResults";
import { Plane } from "lucide-react";
import type { FlightOffer, FlightOffersResponse } from '@/types/amadeus';

export default function FlightsPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<FlightOffersResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (params: SearchParams) => {
        setIsSearching(true);
        setError(null);
        setSearchResults(null);

        try {
            // Build query parameters
            const queryParams = new URLSearchParams({
                origin: params.origin,
                destination: params.destination,
                departureDate: params.departureDate,
                adults: params.adults.toString(),
                travelClass: params.travelClass,
            });

            if (params.returnDate) {
                queryParams.append('returnDate', params.returnDate);
            }
            if (params.children > 0) {
                queryParams.append('children', params.children.toString());
            }
            if (params.infants > 0) {
                queryParams.append('infants', params.infants.toString());
            }

            // Call search API
            const response = await fetch(`/api/amadeus/search?${queryParams.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to search flights');
            }

            setSearchResults(data);
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err.message || 'An error occurred while searching for flights');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectFlight = (offer: FlightOffer) => {
        // Store selected flight in sessionStorage for booking page
        sessionStorage.setItem('selectedFlight', JSON.stringify(offer));
        sessionStorage.setItem('flightDictionaries', JSON.stringify(searchResults?.dictionaries || {}));
        
        // Navigate to booking page
        window.location.href = '/flights/booking';
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />

                <div className="container px-4 mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-6">
                            <Plane className="text-accent" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
                            Book Your <span className="text-accent">Flight</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Search and book flights to your study destination. Compare prices from hundreds of airlines worldwide.
                        </p>
                    </div>

                    {/* Flight Search Form */}
                    <div className="max-w-6xl mx-auto">
                        <FlightSearch onSearch={handleSearch} isLoading={isSearching} />
                    </div>
                </div>
            </section>

            {/* Search Results Section */}
            {(searchResults || error) && (
                <section className="pb-24">
                    <div className="container px-4 mx-auto max-w-6xl">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                                <h3 className="font-semibold text-red-400 mb-2">Search Error</h3>
                                <p className="text-red-300">{error}</p>
                            </div>
                        )}

                        {searchResults && (
                            <FlightResults
                                offers={searchResults.data}
                                dictionaries={searchResults.dictionaries}
                                onSelectFlight={handleSelectFlight}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* Info Section */}
            <section className="py-16 bg-white/5 border-y border-white/5">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold font-heading mb-8 text-center">
                            Why Book with <span className="text-accent">OrvitasGlobal</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold mb-4">
                                    1
                                </div>
                                <h3 className="font-bold text-lg mb-2">Best Prices</h3>
                                <p className="text-sm text-muted-foreground">
                                    Compare prices from hundreds of airlines to find the best deals for your journey.
                                </p>
                            </div>
                            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold mb-4">
                                    2
                                </div>
                                <h3 className="font-bold text-lg mb-2">Secure Booking</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your booking is protected with industry-standard security and instant confirmation.
                                </p>
                            </div>
                            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold mb-4">
                                    3
                                </div>
                                <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                                <p className="text-sm text-muted-foreground">
                                    Our dedicated team is available around the clock to assist with your travel needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
