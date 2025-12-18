"use client";

import { motion } from "framer-motion";
import { Award, Users, Globe, Target } from "lucide-react";

export default function AboutContent() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative py-24 pt-32 overflow-hidden">
                <div className="absolute inset-0 bg-secondary/30 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold font-heading mb-6"
                    >
                        Empowering <span className="text-accent">Global Ambitons</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        OrvitasGlobal is a premier education consultancy dedicated to connecting ambitious students with world-class universities across the UK, Canada, Australia, and Europe.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-secondary border border-white/5"
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                            <Target size={24} />
                        </div>
                        <h2 className="text-2xl font-bold font-heading mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To provide transparent, accurate, and personalized guidance to students, eliminating the complexities of the study abroad process and helping them secure their place in top-tier institutions.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-secondary border border-white/5"
                    >
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 mb-6">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-2xl font-bold font-heading mb-4">Our Vision</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To be the most trusted global education partner, recognized for our integrity, success rate, and the transformative impact we have on our students' careers and lives.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold font-heading mb-4">Our Core Values</h2>
                        <p className="text-muted-foreground">The principles that guide every consultation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="w-6 h-6" />,
                                title: "Student First",
                                desc: "We prioritize your career goals above all else, recommending universities that truly fit your profile."
                            },
                            {
                                icon: <Award className="w-6 h-6" />,
                                title: "Excellence",
                                desc: "We maintain the highest standards in our documentation and visa application support."
                            },
                            {
                                icon: <Globe className="w-6 h-6" />,
                                title: "Integrity",
                                desc: "Transparent processes with no hidden fees or false promises about admission guarantees."
                            }
                        ].map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-6"
                            >
                                <div className="w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center text-accent mb-6 shadow-lg">
                                    {val.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                                <p className="text-muted-foreground text-sm">{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
