import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlightTracker from "@/components/FlightTracker";
import { Plane } from "lucide-react";

export const metadata = {
    title: "Flight Tracker | OrvitasGlobal",
    description: "Track real-time flight status and information for international students traveling abroad. Monitor departures, arrivals, and flight delays.",
};

export default function FlightsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />

                <div className="container px-4 mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/20 mb-6">
                            <Plane className="text-accent" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
                            Track Your <span className="text-accent">Flight</span> in Real-Time
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Stay updated with live flight information. Perfect for students traveling to their study destinations abroad.
                        </p>
                    </div>
                </div>
            </section>

            {/* Flight Tracker Section */}
            <section className="pb-24">
                <div className="container px-4 mx-auto max-w-6xl">
                    <FlightTracker />
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 bg-white/5 border-y border-white/5">
                <div className="container px-4 mx-auto">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold font-heading mb-8 text-center">
                            How to Use the <span className="text-accent">Flight Tracker</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold mb-4">
                                    1
                                </div>
                                <h3 className="font-bold text-lg mb-2">Search by Flight Number</h3>
                                <p className="text-sm text-muted-foreground">
                                    Enter your flight number (e.g., AA100, BA123) to get real-time status, gate information, and delays.
                                </p>
                            </div>
                            <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold mb-4">
                                    2
                                </div>
                                <h3 className="font-bold text-lg mb-2">Search by Route</h3>
                                <p className="text-sm text-muted-foreground">
                                    Enter departure and arrival airport codes (e.g., JFK to LHR) to see all flights on that route.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                            <p className="text-sm text-center text-muted-foreground">
                                <strong className="text-foreground">Tip:</strong> Use 3-letter IATA airport codes (e.g., JFK for New York, LHR for London, DXB for Dubai) for best results.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
