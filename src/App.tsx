import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { BrandingProvider } from "@/hooks/useBranding";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import PortfolioManagement from "./pages/admin/PortfolioManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import SEOSettings from "./pages/admin/SEOSettings";
import ChatbotConfig from "./pages/admin/ChatbotConfig";
import BrandingSettings from "./pages/admin/BrandingSettings";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrandingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/blog" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />
              <Route path="/admin/portfolio" element={<ProtectedRoute><PortfolioManagement /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute><TestimonialsManagement /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute><MessagesManagement /></ProtectedRoute>} />
              <Route path="/admin/seo" element={<ProtectedRoute><SEOSettings /></ProtectedRoute>} />
              <Route path="/admin/chatbot" element={<ProtectedRoute><ChatbotConfig /></ProtectedRoute>} />
              <Route path="/admin/branding" element={<ProtectedRoute><BrandingSettings /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BrandingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
