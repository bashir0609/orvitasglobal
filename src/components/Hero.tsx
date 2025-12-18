"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                        <span className="text-sm font-medium text-muted-foreground tracking-wide">
                            Global Education Experts
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70 tracking-tight leading-tight">
                        Your Gateway to <br />
                        <span className="text-accent">Global Success</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Expert guidance for students aspiring to study in the UK, Europe,
                        Canada, and Australia. We turn your study abroad dreams into
                        reality.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/contact"
                            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-accent px-8 font-medium text-accent-foreground transition-all duration-300 hover:w-full sm:hover:w-auto hover:scale-105 hover:bg-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                        >
                            <span className="mr-2">Get Free Consultation</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="#destinations"
                            className="group inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 font-medium text-foreground transition-colors hover:bg-white/10 backdrop-blur-sm"
                        >
                            <Globe className="mr-2 h-4 w-4 text-accent" />
                            Explore Destinations
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
