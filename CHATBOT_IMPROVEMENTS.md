# Chatbot Kokybės Patobulinimai

## 🎯 Prioritetai

### 1. AI Atsakymų Kokybė (Aukščiausias prioritetas)

#### A. Padidinti max_tokens ir pagerinti parametrus
```javascript
// backend/src/services/aiTutor.js
const completion = await openai.chat.completions.create({
  model: OPENROUTER_MODEL,
  messages: messages,
  temperature: 0.7, // Pagerinti: 0.6-0.8 pagal režimą
  max_tokens: 1500, // Padidinti iš 500 → 1500
  top_p: 0.9, // Pridėti diversity
  frequency_penalty: 0.3, // Sumažinti pasikartojimus
  presence_penalty: 0.3, // Skatinti naujas temas
});
```

#### B. Pagerinti system prompts su daugiau konteksto
```javascript
// Pridėti:
- Mokinio mokymosi stilius (visual, auditory, kinesthetic)
- Mokinio silpnos sritys su konkrečiais pavyzdžiais
- Mokinio mėgstamos temos
- Mokinio mokymosi tikslai
```

#### C. Retry logika su exponential backoff
```javascript
async function getTutorResponseWithRetry(userId, message, context, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await getTutorResponse(userId, message, context);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### 2. Streaming Responses (Real-time UX)

#### Backend: Server-Sent Events (SSE)
```javascript
// backend/src/routes/ai.js
router.post('/chat/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const stream = await openai.chat.completions.create({
    model: OPENROUTER_MODEL,
    messages: messages,
    stream: true, // Įjungti streaming
  });
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }
  res.write('data: [DONE]\n\n');
  res.end();
});
```

#### Frontend: EventSource arba fetch stream
```typescript
// src/components/ChatbotSidebar.tsx
const handleSend = async () => {
  // ... existing code ...
  
  try {
    const response = await fetch(`${API_URL}/api/ai/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: currentInput, mode: 'guide' }),
    });
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            fullResponse += data.content;
            // Update message in real-time
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: fullResponse,
              };
              return updated;
            });
          }
        }
      }
    }
  } catch (error) {
    // ... error handling ...
  }
};
```

### 3. Pagerinti Error Handling

```javascript
// backend/src/services/aiTutor.js
export const getTutorResponse = async (userId, message, context = {}) => {
  try {
    // ... existing code ...
  } catch (error) {
    console.error('Error getting AI tutor response:', error);
    
    // Specifinės klaidos
    if (error.status === 401) {
      throw new Error('API raktas neteisingas. Susisiekite su administratoriumi.');
    } else if (error.status === 429) {
      throw new Error('Per daug užklausų. Palaukite kelias sekundes.');
    } else if (error.status === 500) {
      throw new Error('Serverio klaida. Bandykite dar kartą po kelių sekundžių.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Užklausa užtruko per ilgai. Bandykite dar kartą.');
    }
    
    throw new Error('Nepavyko gauti AI atsakymo. Bandykite dar kartą.');
  }
};
```

### 4. Suggested Questions / Quick Actions

```typescript
// src/components/ChatbotSidebar.tsx
const SUGGESTED_QUESTIONS = [
  "Kokius kursus rekomenduotumėte?",
  "Kaip pagerinti savo pažymius?",
  "Kur galiu rasti matematikos medžiagą?",
  "Kaip planuoti mokymąsi?",
];

// Pridėti po input lauku:
<div className="flex flex-wrap gap-2 mt-2">
  {SUGGESTED_QUESTIONS.map((q, i) => (
    <button
      key={i}
      onClick={() => setInput(q)}
      className="text-xs px-3 py-1 bg-secondary/50 rounded-full hover:bg-secondary transition-colors"
    >
      {q}
    </button>
  ))}
</div>
```

### 5. Message Actions (Copy, Edit, Delete)

```typescript
// src/components/ChatbotSidebar.tsx
interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  canEdit?: boolean; // Tik user messages
}

// Pridėti message actions:
<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
  {!message.isBot && (
    <button onClick={() => handleEdit(message.id)}>
      <Edit className="w-3 h-3" />
    </button>
  )}
  <button onClick={() => navigator.clipboard.writeText(message.text)}>
    <Copy className="w-3 h-3" />
  </button>
  {!message.isBot && (
    <button onClick={() => handleDelete(message.id)}>
      <Trash className="w-3 h-3" />
    </button>
  )}
</div>
```

### 6. Chat History su Search

```typescript
// Pridėti search funkcionalumą
const [searchQuery, setSearchQuery] = useState('');

const filteredMessages = messages.filter(msg =>
  msg.text.toLowerCase().includes(searchQuery.toLowerCase())
);

// Pridėti search input
<input
  type="text"
  placeholder="Ieškoti pokalbyje..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="mb-2"
/>
```

### 7. Better Context Awareness

```javascript
// backend/src/services/aiTutor.js
// Pridėti daugiau konteksto:
const userContext = {
  currentTime: new Date().toLocaleString('lt-LT'),
  dayOfWeek: new Date().toLocaleDateString('lt-LT', { weekday: 'long' }),
  studyStreak: await getStudyStreak(userId),
  recentActivity: await getRecentActivity(userId),
  upcomingDeadlines: await getUpcomingDeadlines(userId),
};

// Pridėti į system prompt:
const systemPrompt = `
${basePrompt}

📅 KONTEKSTAS:
- Dabar: ${userContext.currentTime}
- Mokymosi serija: ${userContext.studyStreak} dienos
- Artėjantys deadline'ai: ${userContext.upcomingDeadlines.length}
`;
```

### 8. Response Caching

```javascript
// backend/src/services/aiTutor.js
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 }); // 1 valanda

export const getTutorResponse = async (userId, message, context = {}) => {
  // Cache key pagal message + context
  const cacheKey = `${userId}-${message}-${JSON.stringify(context)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // ... existing code ...
  
  cache.set(cacheKey, response);
  return response;
};
```

### 9. Better Model Selection

```javascript
// backend/src/services/aiTutor.js
// Pasirinkti modelį pagal užduoties sudėtingumą
function selectModel(message, context) {
  const isComplex = message.length > 200 || context.mode === 'tutor';
  
  if (isComplex) {
    return 'openai/gpt-4o-mini'; // Geresnis modelis sudėtingoms užduotims
  }
  return 'openai/gpt-4o-mini'; // Arba pigesnis modelis paprastoms
}
```

### 10. Analytics ir Monitoring

```javascript
// backend/src/services/aiTutor.js
// Track chatbot performance
await db.run(`
  INSERT INTO chatbot_analytics (user_id, message_length, response_time, model_used, success)
  VALUES (?, ?, ?, ?, ?)
`, [userId, message.length, responseTime, OPENROUTER_MODEL, true]);
```

## 📊 Implementacijos Eiliškumas

1. **Fazė 1 (Greitai):**
   - ✅ Padidinti max_tokens → 1500
   - ✅ Pagerinti error handling
   - ✅ Pridėti suggested questions

2. **Fazė 2 (Vidutiniškai):**
   - ✅ Streaming responses
   - ✅ Message actions (copy, edit, delete)
   - ✅ Better context awareness

3. **Fazė 3 (Ilgalaikis):**
   - ✅ Chat history su search
   - ✅ Response caching
   - ✅ Analytics ir monitoring

## 🎨 UX Patobulinimai

- **Better loading states:** Skeleton loaders vietoj typing indicators
- **Message reactions:** 👍 👎 reakcijos atsakymams
- **Export conversation:** PDF/Text export
- **Dark/Light mode:** Chatbot tema pagal app tema
- **Mobile optimization:** Geriau veikia mobiliuose

## 🔧 Technical Improvements

- **Rate limiting:** Apsauga nuo per daug užklausų
- **Request timeout:** 30s timeout su retry
- **Better logging:** Structured logging su Winston
- **Health checks:** Chatbot health endpoint

