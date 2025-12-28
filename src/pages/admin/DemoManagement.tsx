import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface DemoProject {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
  demo_url: string | null;
  thumbnail: string | null;
  technologies: string[] | null;
  is_featured: boolean;
  status: string;
  created_at: string;
}

const defaultFormData = {
  title: "",
  description: "",
  project_type: "website",
  demo_url: "",
  thumbnail: "",
  technologies: "",
  is_featured: false,
  status: "draft",
};

export default function DemoManagement() {
  const [projects, setProjects] = useState<DemoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DemoProject | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("demo_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const projectData = {
      title: formData.title,
      description: formData.description || null,
      project_type: formData.project_type,
      demo_url: formData.demo_url || null,
      thumbnail: formData.thumbnail || null,
      technologies: formData.technologies ? formData.technologies.split(",").map(t => t.trim()).filter(Boolean) : [],
      is_featured: formData.is_featured,
      status: formData.status,
    };

    let error;
    if (editingProject) {
      const { error: updateError } = await supabase
        .from("demo_projects")
        .update(projectData)
        .eq("id", editingProject.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("demo_projects")
        .insert([projectData]);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Demo project ${editingProject ? "updated" : "created"} successfully` });
      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    }
    setSaving(false);
  };

  const handleEdit = (project: DemoProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      project_type: project.project_type,
      demo_url: project.demo_url || "",
      thumbnail: project.thumbnail || "",
      technologies: project.technologies?.join(", ") || "",
      is_featured: project.is_featured,
      status: project.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this demo project?")) return;

    const { error } = await supabase.from("demo_projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Demo project deleted successfully" });
      fetchProjects();
    }
  };

  const toggleStatus = async (project: DemoProject) => {
    const newStatus = project.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("demo_projects")
      .update({ status: newStatus })
      .eq("id", project.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Project ${newStatus === "published" ? "published" : "unpublished"}` });
      fetchProjects();
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingProject(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Demo Projects</h1>
            <p className="text-muted-foreground">Manage your live demos and showcases</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="gradient" className="gap-2">
                <Plus size={18} />
                Add Demo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Edit Demo Project" : "Add New Demo Project"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-secondary border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Project Type</label>
                    <Select
                      value={formData.project_type}
                      onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="app">Mobile App</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Demo URL</label>
                  <Input
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="bg-secondary border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Thumbnail</label>
                  <ImageUpload
                    value={formData.thumbnail}
                    onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                    folder="demo-projects"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Technologies (comma separated)</label>
                  <Input
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-foreground">
                    Featured Project
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" variant="gradient" disabled={saving} className="flex-1">
                    {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-gradient-card rounded-2xl border border-border/50">
            <p className="text-muted-foreground mb-4">No demo projects yet. Add your first demo!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-gradient-card rounded-xl border border-border/50 p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                {project.thumbnail && (
                  <div className="w-full sm:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-semibold text-foreground truncate">{project.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          project.status === "published" 
                            ? "bg-primary/20 text-primary" 
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {project.status}
                        </span>
                        {project.is_featured && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent-foreground">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize mb-2">{project.project_type}</p>
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(project)} title={project.status === "published" ? "Unpublish" : "Publish"}>
                    {project.status === "published" ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                    <Edit size={18} />
                  </Button>
                  {project.demo_url && (
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <ExternalLink size={18} />
                      </Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-destructive hover:text-destructive">
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
