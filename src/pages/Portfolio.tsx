import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  client_name: string | null;
  technologies: string[] | null;
  featured_image: string | null;
  results: string | null;
}

export default function Portfolio() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    }

    fetchItems();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Case Studies & <span className="text-gradient">Success Stories</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our completed projects and see how we've helped businesses 
              transform through innovative technology solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <p className="text-muted-foreground mb-4">
                Portfolio coming soon! We're documenting our amazing projects.
              </p>
              <Link to="/contact">
                <Button variant="outline">Discuss Your Project</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-gradient-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all group"
                >
                  {item.featured_image ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.featured_image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gradient">e</span>
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    {item.client_name && (
                      <span className="text-primary text-sm font-medium mb-2 block">
                        {item.client_name}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-secondary text-xs text-muted-foreground rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.results && (
                      <div className="p-4 bg-secondary/50 rounded-xl mb-4">
                        <p className="text-sm text-foreground">
                          <span className="font-medium text-primary">Results:</span> {item.results}
                        </p>
                      </div>
                    )}
                    <Link
                      to={`/portfolio/${item.slug}`}
                      className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                    >
                      View Case Study
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-3xl border border-border/50 p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can help bring your vision to life with our expertise.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="gap-2">
                Start Your Project
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
