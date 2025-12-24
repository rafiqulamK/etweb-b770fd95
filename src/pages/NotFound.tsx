import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout showChatbot={false}>
      <section className="py-20 md:py-32 relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Display */}
            <div className="mb-8">
              <span className="text-8xl md:text-9xl font-bold text-gradient">404</span>
            </div>
            
            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Page Not Found
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
              <br />
              <span className="text-sm opacity-75">
                Attempted path: <code className="bg-secondary px-2 py-1 rounded">{location.pathname}</code>
              </span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/">
                <Button variant="gradient" size="lg" className="gap-2 w-full sm:w-auto">
                  <Home size={18} />
                  Go to Homepage
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={18} />
                Go Back
              </Button>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Maybe you were looking for:
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/" className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-secondary/80 transition-colors">
                  Home
                </Link>
                <Link to="/services" className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-secondary/80 transition-colors">
                  Services
                </Link>
                <Link to="/portfolio" className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-secondary/80 transition-colors">
                  Portfolio
                </Link>
                <Link to="/blog" className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-secondary/80 transition-colors">
                  Blog
                </Link>
                <Link to="/about" className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-secondary/80 transition-colors">
                  About Us
                </Link>
                <Link to="/contact" className="px-4 py-2 bg-secondary rounded-lg text-sm text-foreground hover:bg-secondary/80 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
