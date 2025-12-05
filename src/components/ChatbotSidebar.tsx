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
  mode?: 'guide' | 'tutor';
  subjectName?: string;
}

const ChatbotSidebar = ({ isOpen = true, onClose, isMobileOverlay = false, mode = 'guide', subjectName }: ChatbotSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages based on mode
  useEffect(() => {
    if (mode === 'tutor' && subjectName) {
      setMessages([
        {
          id: 1,
          text: `Sveiki! Aš esu jūsų ${subjectName} tutorius. 🎓 Galiu padėti išspręsti uždavinius, paaiškinti teoriją ar paruošti kontroliniam. Ką norėtumėte panagrinėti?`,
          isBot: true,
          timestamp: new Date(),
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          text: "Sveiki! 👋 Aš esu Mokslo Gidas - jūsų asmeninis asistentas. Padėsiu susiorientuoti ir nukreipsiu į tinkamą kursą. Ko norėtumėte mokytis šiandien?",
          isBot: true,
          timestamp: new Date(),
        }
      ]);
    }
  }, [mode, subjectName]);

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

      let response;
      if (mode === 'tutor' && subjectName) {
        response = await api.ai.chatTutor(currentInput, subjectName);
      } else {
        response = await api.ai.chatGuide(currentInput);
      }

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
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={onClose}
        />

        {/* Slide-up Panel */}
        <div
          className={`fixed inset-x-0 bottom-0 z-50 lg:hidden transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
          <div className="bg-white rounded-t-2xl flex flex-col h-[85vh] border-t border-gray-200 shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                    <Compass className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 tracking-tight">
                      {mode === 'tutor' ? 'D.I korepetitorius' : 'Mokslo Gidas'}
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">
                      {mode === 'tutor' ? 'Padėsiu su užduotimis' : 'Padėsiu susiorientuoti'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gray-50/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${message.isBot ? "bg-gray-100 border border-gray-200" : "bg-gray-900"
                      }`}
                  >
                    {message.isBot ? (
                      <Compass className="w-4 h-4 text-gray-600" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm ${message.isBot
                      ? "bg-white border border-gray-200 text-gray-900"
                      : "bg-gray-900 text-white"
                      }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-100">
                    <Compass className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white pb-safe">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Užduok klausimą..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center font-medium">
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
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
              <Compass className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 tracking-tight">
                {mode === 'tutor' ? 'D.I korepetitorius' : 'Mokslo Gidas'}
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {mode === 'tutor' ? 'Padėsiu su užduotimis' : 'Padėsiu susiorientuoti'}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${message.isBot
                ? "bg-gray-100"
                : "bg-blue-100"
                }`}
            >
              {message.isBot ? (
                <Compass className="w-4 h-4 text-gray-600" />
              ) : (
                <User className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${message.isBot
                ? "bg-gray-100 text-gray-900"
                : "bg-blue-600 text-white"
                }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-100">
              <Compass className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ko norėtumėte mokytis?"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center font-medium">
          💡 Pasakyk ko nori mokytis - nukreipsiu į tinkamą kursą!
        </p>
      </div>
    </div>
  );
};

export default ChatbotSidebar;
