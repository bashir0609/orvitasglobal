'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Plane, Download, Mail, ArrowRight } from "lucide-react";
import type { FlightOrder } from '@/types/amadeus';

export default function ConfirmationPage() {
    const router = useRouter();
    const [booking, setBooking] = useState<FlightOrder | null>(null);

    useEffect(() => {
        const bookingData = sessionStorage.getItem('bookingConfirmation');
        
        if (!bookingData) {
            router.push('/flights');
            return;
        }

        setBooking(JSON.parse(bookingData));
    }, [router]);

    const formatTime = (dateTime: string): string => {
        const date = new Date(dateTime);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (dateTime: string): string => {
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (!booking) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    const pnr = booking.associatedRecords?.[0]?.reference || booking.id;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
            <Navbar />

            <section className="pt-32 pb-16">
                <div className="container px-4 mx-auto max-w-4xl">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-500/20 mb-6">
                            <CheckCircle className="text-green-400" size={48} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                            Booking <span className="text-accent">Confirmed!</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-6">
                            Your flight has been successfully booked. A confirmation email has been sent to your registered email address.
                        </p>
                        
                        {/* Booking Reference */}
                        <div className="inline-block bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl px-8 py-4">
                            <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
                            <div className="text-3xl font-bold font-mono tracking-wider">{pnr}</div>
                        </div>
                    </div>

                    {/* Flight Details */}
                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-6">Flight Itinerary</h2>
                        
                        {booking.flightOffers[0].itineraries.map((itinerary, itineraryIndex) => {
                            const firstSegment = itinerary.segments[0];
                            const lastSegment = itinerary.segments[itinerary.segments.length - 1];

                            return (
                                <div key={itineraryIndex} className={itineraryIndex > 0 ? 'mt-6 pt-6 border-t border-white/10' : ''}>
                                    <div className="text-sm font-medium text-accent mb-4">
                                        {booking.flightOffers[0].itineraries.length > 1 
                                            ? (itineraryIndex === 0 ? 'Outbound Flight' : 'Return Flight')
                                            : 'Flight Details'
                                        }
                                    </div>

                                    {itinerary.segments.map((segment, segmentIndex) => (
                                        <div key={segmentIndex} className={segmentIndex > 0 ? 'mt-4 pt-4 border-t border-white/5' : ''}>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                                    <Plane className="text-accent" size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold mb-1">
                                                        {segment.carrierCode} {segment.number}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <div className="text-muted-foreground">Departure</div>
                                                            <div className="font-medium">{segment.departure.iataCode}</div>
                                                            <div>{formatDate(segment.departure.at)}</div>
                                                            <div className="text-lg font-semibold">{formatTime(segment.departure.at)}</div>
                                                            {segment.departure.terminal && (
                                                                <div className="text-muted-foreground">Terminal {segment.departure.terminal}</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-muted-foreground">Arrival</div>
                                                            <div className="font-medium">{segment.arrival.iataCode}</div>
                                                            <div>{formatDate(segment.arrival.at)}</div>
                                                            <div className="text-lg font-semibold">{formatTime(segment.arrival.at)}</div>
                                                            {segment.arrival.terminal && (
                                                                <div className="text-muted-foreground">Terminal {segment.arrival.terminal}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    {/* Passenger Details */}
                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Passenger Information</h2>
                        <div className="space-y-3">
                            {booking.travelers.map((traveler, index) => (
                                <div key={traveler.id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                    <div>
                                        <div className="font-semibold">
                                            {traveler.name.firstName} {traveler.name.lastName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            DOB: {new Date(traveler.dateOfBirth).toLocaleDateString('en-US', { 
                                                month: 'short', 
                                                day: 'numeric', 
                                                year: 'numeric' 
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground capitalize">
                                        Passenger {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Information */}
                    {booking.travelers[0]?.contact && (
                        <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-muted-foreground" />
                                    <span>{booking.travelers[0].contact.emailAddress}</span>
                                </div>
                                {booking.travelers[0].contact.phones?.[0] && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">📞</span>
                                        <span>
                                            +{booking.travelers[0].contact.phones[0].countryCallingCode}{' '}
                                            {booking.travelers[0].contact.phones[0].number}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Download size={20} />
                            Download Confirmation
                        </button>
                        <button
                            onClick={() => router.push('/flights')}
                            className="flex-1 bg-accent hover:bg-accent/90 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            Book Another Flight
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Important Information */}
                    <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                        <h3 className="font-semibold mb-3">Important Information</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Please arrive at the airport at least 3 hours before international flights</li>
                            <li>• Carry a valid passport and necessary travel documents</li>
                            <li>• Check baggage allowance and restrictions with your airline</li>
                            <li>• Keep your booking reference handy for check-in</li>
                        </ul>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
