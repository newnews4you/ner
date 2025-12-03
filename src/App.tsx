import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// GitHub Pages routing handler
const GitHubPagesRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle GitHub Pages 404.html redirect
    // Format: /?/path/to/page&queryParam1=value1&queryParam2=value2
    // The 404.html script converts & to ~and~ in both path and query, then adds & as separator
    if (location.search.startsWith('?/')) {
      const searchContent = location.search.slice(2); // Remove '?/'
      
      // Find the separator: first & that's not part of ~and~
      // The separator is a standalone & added by 404.html between path and query
      // Since all & in path and query are encoded as ~and~, any literal & is the separator
      const separatorIndex = searchContent.indexOf('&');
      
      let pathPart = '';
      let queryPart = '';
      
      if (separatorIndex >= 0) {
        // Split at the separator
        pathPart = searchContent.substring(0, separatorIndex);
        queryPart = searchContent.substring(separatorIndex + 1);
      } else {
        // No query parameters, entire content is the path
        pathPart = searchContent;
      }
      
      // Decode ~and~ to & in both parts
      const path = pathPart.replace(/~and~/g, '&');
      
      // Reconstruct query string if there are query params
      let queryString = '';
      if (queryPart) {
        const decodedQuery = queryPart.replace(/~and~/g, '&');
        // Split query params (preserving valueless params)
        const queryParams = decodedQuery.split('&').filter(p => p.length > 0);
        if (queryParams.length > 0) {
          queryString = '?' + queryParams.join('&');
        }
      }
      
      // Navigate with proper path and query string
      navigate(path + queryString + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/ner">
        <GitHubPagesRedirect />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
