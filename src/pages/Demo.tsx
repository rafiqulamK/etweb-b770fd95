import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ExternalLink, Monitor, Smartphone, Code2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface DemoProject {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
  demo_url: string | null;
  thumbnail: string | null;
  technologies: string[] | null;
  is_featured: boolean;
}

const typeIcons: Record<string, typeof Monitor> = {
  website: Monitor,
  app: Smartphone,
  software: Code2,
};

const typeLabels: Record<string, string> = {
  website: "Website",
  app: "Mobile App",
  software: "Software",
};

export default function Demo() {
  const [projects, setProjects] = useState<DemoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("demo_projects")
        .select("id, title, description, project_type, demo_url, thumbnail, technologies, is_featured")
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.project_type === filter);

  const projectTypes = ["all", ...new Set(projects.map(p => p.project_type))];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-glow opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary text-sm font-medium tracking-wider uppercase mb-4 block">
              Live Demos
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              Experience Our <span className="text-gradient">Work in Action</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-2">
              Explore live demos of our apps, websites, and software solutions. 
              See the quality and functionality we deliver firsthand.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Projects */}
      <section className="py-12 sm:py-16 md:py-20 bg-card">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          {projects.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
              <Filter size={18} className="text-muted-foreground hidden sm:block" />
              {projectTypes.map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type)}
                  className="capitalize text-xs sm:text-sm"
                >
                  {type === "all" ? "All Projects" : typeLabels[type] || type}
                </Button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading demos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                <Monitor size={40} className="text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Demos Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                We're preparing live demos of our projects. Check back soon or contact us for a personalized demo.
              </p>
              <Link to="/contact">
                <Button variant="gradient">Request a Demo</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredProjects.map((project) => {
                const TypeIcon = typeIcons[project.project_type] || Monitor;
                return (
                  <article
                    key={project.id}
                    className={`bg-gradient-card rounded-2xl border overflow-hidden hover:border-primary/50 transition-all group ${
                      project.is_featured ? "border-primary/30" : "border-border/50"
                    }`}
                  >
                    {project.thumbnail ? (
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.is_featured && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                        <TypeIcon size={48} className="text-primary/50" />
                        {project.is_featured && (
                          <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                          <TypeIcon size={16} className="text-primary" />
                        </div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {typeLabels[project.project_type] || project.project_type}
                        </span>
                      </div>
                      
                      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                      </h2>
                      
                      {project.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies.slice(0, 4).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-secondary text-xs text-muted-foreground rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-0.5 bg-secondary text-xs text-muted-foreground rounded-full">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {project.demo_url ? (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-sm"
                        >
                          View Live Demo
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">Demo coming soon</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card rounded-2xl sm:rounded-3xl border border-border/50 p-6 sm:p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Want a Custom Demo?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              Schedule a personalized demonstration tailored to your specific requirements.
            </p>
            <Link to="/contact">
              <Button variant="gradient" size="lg" className="gap-2">
                Schedule Demo
                <ExternalLink size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
