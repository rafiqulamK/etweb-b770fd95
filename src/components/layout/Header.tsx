import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBranding } from "@/hooks/useBranding";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { branding } = useBranding();

  const logoText = branding?.logo_text || "engineersTech";
  const logoUrl = branding?.logo_url;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={logoText} className="w-10 h-10 rounded-lg object-contain" />
            ) : (
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">e</span>
              </div>
            )}
            <span className="text-xl font-bold text-foreground">
              {logoText.includes("Tech") ? (
                <>
                  {logoText.replace("Tech", "")}<span className="text-gradient">Tech</span>
                </>
              ) : (
                logoText
              )}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="gradient" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "text-base font-medium transition-colors hover:text-primary py-2",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Admin Login
                  </Button>
                </Link>
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button variant="gradient" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
