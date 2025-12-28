"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plane, Loader2, AlertCircle } from "lucide-react";
import FlightCard from "./FlightCard";
import type { Flight, AviationstackResponse } from "@/types/flight";

export default function FlightTracker() {
    const [searchType, setSearchType] = useState<"flight" | "route">("flight");
    const [flightNumber, setFlightNumber] = useState("");
    const [departureCode, setDepartureCode] = useState("");
    const [arrivalCode, setArrivalCode] = useState("");
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const params = new URLSearchParams();

            if (searchType === "flight" && flightNumber) {
                params.append("flight_iata", flightNumber.toUpperCase());
            } else if (searchType === "route") {
                if (departureCode) params.append("dep_iata", departureCode.toUpperCase());
                if (arrivalCode) params.append("arr_iata", arrivalCode.toUpperCase());
            }

            const response = await fetch(`/api/flights?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch flight data");
            }

            const data: AviationstackResponse = await response.json();
            setFlights(data.data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="space-y-8">
            {/* Search Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            >
                {/* Search Type Toggle */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setSearchType("flight")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${searchType === "flight"
                                ? "bg-accent text-accent-foreground shadow-lg"
                                : "bg-white/5 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <Plane size={18} />
                            <span>Flight Number</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setSearchType("route")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${searchType === "route"
                                ? "bg-accent text-accent-foreground shadow-lg"
                                : "bg-white/5 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        <div className="flex items-center space-x-2">
                            <Search size={18} />
                            <span>By Route</span>
                        </div>
                    </button>
                </div>

                {/* Search Inputs */}
                {searchType === "flight" ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Flight Number (e.g., AA100, BA123)
                            </label>
                            <input
                                type="text"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter flight number..."
                                className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Departure Airport (IATA Code)
                            </label>
                            <input
                                type="text"
                                value={departureCode}
                                onChange={(e) => setDepartureCode(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="e.g., JFK, LAX"
                                maxLength={3}
                                className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                Arrival Airport (IATA Code)
                            </label>
                            <input
                                type="text"
                                value={arrivalCode}
                                onChange={(e) => setArrivalCode(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="e.g., LHR, CDG"
                                maxLength={3}
                                className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground uppercase"
                            />
                        </div>
                    </div>
                )}

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={loading || (searchType === "flight" ? !flightNumber : !departureCode && !arrivalCode)}
                    className="mt-6 w-full md:w-auto px-8 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <Search size={20} />
                            <span>Search Flights</span>
                        </>
                    )}
                </button>
            </motion.div>

            {/* Results Section */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center space-y-4">
                        <Loader2 className="animate-spin mx-auto text-accent" size={48} />
                        <p className="text-muted-foreground">Searching for flights...</p>
                    </div>
                </div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start space-x-4"
                >
                    <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
                    <div>
                        <h3 className="font-bold text-red-400 mb-1">Error</h3>
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                </motion.div>
            )}

            {!loading && !error && searched && flights.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
                >
                    <Plane className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <h3 className="text-xl font-bold mb-2">No Flights Found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search criteria or check the flight number/airport codes.
                    </p>
                </motion.div>
            )}

            {!loading && flights.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            Found {flights.length} {flights.length === 1 ? "Flight" : "Flights"}
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {flights.map((flight, index) => (
                            <FlightCard key={index} flight={flight} index={index} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
