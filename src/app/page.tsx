import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import DestinationCard from "@/components/DestinationCard";

export default function Home() {
  const destinations = [
    {
      name: "United Kingdom",
      description: "World-class education and rich cultural heritage. Experience academic excellence in the UK.",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop", // London Big Ben
      link: "/destinations/uk",
    },
    {
      name: "Canada",
      description: "Top-ranked universities and welcoming communities with post-study work opportunities.",
      image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1000&auto=format&fit=crop", // Toronto CN Tower
      link: "/destinations/canada",
    },
    {
      name: "Australia",
      description: "Innovative education system, vibrant cities, and incredible lifestyle for international students.",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop", // Sydney Opera House (Reliable)
      link: "/destinations/australia",
    },
    {
      name: "Europe",
      description: "Diverse study options across Schengen countries with affordable tuition and rich history.",
      image: "https://images.unsplash.com/photo-1473951574080-01fe45ec8643?q=80&w=1000&auto=format&fit=crop", // Prague / Europe General (Reliable)
      link: "/destinations/europe",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
      <Navbar />
      <Hero />

      {/* Destinations Section */}
      <section id="destinations" className="py-24 relative">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              Explore Top <span className="text-accent">Destinations</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We guide you to the best universities in the world's most sought-after study destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <DestinationCard
                key={dest.name}
                {...dest}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                Why Choose <br />
                <span className="text-blue-500">OrvitasGlobal?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We don't just process applications; we build careers. Our expert counselors provide end-to-end guidance, from university selection to visa approval and accommodation.
              </p>

              <ul className="space-y-4">
                {[
                  "98% Visa Success Rate",
                  "Expert Career Counseling",
                  "Scholarship Assistance",
                  "Pre-departure Support"
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <span className="font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="relative bg-secondary p-8 rounded-3xl border border-white/10 shadow-2xl">
                {/* Abstract Visual Representation of Process */}
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                    <div className="ml-4">
                      <h4 className="font-bold">Consultation</h4>
                      <p className="text-sm text-muted-foreground">Profile evaluation & career path</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">2</div>
                    <div className="ml-4">
                      <h4 className="font-bold">Application</h4>
                      <p className="text-sm text-muted-foreground">Documentation & submission</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">3</div>
                    <div className="ml-4">
                      <h4 className="font-bold">Visa & Departure</h4>
                      <p className="text-sm text-muted-foreground">Interview prep & flight</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
