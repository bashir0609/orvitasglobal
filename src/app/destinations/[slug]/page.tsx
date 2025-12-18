import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, School, BookOpen, Plane } from "lucide-react";

// Mock Data - In a real app, this would come from a CMS or API
const destinations = {
    uk: {
        name: "United Kingdom",
        title: "Study in the UK",
        heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop",
        description: "Home to some of the world's oldest and most prestigious universities. The UK offers a diverse, multicultural environment and world-class education.",
        features: [
            "Access to world-renowned research",
            "Short duration courses (1-year Master's)",
            "Post-study work visa (Graduate Route)",
            "Historic cultural experience",
        ],
        stats: {
            universities: "160+",
            students: "500k+",
            ranking: "Top 10 Globally"
        }
    },
    canada: {
        name: "Canada",
        title: "Study in Canada",
        heroImage: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1000&auto=format&fit=crop",
        description: "Known for its high academic standards and strict quality controls, Canada offers a high-quality education that will open doors for your future.",
        features: [
            "Affordable tuition compared to US/UK",
            "Pathways to Permanent Residency",
            "Work while studying",
            "Safe and inclusive society",
        ],
        stats: {
            universities: "90+",
            students: "600k+",
            ranking: "High Quality of Life"
        }
    },
    australia: {
        name: "Australia",
        title: "Study in Australia",
        heroImage: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop",
        description: "Australia attracts the third-largest number of international students in the English-speaking world. It offers practical learning and diverse culture.",
        features: [
            " globally recognized qualifications",
            "Excellent lifestyle and weather",
            "Post-study work rights (up to 4 years)",
            "Strong research infrastructure",
        ],
        stats: {
            universities: "43",
            students: "700k+",
            ranking: "Top Research"
        }
    },
    europe: {
        name: "Europe",
        title: "Study in Europe",
        heroImage: "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?q=80&w=1000&auto=format&fit=crop",
        description: "Experience the diversity of Europe. From Germany to France, access low-cost or free tuition opportunities in top public universities.",
        features: [
            "Low to zero tuition fees in many countries",
            "Schengen visa travel opportunities",
            "Programs available in English",
            "Rich history and culture",
        ],
        stats: {
            universities: "1000+",
            students: "1M+",
            ranking: "Diverse Options"
        }
    },
};

export function generateStaticParams() {
    return Object.keys(destinations).map((slug) => ({
        slug,
    }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function DestinationPage({ params }: PageProps) {
    const { slug } = await params;
    const country = destinations[slug as keyof typeof destinations];

    if (!country) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${country.heroImage}')` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading text-white mb-4">
                        {country.title}
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl">
                        {country.description}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold font-heading mb-6 flex items-center">
                                <BookOpen className="mr-3 text-accent" /> Why {country.name}?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {country.features.map((feature, i) => (
                                    <div key={i} className="flex items-start space-x-3 p-4 rounded-xl bg-secondary/50 border border-white/5">
                                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold font-heading mb-6 flex items-center">
                                <School className="mr-3 text-accent" /> Top Universities
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                We have partnerships with leading institutions across {country.name}.
                                Get in touch to find the perfect match for your academic profile.
                            </p>
                            <div className="p-6 bg-accent/10 border border-accent/20 rounded-xl">
                                <p className="font-semibold text-accent">
                                    Contact our counselors for a full list of universities.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-secondary border border-white/5 shadow-lg top-24 sticky">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Key Facts</h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Universities</span>
                                    <span className="font-bold text-foreground">{country.stats.universities}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Int'l Students</span>
                                    <span className="font-bold text-foreground">{country.stats.students}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Global Rank</span>
                                    <span className="font-bold text-accent">{country.stats.ranking}</span>
                                </div>
                            </div>

                            <Link
                                href={`/contact?destination=${slug}`}
                                className="w-full mt-8 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg transform hover:-translate-y-1 block text-center"
                            >
                                Apply Now
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
