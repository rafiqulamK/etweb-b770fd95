import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Code2, Brain, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceTags = [
  { icon: Code2, label: "Software Development" },
  { icon: Brain, label: "AI Solutions" },
  { icon: Settings, label: "IT Consulting" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <>
      {count}{suffix}
    </>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden pt-4 sm:pt-0">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-gradient-glow opacity-50" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Animated particles - hidden on small screens for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-accent/40 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-accent/30 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/50 border border-border/50 mb-6 sm:mb-8 animate-fade-in backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Innovating Tomorrow, Today
            </span>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in leading-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Transform Your Business{" "}
            <br className="hidden sm:block" />
            with <span className="text-gradient">Cutting-Edge</span>
            <br className="hidden sm:block" />
            Technology
          </h1>

          {/* Subheading */}
          <p 
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in px-2"
            style={{ animationDelay: "0.2s" }}
          >
            We deliver innovative software solutions, AI-powered systems, and expert IT consulting to help businesses thrive in the digital age.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 animate-fade-in px-4"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="gap-2 shadow-primary w-full sm:w-auto">
                Start Your Project
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/services" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto border-primary/30 hover:bg-primary/10">
                Explore Services
              </Button>
            </Link>
          </div>

          {/* Service Tags */}
          <div 
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {serviceTags.map((tag, index) => (
              <div 
                key={index} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-primary/20 backdrop-blur-sm hover:border-primary/40 transition-colors"
              >
                <tag.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground/80">{tag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
