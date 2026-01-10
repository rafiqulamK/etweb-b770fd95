import { useState, useEffect } from "react";
import { X, ExternalLink, MessageCircle, Monitor, Tablet, Smartphone, Key, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useBranding } from "@/hooks/useBranding";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AccessCredentials {
  access_username: string | null;
  access_password: string | null;
  access_code: string | null;
  access_notes: string | null;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  projectId?: string;
  onConsultation?: () => void;
}

type DeviceType = "desktop" | "tablet" | "mobile";

const deviceSizes: Record<DeviceType, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet" },
  mobile: { width: "375px", label: "Mobile" },
};

export function PreviewModal({
  isOpen,
  onClose,
  url,
  title,
  projectId,
  onConsultation,
}: PreviewModalProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [credentials, setCredentials] = useState<AccessCredentials | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { branding } = useBranding();
  const { isAdmin } = useAuth();

  const whatsappNumber = branding?.whatsapp_number || "+8801873722228";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${cleanNumber}?text=Hi! I'm interested in a project similar to "${title}". Can we discuss?`;

  // Credentials are now stored in a protected table and only visible to admins.
  useEffect(() => {
    if (!isAdmin) {
      setCredentials(null);
      setShowCredentials(false);
      return;
    }
    if (projectId && isOpen) {
      void fetchCredentials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, isOpen, isAdmin]);

  const fetchCredentials = async () => {
    if (!projectId) return;

    const { data } = await supabase
      .from("demo_project_credentials")
      .select("access_username, access_password, access_code, access_notes")
      .eq("project_id", projectId)
      .maybeSingle();

    if (data && (data.access_username || data.access_password || data.access_code || data.access_notes)) {
      setCredentials(data);
      setShowCredentials(true);
    } else {
      setCredentials(null);
      setShowCredentials(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hasCredentials = !!credentials;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[98vw] sm:max-w-[95vw] w-full h-[95vh] sm:h-[90vh] p-0 gap-0 bg-background">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-border bg-muted/30 gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{title}</h3>
            
            {/* Device Switcher */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-background rounded-lg p-0.5 sm:p-1">
              {(["desktop", "tablet", "mobile"] as DeviceType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={cn(
                    "p-1.5 sm:p-2 rounded transition-colors",
                    device === d
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={deviceSizes[d].label}
                >
                  {d === "desktop" && <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  {d === "tablet" && <Tablet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  {d === "mobile" && <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              ))}
            </div>

            {/* Show Credentials Toggle - only for admins */}
            {hasCredentials && (
              <Button
                size="sm"
                variant={showCredentials ? "default" : "outline"}
                onClick={() => setShowCredentials(!showCredentials)}
                className="gap-1.5 sm:gap-2 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 hidden sm:flex"
              >
                <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                {showCredentials ? "Hide" : "Show"} Credentials
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={onConsultation}
              className="gap-1 sm:gap-2 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 hidden sm:flex"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Get Free Consultation</span>
              <span className="md:hidden">Quote</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.open(whatsappLink, "_blank")}
              className="gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(url, "_blank")}
              className="gap-1 sm:gap-2 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Open</span>
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose} className="h-7 w-7 sm:h-8 sm:w-8">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Credentials Banner */}
        {hasCredentials && showCredentials && (
          <div className="px-3 sm:px-4 py-2 sm:py-3 bg-primary/10 border-b border-primary/20">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="font-semibold text-primary flex items-center gap-1.5 sm:gap-2">
                <Key className="w-3 h-3 sm:w-4 sm:h-4" />
                Demo Credentials:
              </span>
              {credentials.access_username && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-background/80 rounded px-2 sm:px-3 py-0.5 sm:py-1">
                  <span className="text-muted-foreground">Username:</span>
                  <code className="font-mono text-foreground text-xs sm:text-sm">{credentials.access_username}</code>
                  <button
                    onClick={() => copyToClipboard(credentials.access_username!, 'username')}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {copiedField === 'username' ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
              {credentials.access_password && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-background/80 rounded px-2 sm:px-3 py-0.5 sm:py-1">
                  <span className="text-muted-foreground">Password:</span>
                  <code className="font-mono text-foreground text-xs sm:text-sm">{credentials.access_password}</code>
                  <button
                    onClick={() => copyToClipboard(credentials.access_password!, 'password')}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {copiedField === 'password' ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
              {credentials.access_code && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-background/80 rounded px-2 sm:px-3 py-0.5 sm:py-1">
                  <span className="text-muted-foreground">Code:</span>
                  <code className="font-mono text-foreground text-xs sm:text-sm">{credentials.access_code}</code>
                  <button
                    onClick={() => copyToClipboard(credentials.access_code!, 'code')}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {copiedField === 'code' ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
              {credentials.access_notes && (
                <span className="text-muted-foreground italic text-xs">{credentials.access_notes}</span>
              )}
            </div>
          </div>
        )}

        {/* Browser Chrome */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          <div className="bg-muted/50 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3 border-b border-border">
            <div className="flex gap-1 sm:gap-1.5">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/70" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 max-w-xl bg-background rounded px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-muted-foreground truncate">
              {url}
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 flex items-start justify-center overflow-auto p-2 sm:p-4">
            <div
              className={cn(
                "bg-background rounded-lg shadow-xl overflow-hidden transition-all duration-300 h-full",
                device !== "desktop" && "border border-border"
              )}
              style={{ width: deviceSizes[device].width, maxWidth: "100%" }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                </div>
              )}
              <iframe
                src={url}
                title={title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
