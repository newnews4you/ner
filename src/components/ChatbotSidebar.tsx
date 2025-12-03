import { useState, useRef, useEffect } from "react";
import { Compass, Send, Sparkles, User, X, GraduationCap } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobileOverlay?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Sveiki! 👋 Aš esu Mokslo Gidas - jūsų asmeninis asistentas. Padėsiu susiorientuoti ir nukreipsiu į tinkamą kursą. Ko norėtumėte mokytis šiandien?",
    isBot: true,
    timestamp: new Date(),
  },
];

const ChatbotSidebar = ({ isOpen = true, onClose, isMobileOverlay = false }: ChatbotSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // Import API dynamically to avoid circular dependencies
      const { api } = await import('@/services/api');
      // Use guide mode for the main sidebar
      const response = await api.ai.chatGuide(currentInput);
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Atsiprašau, įvyko klaida. Bandykite dar kartą.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Mobile overlay version
  if (isMobileOverlay) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
        
        {/* Slide-up Panel */}
        <div 
          className={`fixed inset-x-0 bottom-0 z-50 lg:hidden transition-transform duration-300 ease-out ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="glass rounded-t-3xl flex flex-col h-[85vh] border-t-2 border-x-2 border-primary/30">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-cyan-blue flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                      Mokslo Gidas
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </h2>
                    <p className="text-xs text-muted-foreground">Padėsiu susiorientuoti</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      message.isBot ? "gradient-cyan-blue" : "gradient-purple-pink"
                    }`}
                  >
                    {message.isBot ? (
                      <Compass className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      message.isBot
                        ? "bg-secondary/70 text-foreground"
                        : "gradient-purple-pink text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-cyan-blue">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-secondary/70 p-3 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-secondary/30 pb-safe">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Užduok klausimą..."
                  className="flex-1 bg-secondary/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-xl gradient-purple-pink flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI gali klysti. Patikrinkite svarbią informaciją.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar version
  return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col h-[calc(100vh-120px)] sticky top-6">
      <div className="glass rounded-2xl flex flex-col h-full overflow-hidden border-2 border-cyan-500/30 animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-cyan-blue flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                Mokslo Gidas
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </h2>
              <p className="text-xs text-muted-foreground">Padėsiu susiorientuoti</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  message.isBot
                    ? "gradient-cyan-blue"
                    : "gradient-purple-pink"
                }`}
              >
                {message.isBot ? (
                  <Compass className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  message.isBot
                    ? "bg-secondary/70 text-foreground"
                    : "gradient-purple-pink text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-cyan-blue">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div className="bg-secondary/70 p-3 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-secondary/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ko norėtumėte mokytis?"
              className="flex-1 bg-secondary/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl gradient-cyan-blue flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Pasakyk ko nori mokytis - nukreipsiu į tinkamą kursą!
          </p>
        </div>
      </div>
    </aside>
  );
};

export default ChatbotSidebar;
