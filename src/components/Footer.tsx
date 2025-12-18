import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold font-heading bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            OrvitasGlobal
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Empowering students to achieve their global education dreams.
                            OrvitasGlobal provides expert consultancy for studying in top
                            destinations worldwide.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-accent transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-accent transition">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-accent transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-accent transition">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-accent text-sm transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#destinations" className="text-muted-foreground hover:text-accent text-sm transition">
                                    Destinations
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-accent text-sm transition">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-accent text-sm transition">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Destinations */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Destinations</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/destinations/uk" className="text-muted-foreground hover:text-accent text-sm transition">
                                    Study in UK
                                </Link>
                            </li>
                            <li>
                                <Link href="/destinations/canada" className="text-muted-foreground hover:text-accent text-sm transition">
                                    Study in Canada
                                </Link>
                            </li>
                            <li>
                                <Link href="/destinations/australia" className="text-muted-foreground hover:text-accent text-sm transition">
                                    Study in Australia
                                </Link>
                            </li>
                            <li>
                                <Link href="/destinations/europe" className="text-muted-foreground hover:text-accent text-sm transition">
                                    Study in Europe
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                                <span>123 Education Street, Consultancy Hub, London, UK</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                                <Phone size={18} className="text-accent flex-shrink-0" />
                                <span>+44 123 456 7890</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                                <Mail size={18} className="text-accent flex-shrink-0" />
                                <span>info@orvitasglobal.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} OrvitasGlobal. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-xs text-muted-foreground">
                        <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
