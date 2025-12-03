import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen synthwave-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="glass rounded-2xl p-8 sm:p-12 border-2 border-primary/30 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
          
          <div className="relative z-10">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-orange-red flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>

            {/* 404 Text */}
            <h1 className="text-6xl sm:text-7xl font-bold text-gradient-purple mb-4 animate-glow">
              404
            </h1>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              Puslapis nerastas
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground mb-8">
              Atsiprašome, bet puslapis, kurį ieškote, neegzistuoja arba buvo perkeltas.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg hover:scale-105"
              >
                <Home className="w-4 h-4" />
                Grįžti į pagrindinį
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-medium hover:bg-secondary/70 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Atgal
              </button>
            </div>

            {/* Debug info (only in dev) */}
            {import.meta.env.DEV && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-muted-foreground mb-2">Debug info:</p>
                <code className="text-xs text-muted-foreground break-all">
                  {location.pathname}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
