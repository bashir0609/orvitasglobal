"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps {
    name: string;
    description: string;
    image: string;
    link: string;
    delay?: number;
}

export default function DestinationCard({
    name,
    description,
    image,
    link,
    delay = 0,
}: DestinationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="group relative h-[400px] w-full overflow-hidden rounded-2xl bg-secondary"
        >
            {/* Background Image Placeholder since we don't have real images yet */}
            {/* In production, use next/image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${image}')`, backgroundColor: '#1e293b' }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold font-heading">{name}</h3>
                <p className="mb-4 text-sm text-gray-300 line-clamp-2">
                    {description}
                </p>
                <Link
                    href={link}
                    className="inline-flex items-center text-sm font-semibold text-accent hover:text-yellow-300 transition-colors"
                >
                    Explore Opportunities <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </motion.div>
    );
}
