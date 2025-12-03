import OpenAI from 'openai';
import dotenv from 'dotenv';
import db from '../database/db.js';

dotenv.config();

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'; // Default model

// Initialize OpenAI client with OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'http://localhost:3000', // Optional
    'X-Title': process.env.OPENROUTER_APP_NAME || 'NER AI Tutor', // Optional
  },
});

/**
 * Get AI tutor response based on user message and context
 */
export const getTutorResponse = async (userId, message, context = {}) => {
  try {
    // Get user's study history and progress
    const userProgress = await getUserProgress(userId);
    const recentMessages = await getRecentChatHistory(userId, 5);

    // Build system prompt for AI tutor
    const systemPrompt = buildSystemPrompt(userProgress, context);

    // Build conversation history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.isBot ? msg.response : msg.message
      })),
      { role: 'user', content: message }
    ];

    // Call OpenRouter API
    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    // Save message to database
    await saveChatMessage(userId, context.subjectId, message, response);

    return response;
  } catch (error) {
    console.error('Error getting AI tutor response:', error);
    throw new Error('Failed to get AI tutor response');
  }
};

/**
 * Get AI recommendations based on user progress
 */
export const getAIRecommendations = async (userId, subjectId = null) => {
  try {
    const userProgress = await getUserProgress(userId, subjectId);
    
    const prompt = `You are an AI tutor analyzing a student's learning progress. Based on the following data, provide personalized study recommendations in Lithuanian.

Student Progress Data:
${JSON.stringify(userProgress, null, 2)}

Provide 3-5 specific, actionable recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "study|practice|review|focus",
      "title": "Recommendation title",
      "description": "Detailed description",
      "subject": "Subject name",
      "priority": "high|medium|low",
      "estimatedTime": "30-45 min",
      "reason": "Why this recommendation"
    }
  ]
}

Respond ONLY with valid JSON, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert AI tutor. Always respond in valid JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);
    
    return parsed.recommendations || [];
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Return fallback recommendations
    return getFallbackRecommendations(userProgress);
  }
};

/**
 * Generate practice questions using AI
 */
export const generatePracticeQuestions = async (subject, topic, difficulty = 'medium', count = 5) => {
  try {
    const prompt = `Generate ${count} practice questions for ${subject} - ${topic} topic.
Difficulty level: ${difficulty}
Language: Lithuanian

Format as JSON:
{
  "questions": [
    {
      "id": "1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of the answer"
    }
  ]
}

Respond ONLY with valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert teacher. Generate educational questions in valid JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);
    
    return parsed.questions || [];
  } catch (error) {
    console.error('Error generating practice questions:', error);
    throw new Error('Failed to generate practice questions');
  }
};

/**
 * Generate learning path using AI
 */
export const generateLearningPath = async (subject, currentLevel) => {
  try {
    const prompt = `Create a personalized learning path for ${subject} starting from level ${currentLevel}.
Language: Lithuanian

Format as JSON:
{
  "steps": [
    {
      "id": "1",
      "title": "Step title",
      "description": "What to learn",
      "estimatedTime": "30 min",
      "order": 1
    }
  ]
}

Respond ONLY with valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: 'You are an expert curriculum designer. Create learning paths in valid JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0].message.content;
    const parsed = JSON.parse(response);
    
    return parsed.steps || [];
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw new Error('Failed to generate learning path');
  }
};

// Helper functions

// Subject-specific AI personalities
const SUBJECT_PERSONALITIES = {
  'Matematika': {
    name: 'Prof. Matematika',
    emoji: '🧮',
    expertise: 'matematikos ekspertas - algebra, geometrija, analizė, tikimybės',
    style: 'Mėgstu naudoti aiškius pavyzdžius ir žingsnis po žingsnio sprendimus. Visada prašau mokinio pabandyti pačiam prieš duodamas atsakymą.',
    topics: 'integralai, išvestinės, funkcijos, lygtys, trigonometrija, statistika'
  },
  'IT Technologijos': {
    name: 'Dev.AI',
    emoji: '💻',
    expertise: 'programavimo ir IT ekspertas - Python, JavaScript, algoritmai, duomenų struktūros',
    style: 'Mėgstu praktinį mokymą per kodą. Visada pateikiu veikiančius kodo pavyzdžius ir paaiškinu kiekvieną eilutę.',
    topics: 'programavimas, Python, kintamieji, ciklai, funkcijos, OOP, duomenų bazės'
  },
  'Fizika': {
    name: 'Prof. Fizika',
    emoji: '⚛️',
    expertise: 'fizikos ekspertas - mechanika, termodinamika, elektra, optika',
    style: 'Visada sieju teoriją su realiais pavyzdžiais ir kasdienėmis situacijomis. Mėgstu eksperimentus ir vizualizacijas.',
    topics: 'Niutono dėsniai, energija, impulsas, bangos, elektromagnetizmas'
  },
  'Lietuvių kalba': {
    name: 'Mokytoja Liepa',
    emoji: '📚',
    expertise: 'lietuvių kalbos ir literatūros ekspertė - gramatika, rašyba, literatūros analizė',
    style: 'Mėgstu literatūrą ir kūrybinį rašymą. Padedu analizuoti tekstus ir tobulinti rašymo įgūdžius.',
    topics: 'gramatika, skyryba, literatūra, rašiniai, stilistika'
  },
  'Dailė': {
    name: 'Menininkas AI',
    emoji: '🎨',
    expertise: 'dailės ir meno ekspertas - piešimas, tapyba, kompozicija, meno istorija',
    style: 'Skatinu kūrybiškumą ir eksperimentavimą. Padedu suprasti meno technikas ir istoriją.',
    topics: 'spalvų teorija, kompozicija, perspektyva, meno stiliai'
  },
  'Istorija': {
    name: 'Istorikas AI',
    emoji: '🏛️',
    expertise: 'istorijos ekspertas - Lietuvos ir pasaulio istorija, kultūra, civilizacijos',
    style: 'Pasakoju istoriją kaip įdomų pasakojimą. Sieju įvykius su priežastimis ir pasekmėmis.',
    topics: 'Lietuvos istorija, LDK, pasaulio istorija, karai, kultūra'
  }
};

function buildSystemPrompt(userProgress, context) {
  const { mode, subjectName, topic } = context;
  
  // GUIDE MODE - Main dashboard assistant (like a receptionist)
  if (mode === 'guide') {
    return `Tu esi "Mokslo Gidas" - draugiškas AI asistentas mokymosi platformoje. Tavo vaidmuo yra kaip konsultanto laukiamajame.

🎯 TAVO TIKSLAS:
- Padėti mokiniui susiorientuoti platformoje
- Rekomenduoti kursus pagal mokinio poreikius
- Nukreipti į teisingą vietą
- Motyvuoti mokytis

📚 GALIMI KURSAI:
- Matematika 🧮 - algebra, geometrija, analizė
- IT Technologijos 💻 - programavimas, Python
- Fizika ⚛️ - mechanika, elektra
- Lietuvių kalba 📚 - gramatika, literatūra
- Dailė 🎨 - piešimas, kompozicija
- Istorija 🏛️ - Lietuvos ir pasaulio istorija

📊 MOKINIO PROGRESAS:
- Kursai: ${userProgress.subjects?.map(s => s.name).join(', ') || 'Dar nepradėta'}
- Bendras progresas: ${userProgress.overallProgress || 0}%

💬 KAIP KALBĖTI:
- Būk draugiškas ir šiltas
- Užduok klausimus apie mokinio tikslus
- Rekomenduok kursus pagal poreikius
- Jei mokinys klausia apie konkrečią temą, pasiūlyk eiti į tą kursą: "Rekomenduoju atidaryti [Kurso pavadinimas] kursą, kur rasite specializuotą AI tutorių!"
- NIEKADA nemokyk dalykų pats - nukreipk į specializuotus tutorių
- Atsakyk TRUMPAI - 2-3 sakiniai

Pavyzdys: Jei mokinys klausia "kaip išspręsti lygtį", atsakyk: "Matematikos klausimams rekomenduoju atidaryti Matematika kursą! Ten rasite Prof. Matematika - specializuotą AI tutorių, kuris padės žingsnis po žingsnio. 🧮"`;
  }
  
  // SUBJECT TUTOR MODE - Specialized AI for each subject
  const subjectConfig = SUBJECT_PERSONALITIES[subjectName] || {
    name: 'AI Tutorius',
    emoji: '🎓',
    expertise: 'bendrasis mokytojas',
    style: 'Padedu mokytis įvairių dalykų.',
    topics: 'įvairios temos'
  };
  
  return `Tu esi "${subjectConfig.name}" ${subjectConfig.emoji} - ${subjectConfig.expertise}.

🎯 TAVO SPECIALIZACIJA:
${subjectConfig.topics}

📖 DABARTINĖ TEMA: ${topic || 'Bendra'}

💡 TAVO STILIUS:
${subjectConfig.style}

📊 MOKINIO PROGRESAS:
- Bendras progresas: ${userProgress.overallProgress || 0}%
- Silpnos sritys: ${userProgress.weakAreas?.join(', ') || 'Nėra'}

📝 INSTRUKCIJOS:
1. Tu esi EKSPERTAS šioje srityje - mokyk giliai ir išsamiai
2. Naudok pavyzdžius ir analogijas
3. Jei mokinys klausia apie KĄ NORS ne tavo srityje, mandagiai nukreipk atgal į dashboard
4. Užduok klausimus patikrinti supratimą
5. Būk kantriai ir draugiškas
6. Jei reikia, pateik formules, kodo pavyzdžius ar diagramas
7. Atsakyk LIETUVIŠKAI
8. Būk išsamus - galite rašyti ilgus atsakymus kai reikia paaiškinti`;
}

async function getUserProgress(userId, subjectId = null) {
  try {
    let query = `
      SELECT 
        s.id, s.name, COALESCE(p.progress_percentage, 0) as progress_percentage,
        COUNT(DISTINCT t.id) as total_topics,
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_topics
      FROM subjects s
      LEFT JOIN progress p ON p.subject_id = s.id AND p.user_id = ?
      LEFT JOIN topics t ON t.subject_id = s.id
      WHERE s.user_id = ?
    `;
    
    const params = [userId, userId];
    if (subjectId) {
      query += ' AND s.id = ?';
      params.push(subjectId);
    }
    
    query += ' GROUP BY s.id';
    
    const subjects = await db.all(query, params);
    
    // Get weak areas (topics with low scores)
    const weakAreas = await db.all(`
      SELECT t.title, t.score
      FROM topics t
      JOIN subjects s ON t.subject_id = s.id
      WHERE s.user_id = ? AND t.score IS NOT NULL AND t.score < 70
      ORDER BY t.score ASC
      LIMIT 5
    `, [userId]);
    
    const overallProgress = subjects.length > 0
      ? Math.round(subjects.reduce((sum, s) => sum + (s.progress_percentage || 0), 0) / subjects.length)
      : 0;
    
    return {
      subjects,
      overallProgress,
      weakAreas: weakAreas.map(w => w.title)
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return { subjects: [], overallProgress: 0, weakAreas: [] };
  }
}

async function getRecentChatHistory(userId, limit = 5) {
  try {
    const messages = await db.all(`
      SELECT message, response, created_at
      FROM chat_messages
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `, [userId, limit]);
    
    return messages.reverse().map((msg, index) => ({
      isBot: index % 2 === 1,
      message: msg.message,
      response: msg.response
    }));
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
}

async function saveChatMessage(userId, subjectId, message, response) {
  try {
    const { v4: uuidv4 } = await import('uuid');
    await db.run(`
      INSERT INTO chat_messages (id, user_id, subject_id, message, response)
      VALUES (?, ?, ?, ?, ?)
    `, [uuidv4(), userId, subjectId || null, message, response]);
  } catch (error) {
    console.error('Error saving chat message:', error);
  }
}

function getFallbackRecommendations(userProgress) {
  return [
    {
      type: 'study',
      title: 'Tęskite reguliarų mokymąsi',
      description: 'Rekomenduojame mokytis kasdien bent 30 minučių',
      subject: 'Bendras',
      priority: 'medium',
      estimatedTime: '30 min',
      reason: 'Reguliarus mokymasis padeda geriau įsiminti medžiagą'
    }
  ];
}

