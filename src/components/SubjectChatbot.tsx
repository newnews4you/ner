import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, X, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface SubjectChatbotProps {
  subjectName: string;
  topic?: string;
  gradient: string;
  onClose?: () => void;
}

// Subject-specific configurations
const SUBJECT_CONFIG: Record<string, { emoji: string; tutorName: string; greeting: string }> = {
  'Matematika': {
    emoji: '🧮',
    tutorName: 'Prof. Matematika',
    greeting: 'Sveiki! Aš esu Prof. Matematika 🧮 - jūsų matematikos ekspertas. Galiu padėti su algebra, geometrija, analize ir kitomis temomis. Koks klausimas jums kilo?'
  },
  'IT Technologijos': {
    emoji: '💻',
    tutorName: 'Dev.AI',
    greeting: 'Sveiki! Aš esu Dev.AI 💻 - jūsų programavimo mentorius. Padėsiu su Python, JavaScript, algoritmais ir viskuo, kas susiję su IT. Ką norėtumėte išmokti?'
  },
  'Fizika': {
    emoji: '⚛️',
    tutorName: 'Prof. Fizika',
    greeting: 'Sveiki! Aš esu Prof. Fizika ⚛️ - fizikos pasaulio gidas. Paaiškinsiu mechaniką, elektromagnetizmą ir kitas temas su realiais pavyzdžiais. Kas jums įdomu?'
  },
  'Lietuvių kalba': {
    emoji: '📚',
    tutorName: 'Mokytoja Liepa',
    greeting: 'Labas! Aš esu Mokytoja Liepa 📚 - lietuvių kalbos ir literatūros ekspertė. Padėsiu su gramatika, rašiniais ir literatūros analize. Kuo galiu padėti?'
  },
  'Dailė': {
    emoji: '🎨',
    tutorName: 'Menininkas AI',
    greeting: 'Sveiki! Aš esu Menininkas AI 🎨 - jūsų kūrybinis partneris. Padėsiu suprasti spalvų teoriją, kompoziciją ir piešimo technikas. Ką norėtumėte kurti?'
  },
  'Istorija': {
    emoji: '🏛️',
    tutorName: 'Istorikas AI',
    greeting: 'Sveiki! Aš esu Istorikas AI 🏛️ - istorijos pasakotojas. Papasakosiu apie Lietuvos ir pasaulio istoriją taip, kad būtų įdomu. Apie ką norėtumėte sužinoti?'
  }
};

const SubjectChatbot = ({ subjectName, topic, gradient, onClose }: SubjectChatbotProps) => {
  const config = SUBJECT_CONFIG[subjectName] || {
    emoji: '🎓',
    tutorName: 'AI Tutorius',
    greeting: `Sveiki! Aš esu jūsų ${subjectName} tutorius. Kuo galiu padėti?`
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: config.greeting,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
      const { api } = await import('@/services/api');
      // Use tutor mode with subject name
      const response = await api.ai.chatTutor(currentInput, subjectName, topic);
      
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

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-6 right-6 z-50 ${gradient} rounded-2xl p-4 shadow-2xl cursor-pointer hover:scale-105 transition-transform flex items-center gap-3`}
      >
        <span className="text-2xl">{config.emoji}</span>
        <div>
          <p className="text-white font-semibold text-sm">{config.tutorName}</p>
          <p className="text-white/70 text-xs">Paspausk atidaryti</p>
        </div>
        <Maximize2 className="w-5 h-5 text-white/70" />
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl flex flex-col h-[500px] overflow-hidden border-2 border-white/20 shadow-2xl animate-fade-in">
      {/* Header */}
      <div className={`p-4 border-b border-white/10 ${gradient}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <span className="text-xl">{config.emoji}</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                {config.tutorName}
                <Sparkles className="w-4 h-4 text-white/70 animate-pulse" />
              </h2>
              <p className="text-xs text-white/70">
                {topic ? `Tema: ${topic}` : `${subjectName} ekspertas`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-background/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.isBot ? "" : "flex-row-reverse"}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                message.isBot ? gradient : "gradient-purple-pink"
              }`}
            >
              {message.isBot ? (
                <span className="text-sm">{config.emoji}</span>
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
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${gradient}`}>
              <span className="text-sm">{config.emoji}</span>
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
      <div className="p-4 border-t border-white/10 bg-secondary/30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Klausk ${config.tutorName}...`}
            className="flex-1 bg-secondary/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          🎓 Specializuotas {subjectName} tutorius
        </p>
      </div>
    </div>
  );
};

export default SubjectChatbot;

