import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about OrvitasGlobal's mission to connect ambitious students with world-class education opportunities across the globe.",
    openGraph: {
        title: "About Us | OrvitasGlobal",
        description: "Empowering Global Ambitions. Trusted guidance for studying in UK, Canada, Australia, and Europe.",
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <AboutContent />
            <Footer />
        </div>
    );
}
