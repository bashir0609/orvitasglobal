"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="pt-32 pb-24 container mx-auto px-4">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
                        Start Your <span className="text-accent">Global Journey</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Fill out the form below or reach out to us directly. Our expert counselors are ready to help you every step of the way.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-secondary rounded-lg text-accent">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Headquarters</h4>
                                        <p className="text-muted-foreground mt-1">123 Education Street, Consultancy Hub<br />London, UK</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-secondary rounded-lg text-accent">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Phone</h4>
                                        <p className="text-muted-foreground mt-1">+44 123 456 7890</p>
                                        <p className="text-sm text-gray-500">Mon-Fri 9am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-secondary rounded-lg text-accent">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Email</h4>
                                        <p className="text-muted-foreground mt-1">info@orvitasglobal.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-blue-900/20 border border-blue-500/20 rounded-2xl">
                            <h4 className="font-bold text-blue-400 mb-2">Note for Students</h4>
                            <p className="text-sm text-blue-200/70">
                                Please adhere to scheduled appointment times. Bring all necessary educational documents for a comprehensive profile evaluation.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-secondary p-8 rounded-3xl border border-white/5 shadow-2xl"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                                    <input
                                        type="text" id="name" placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                    <input
                                        type="tel" id="phone" placeholder="+1 (555) 000-0000"
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                <input
                                    type="email" id="email" placeholder="john@example.com"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="destination" className="text-sm font-medium">Preferred Destination</label>
                                <select
                                    id="destination"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                                >
                                    <option value="">Select a country</option>
                                    <option value="uk">United Kingdom</option>
                                    <option value="canada">Canada</option>
                                    <option value="australia">Australia</option>
                                    <option value="europe">Europe</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea
                                    id="message" rows={4} placeholder="Tell us about your educational background and goals..."
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="button" // Change to submit when wired up
                                className="w-full py-4 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg transform active:scale-95 flex items-center justify-center space-x-2"
                            >
                                <span>Send Message</span>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>

            </div>

            <Footer />
        </div>
    );
}
