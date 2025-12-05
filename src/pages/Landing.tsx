import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Brain, Target, TrendingUp, Clock, BookOpen, Zap, ArrowRight, CheckCircle2, Star, LogIn, BarChart3, Shield, Users } from "lucide-react";
import { useState } from "react";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import { useAuth } from "@/contexts/AuthContext";
import config from "@/config";

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
  };

  const features = [
    {
      icon: Brain,
      title: "AI Korepetitorius",
      description: "Asmeninis AI asistentas, kuris padės jums mokytis bet kuriuo metu",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Target,
      title: "Personalizuotas planas",
      description: "AI pritaiko mokymosi planą pagal jūsų silpnas sritis",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      title: "Progreso sekimas",
      description: "Vizualiai sekite savo mokymosi progresą su grafikais",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Clock,
      title: "Pomodoro Timer",
      description: "Fokusuokitės su mokymosi timer'iu ir pertraukomis",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      icon: BookOpen,
      title: "Daugiadalykis",
      description: "Matematika, fizika, IT ir kiti dalykai vienoje vietoje",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      icon: Zap,
      title: "Gamifikacija",
      description: "Uždirbkite achievement'us ir sekite streak'us",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">Mano AI</span>
            </div>

            <div className="flex items-center gap-4">
              {!isAuthenticated && (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Prisijungti
                </button>
              )}

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span>{user?.name || 'Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  onClick={handleStartClick}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Pradėti
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-8">
                <Sparkles className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">AI Mokymosi Platforma</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-[1.1]">
                Mokysitės <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                  efektyviau
                </span>
              </h1>

              <p className="text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
                Personalizuota platforma, kuri sujungia AI intelektą su jūsų mokymosi tikslais.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  onClick={handleStartClick}
                  className="px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
                >
                  Pradėti nemokamai
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all hover:border-gray-300 flex items-center justify-center gap-2 text-lg"
                >
                  Sužinoti daugiau
                </button>
              </div>
            </div>

            {/* Right Content - Abstract Illustration & Phone Mockup */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Abstract Background Shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-full blur-3xl animate-pulse" />

              {/* Phone Mockup */}
              <div className="relative z-10 w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-8 border-gray-900 rotate-[-6deg] hover:rotate-0 transition-all duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20" />

                {/* Screen Content */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col">
                  {/* Mockup Header */}
                  <div className="p-6 pt-12 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="w-20 h-4 bg-gray-200 rounded-full" />
                    </div>
                    <div className="w-32 h-8 bg-gray-900 rounded-lg mb-2" />
                    <div className="w-24 h-4 bg-gray-200 rounded-full" />
                  </div>

                  {/* Mockup Chat/Content */}
                  <div className="flex-1 p-6 space-y-4 bg-white">
                    {/* AI Message */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 text-xs text-gray-600">
                        Sveiki! Šiandien rekomenduoju pakartoti matematiką.
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-gray-900 shrink-0" />
                      <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none p-3 text-xs">
                        Gerai, pradėkime nuo lygčių.
                      </div>
                    </div>

                    {/* Stats Card in Mockup */}
                    <div className="mt-4 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-900">Progresas</span>
                        <span className="text-xs text-green-600 font-medium">+12%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[75%]" />
                      </div>
                    </div>
                  </div>

                  {/* Mockup Bottom Nav */}
                  <div className="p-4 border-t border-gray-100 flex justify-around">
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                    <div className="w-6 h-6 rounded-full bg-gray-900" />
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-20 -right-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Užduotis atlikta</div>
                    <div className="text-xs text-gray-500">+50 taškų</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-40 -left-8 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">AI Analizė</div>
                    <div className="text-xs text-gray-500">Rekomendacija paruošta</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Interactive Cards */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Aktyvūs</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">1,000+</div>
              <p className="text-sm text-gray-500 font-medium">Moksleivių bendruomenė</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Turinys</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">50K+</div>
              <p className="text-sm text-gray-500 font-medium">Užduočių ir testų</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Kokybė</span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-3xl font-bold text-gray-900 tracking-tight">95%</div>
                <div className="mb-1.5 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[95%]" />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium">Teigiamų įvertinimų</p>
            </div>

            <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Greitis</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">24/7</div>
              <p className="text-sm text-gray-500 font-medium">AI asistento pagalba</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Kodėl pasirinkti Mano AI?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Visapusiška mokymosi platforma su AI funkcijomis, sukurta jūsų sėkmei
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">
              Pradėkite mokytis efektyviau šiandien
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
              Prisijunkite prie tūkstančių moksleivių, kurie jau naudoja Mano AI platformą geresniems rezultatams pasiekti.
            </p>
            <Link
              to="/dashboard"
              onClick={handleStartClick}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
            >
              Pradėti nemokamai
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">Mano AI</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
              <Link to="/dashboard" className="hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link to="#" className="hover:text-gray-900 transition-colors">
                Apie mus
              </Link>
              <Link to="#" className="hover:text-gray-900 transition-colors">
                Kontaktai
              </Link>
              <span>© 2024 Mano AI</span>
            </div>
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
