import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactContent from "@/components/ContactContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with OrvitasGlobal for personalized study abroad consultation. Start your journey to UK, Canada, Australia, or Europe today.",
    openGraph: {
        title: "Contact Us | OrvitasGlobal",
        description: "Start Your Global Journey. Expert counseling for international education.",
    },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <ContactContent />
            <Footer />
        </div>
    );
}
