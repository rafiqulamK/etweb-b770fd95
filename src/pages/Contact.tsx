import { Layout } from "@/components/layout/Layout";
import { ContactSection } from "@/components/home/ContactSection";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

const contactDetails = [
  { icon: MapPin, title: "Visit Us", value: "Dhaka, Bangladesh" },
  { icon: Clock, title: "Business Hours", value: "Sun - Thu: 9AM - 6PM" },
  { icon: Phone, title: "Call Us", value: "+880 1234-567890" },
  { icon: Mail, title: "Email Us", value: "info@engineerstechbd.com" },
];

export default function Contact() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Let's Start a <span className="text-gradient">Conversation</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a project in mind? We'd love to hear from you. Get in touch and 
              let's create something amazing together.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Details Grid */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {contactDetails.map((detail, index) => (
              <div 
                key={index}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 text-center hover:border-primary/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto mb-3">
                  <detail.icon size={20} className="text-primary-foreground" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">{detail.title}</h3>
                <p className="text-xs text-muted-foreground">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </Layout>
  );
}
