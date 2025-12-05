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
        className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
      >
        <span className="text-2xl">{config.emoji}</span>
        <div>
          <p className="text-gray-900 font-semibold text-sm">{config.tutorName}</p>
          <p className="text-gray-500 text-xs font-medium">Paspausk atidaryti</p>
        </div>
        <Maximize2 className="w-4 h-4 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl flex flex-col h-[500px] overflow-hidden border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
              <span className="text-xl">{config.emoji}</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 tracking-tight">
                {config.tutorName}
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {topic ? `Tema: ${topic}` : `${subjectName} ekspertas`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Minimize2 className="w-4 h-4 text-gray-500" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
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
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${message.isBot ? "bg-gray-100" : "bg-blue-100"
                }`}
            >
              {message.isBot ? (
                <span className="text-sm">{config.emoji}</span>
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
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gray-100`}>
              <span className="text-sm">{config.emoji}</span>
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
            placeholder={`Klausk ${config.tutorName}...`}
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
          🎓 Specializuotas {subjectName} tutorius
        </p>
      </div>
    </div>
  );
};

export default SubjectChatbot;
