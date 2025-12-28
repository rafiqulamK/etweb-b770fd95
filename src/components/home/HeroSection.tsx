import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 30, suffix: "+", label: "Happy Clients" },
  { value: 8, suffix: "+", label: "Years Experience" },
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
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary border border-border mb-6 sm:mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Trusted by 30+ businesses worldwide
            </span>
          </div>

          {/* Main Heading */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 animate-fade-in leading-tight"
            style={{ animationDelay: "0.1s" }}
          >
            Enterprise Tech Solutions{" "}
            <span className="text-gradient">for the Future</span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in px-2"
            style={{ animationDelay: "0.2s" }}
          >
            We deliver cutting-edge software solutions that transform businesses. 
            From HRM to AI integration, we build technology that drives growth.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 animate-fade-in px-4"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="gradient" size="lg" className="gap-2 shadow-primary w-full sm:w-auto">
                Start Your Project
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/portfolio" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Play size={18} />
                View Our Work
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 group-hover:text-foreground transition-colors">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
