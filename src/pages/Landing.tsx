import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Brain, Target, TrendingUp, Clock, BookOpen, Zap, ArrowRight, CheckCircle2, Star, LogIn } from "lucide-react";
import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();



  const handleStartClick = (e: React.MouseEvent) => {
    if (config.authEnabled && !isAuthenticated) {
      e.preventDefault();
      setShowLogin(true);
    }
    // Otherwise let the Link work or navigate programmatically
  };

  const features = [
    {
      icon: Brain,
      title: "AI Korepetitorius",
      description: "Asmeninis AI asistentas, kuris padės jums mokytis bet kuriuo metu",
      gradient: "gradient-purple-pink",
    },
    {
      icon: Target,
      title: "Personalizuotas mokymasis",
      description: "AI pritaiko mokymosi planą pagal jūsų silpnas sritis ir progresą",
      gradient: "gradient-cyan-blue",
    },
    {
      icon: TrendingUp,
      title: "Progreso sekimas",
      description: "Vizualiai sekite savo mokymosi progresą su grafikais ir statistikomis",
      gradient: "gradient-green-teal",
    },
    {
      icon: Clock,
      title: "Pomodoro Timer",
      description: "Fokusuokitės su mokymosi timer'iu ir pertraukomis",
      gradient: "gradient-orange-red",
    },
    {
      icon: BookOpen,
      title: "Daugiadalykis mokymasis",
      description: "Mokykitės matematikos, fizikos, IT ir kitų dalykų vienoje vietoje",
      gradient: "gradient-indigo-purple",
    },
    {
      icon: Zap,
      title: "Gamifikacija",
      description: "Uždirbkite achievement'us, sekite streak'us ir varžykitės su kitais",
      gradient: "gradient-purple-pink",
    },
  ];

  const benefits = [
    "Personalizuotas mokymosi kelias",
    "AI-powered rekomendacijos",
    "Progreso analitika",
    "Mokymosi disciplina",
    "Notion-style užrašai",
    "Pomodoro timer",
  ];

  return (
    <div className="min-h-screen synthwave-bg">
      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-purple-pink flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Mano AI</span>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Prisijungti
              </button>
            )}

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
              >
                <span>{user?.name || 'Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                onClick={handleStartClick}
                className="px-4 py-2 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg"
              >
                Pradėti
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">AI-powered mokymosi platforma</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Mokykitės efektyviau su
            <span className="text-gradient-purple block mt-2">AI Korepetitoriumi</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Personalizuota mokymosi platforma, kuri padeda moksleiviams pasiekti geresnius rezultatus
            per AI rekomendacijas, gamifikaciją ir produktyvumo įrankius.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/dashboard"
              onClick={handleStartClick}
              className="px-8 py-4 rounded-xl gradient-purple-pink text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:scale-105 flex items-center gap-2 text-lg"
            >
              Pradėti nemokamai
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-secondary/50 border border-white/10 text-foreground font-semibold hover:bg-secondary/70 transition-all flex items-center gap-2 text-lg">
              Sužinoti daugiau
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">1000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Moksleivių</div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">50K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Užduočių</div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Pasitenkinimas</div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">AI pagalba</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Kodėl pasirinkti Mano AI?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visapusiška mokymosi platforma su AI funkcijomis, skirta efektyviam mokymuisi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${feature.gradient} w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="glass rounded-2xl p-8 sm:p-12 border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  Viskas, ko reikia efektyviam mokymuisi
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Mūsų platforma sujungia AI technologijas, gamifikaciją ir produktyvumo įrankius,
                  kad padėtų jums pasiekti geriausius rezultatus.
                </p>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-6 border border-white/10">
                  <div className="w-10 h-10 rounded-lg gradient-purple-pink flex items-center justify-center mb-3">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">AI</div>
                  <div className="text-sm text-muted-foreground">Korepetitorius</div>
                </div>
                <div className="glass rounded-xl p-6 border border-white/10">
                  <div className="w-10 h-10 rounded-lg gradient-cyan-blue flex items-center justify-center mb-3">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Personalizacija</div>
                </div>
                <div className="glass rounded-xl p-6 border border-white/10">
                  <div className="w-10 h-10 rounded-lg gradient-green-teal flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">Prieiga</div>
                </div>
                <div className="glass rounded-xl p-6 border border-white/10">
                  <div className="w-10 h-10 rounded-lg gradient-orange-red flex items-center justify-center mb-3">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">5★</div>
                  <div className="text-sm text-muted-foreground">Įvertinimas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="glass rounded-2xl p-8 sm:p-12 border-2 border-primary/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Pradėkite mokytis šiandien
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Prisijunkite prie tūkstančių moksleivių, kurie jau naudoja Mano AI platformą
            </p>
            <Link
              to="/dashboard"
              onClick={handleStartClick}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-purple-pink text-white font-semibold hover:opacity-90 transition-all shadow-lg hover:scale-105 text-lg"
            >
              Pradėti nemokamai
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-purple-pink flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground">Mano AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <span>© 2024 Mano AI</span>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

export default Landing;

