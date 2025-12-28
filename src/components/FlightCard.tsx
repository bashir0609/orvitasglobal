"use client";

import { motion } from "framer-motion";
import { Plane, MapPin, Clock, AlertCircle } from "lucide-react";
import type { Flight } from "@/types/flight";

interface FlightCardProps {
    flight: Flight;
    index: number;
}

export default function FlightCard({ flight, index }: FlightCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500/20 text-green-400 border-green-500/30";
            case "scheduled":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "landed":
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            case "cancelled":
                return "bg-red-500/20 text-red-400 border-red-500/30";
            case "delayed":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-secondary/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Plane className="text-accent" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">
                            {flight.airline.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Flight {flight.flight.iata || flight.flight.number}
                        </p>
                    </div>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        flight.flight_status
                    )}`}
                >
                    {flight.flight_status.toUpperCase()}
                </span>
            </div>

            {/* Route Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Departure */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span className="text-xs font-medium">DEPARTURE</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{flight.departure.iata}</p>
                        <p className="text-sm text-muted-foreground truncate">
                            {flight.departure.airport}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                            <Clock size={14} className="text-muted-foreground" />
                            <span className="text-sm">
                                {formatTime(flight.departure.scheduled)}
                            </span>
                        </div>
                        {flight.departure.terminal && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Terminal {flight.departure.terminal}
                                {flight.departure.gate && ` • Gate ${flight.departure.gate}`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Flight Path */}
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent to-transparent" />
                        <Plane className="text-accent rotate-90" size={20} />
                        <div className="h-px w-12 bg-gradient-to-r from-accent via-transparent to-transparent" />
                    </div>
                </div>

                {/* Arrival */}
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span className="text-xs font-medium">ARRIVAL</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{flight.arrival.iata}</p>
                        <p className="text-sm text-muted-foreground truncate">
                            {flight.arrival.airport}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                            <Clock size={14} className="text-muted-foreground" />
                            <span className="text-sm">
                                {formatTime(flight.arrival.scheduled)}
                            </span>
                        </div>
                        {flight.arrival.terminal && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Terminal {flight.arrival.terminal}
                                {flight.arrival.gate && ` • Gate ${flight.arrival.gate}`}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-4 text-sm">
                <div>
                    <span className="text-muted-foreground">Date: </span>
                    <span className="font-medium">{formatDate(flight.flight_date)}</span>
                </div>
                {flight.aircraft && flight.aircraft.iata && (
                    <div>
                        <span className="text-muted-foreground">Aircraft: </span>
                        <span className="font-medium">{flight.aircraft.iata}</span>
                    </div>
                )}
                {flight.departure.delay && flight.departure.delay > 0 && (
                    <div className="flex items-center space-x-1 text-yellow-400">
                        <AlertCircle size={14} />
                        <span>Delayed {flight.departure.delay} min</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
