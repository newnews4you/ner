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
    
    // Gauti klasę iš subject duomenų, jei yra subjectId
    let grade = context.grade;
    if (!grade && context.subjectId) {
      const subject = await db.get('SELECT grade FROM subjects WHERE id = ?', [context.subjectId]);
      grade = subject?.grade || 11; // Default 11 klasė
    }
    if (!grade) grade = 11; // Default 11 klasė

    // Build system prompt for AI tutor su grade informacija
    const systemPrompt = buildSystemPrompt(userProgress, { ...context, grade });

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
      max_tokens: 1500, // Padidinta iš 500 → 1500 ilgesniems atsakymams
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    const response = completion.choices[0].message.content;

    // Save message to database
    await saveChatMessage(userId, context.subjectId, message, response);

    return response;
  } catch (error) {
    console.error('Error getting AI tutor response:', error);
    
    // Specifinės klaidos
    if (error.status === 401) {
      throw new Error('API raktas neteisingas. Susisiekite su administratoriumi.');
    } else if (error.status === 429) {
      throw new Error('Per daug užklausų. Palaukite kelias sekundes.');
    } else if (error.status === 500) {
      throw new Error('Serverio klaida. Bandykite dar kartą po kelių sekundžių.');
    } else if (error.message && error.message.includes('timeout')) {
      throw new Error('Užklausa užtruko per ilgai. Bandykite dar kartą.');
    }
    
    throw new Error('Nepavyko gauti AI atsakymo. Bandykite dar kartą.');
  }
};

/**
 * Get AI recommendations based on user progress
 */
export const getAIRecommendations = async (userId, subjectId = null) => {
  let userProgress = null;
  try {
    userProgress = await getUserProgress(userId, subjectId);
    
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
    
    // Try to extract JSON from response (in case AI adds extra text)
    let jsonStr = response.trim();
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    // Find JSON object in response
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    const parsed = JSON.parse(jsonStr);
    
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

// Oficiali Lietuvos 11 klasės fizikos mokymo programa
// Pagal Lietuvos Respublikos švietimo ir mokslo ministro patvirtintą programą
// Atnaujinta 2023 m. rugsėjo 1 d.
const PHYSICS_11_GRADE_CURRICULUM = {
  grade: 11,
  subject: 'Fizika',
  hoursPerYear: 36, // Valandos per metus
  additionalModule: '1 valanda per savaitę (jei pasirenkamas fizikos modulis)',
  curriculum: [
    {
      unit: 'Fizikos mokslo kalba ir pažinimo metodai',
      topics: [
        'Fizikos mokslo raida - svarbiausi istoriniai atradimai',
        'Lietuvos mokslininkų indėlis fizikos moksle',
        'Pažinimo metodai: stebėjimas, eksperimentas',
        'Teorinis ir eksperimentinis tyrimas',
        'Matavimai ir skaičiavimai fizikoje',
        'SI matavimo vienetų sistema',
        'Matavimo tikslumo įvertinimas',
        'Absoliučių ir santykinių paklaidų skaičiavimas'
      ]
    },
    {
      unit: 'Mechanika',
      subtopics: [
        {
          name: 'Kinematika',
          topics: [
            'Tiesiaeigis judėjimas - greitis, pagreitis',
            'Kreivaeigis judėjimas',
            'Judėjimo grafikai (greitis, pagreitis, kelias)',
            'Laisvas kritimas',
            'Horizontalus metimas',
            'Kampinis metimas'
          ]
        },
        {
          name: 'Dinamika',
          topics: [
            'Jėgos ir jų poveikis kūnų judėjimui',
            'Niutono pirmasis dėsnis (inercijos dėsnis)',
            'Niutono antrasis dėsnis (F = ma)',
            'Niutono trečiasis dėsnis (veikimo ir atoveikimo)',
            'Trinties jėgos - statinė ir kinetinė trintis',
            'Jėgų sudėtis ir skaidymas',
            'Jėgų pusiausvyra',
            'Judesio kiekio (impulso) tvermės dėsnis'
          ]
        },
        {
          name: 'Darbas, galia, energija',
          topics: [
            'Mechaninio darbo sąvoka',
            'Mechaninio darbo skaičiavimas',
            'Galia - apibrėžimas ir skaičiavimas',
            'Kinetinė energija',
            'Potencinė energija (gravitacinė)',
            'Energijos tvermės dėsnis mechanikoje',
            'Energijos virsmai'
          ]
        },
        {
          name: 'Mechaninių svyravimų ir bangų fizika',
          topics: [
            'Svyravimų tipai - laisvieji ir priverstieji',
            'Harmoniniai svyravimai',
            'Svyravimų charakteristikos - amplitudė, periodas, dažnis',
            'Mechaninės bangos - skersinės ir išilginės',
            'Bangų charakteristikos - bangos ilgis, greitis, dažnis',
            'Garso bangos',
            'Bangų interferencija',
            'Bangų difrakcija'
          ]
        }
      ]
    },
    {
      unit: 'Molekulinė fizika ir termodinamika',
      topics: [
        'Molekulinė kinetinė teorija',
        'Idealiųjų dujų modelis',
        'Dujų būsenos lygtis (Clapeyron lygtis)',
        'Izoprocesai:',
        '  - Izoterminis procesas (Boyle-Mariotte dėsnis)',
        '  - Izobarinis procesas (Gay-Lussac dėsnis)',
        '  - Izochorinis procesas (Charles dėsnis)',
        'Termodinaminiai procesai',
        'Vidaus energija',
        'Šilumos kiekis',
        'Savitoji šiluma',
        'Šilumos mainai',
        'Faziniai virsmai:',
        '  - Lydymasis ir kietėjimas',
        '  - Garavimas ir kondensacija',
        '  - Sublimacija',
        'Pirmasis termodinamikos dėsnis',
        'Antrasis termodinamikos dėsnis',
        'Šilumos varikliai ir jų efektyvumas'
      ]
    },
    {
      unit: 'Elektromagnetizmas',
      subtopics: [
        {
          name: 'Elektrostatika',
          topics: [
            'Elektrinis krūvis',
            'Kulono dėsnis',
            'Elektrinis laukas',
            'Elektrostatinio lauko stipris',
            'Elektrostatinio lauko potencialas',
            'Kondensatoriai',
            'Kondensatoriaus talpa',
            'Kondensatoriaus energija'
          ]
        },
        {
          name: 'Nuolatinė elektros srovė',
          topics: [
            'Elektros srovės sąvoka',
            'Srovės stipris',
            'Įtampa',
            'Omo dėsnis',
            'Elektros varža',
            'Varžos priklausomybė nuo temperatūros',
            'Jungimo būdai:',
            '  - Nuoseklusis jungimas',
            '  - Lygiagretusis jungimas',
            'Kirchofo taisyklės',
            'Elektros srovės darbas',
            'Elektros srovės galia',
            'Joule-Lenz dėsnis'
          ]
        },
        {
          name: 'Magnetinis laukas',
          topics: [
            'Magnetinio lauko sąvoka',
            'Magnetinė indukcija',
            'Ampero jėga',
            'Lorenco jėga',
            'Elektromagnetinė indukcija',
            'Faradėjaus dėsnis',
            'Savyindukcija',
            'Induktyvumas',
            'Kintamoji srovė',
            'Efektinės vertės',
            'Transformatoriai'
          ]
        }
      ]
    },
    {
      unit: 'Optika',
      topics: [
        'Šviesos sklidimas',
        'Šviesos atspindys',
        'Veidrodžiai - plokščiasis ir sferinis',
        'Šviesos lūžimas',
        'Snellio dėsnis',
        'Visiškas vidaus atspindys',
        'Lęšiai - susiliejančios ir išsiskleidžiančios',
        'Lęšių formulė',
        'Lęšių didinimas',
        'Optiniai prietaisai:',
        '  - Mikroskopas',
        '  - Teleskopas',
        '  - Fotoaparatas',
        'Šviesos dispersija',
        'Spektrai',
        'Polarizacija'
      ]
    },
    {
      unit: 'Atomo ir branduolio fizika',
      topics: [
        'Atomo sandara',
        'Bohro atomo modelis',
        'Kvantiniai skaičiai',
        'Elektronų konfigūracija',
        'Radioaktyvumas',
        'Radioaktyvusis skilimas:',
        '  - Alfa skilimas',
        '  - Beta skilimas',
        '  - Gama spinduliuotė',
        'Pusėjimo trukmė',
        'Branduolinės reakcijos',
        'Branduolių skilimas',
        'Branduolių sintezė',
        'Branduolinė energetika',
        'Branduolinės jėgos'
      ]
    }
  ],
  learningObjectives: [
    'Mokytis taikyti fizikos dėsnius sprendžiant uždavinius',
    'Suprasti fizikinių reiškinių priežastis ir pasekmes',
    'Mokytis analizuoti eksperimentus ir duomenis',
    'Taikyti matematikos žinias fizikos uždaviniuose',
    'Suprasti fizikos dėsnių taikymą technikoje ir gamtoje',
    'Mokytis matuoti fizikinius dydžius ir įvertinti paklaidas',
    'Suprasti fizikos mokslo raidos svarbą',
    'Pažinti Lietuvos mokslininkų indėlį fizikos moksle'
  ],
  keyFormulas: [
    // Kinematika
    'v = s/t (greitis)',
    'a = Δv/Δt (pagreitis)',
    'v = v₀ + at (greitis su pagreičiu)',
    's = v₀t + at²/2 (kelias)',
    'v² = v₀² + 2as',
    // Dinamika
    'F = ma (Niutono II dėsnis)',
    'p = mv (impulsas)',
    'F = Δp/Δt (jėga ir impulso pokytis)',
    'F = μN (trinties jėga)',
    // Energija
    'Eₖ = mv²/2 (kinetinė energija)',
    'Eₚ = mgh (potencinė energija)',
    'W = Fs (darbas)',
    'P = W/t = Fv (galia)',
    // Termodinamika
    'PV = nRT (idealiųjų dujų būsenos lygtis)',
    'Q = mcΔT (šilumos kiekis)',
    'Q = mL (fazinių virsmų šiluma)',
    'ΔU = Q - W (I termodinamikos dėsnis)',
    // Elektromagnetizmas
    'F = kq₁q₂/r² (Kulono dėsnis)',
    'E = F/q (elektrostatinio lauko stipris)',
    'U = kq/r (potencialas)',
    'C = Q/U (talpa)',
    'U = RI (Omo dėsnis)',
    'P = UI = I²R = U²/R (galia)',
    'F = BIL (Ampero jėga)',
    'F = qvB (Lorenco jėga)',
    'ε = -ΔΦ/Δt (Faradėjaus dėsnis)',
    // Optika
    'n = c/v (lūžio rodiklis)',
    'n₁sin(α₁) = n₂sin(α₂) (Snellio dėsnis)',
    '1/f = 1/d + 1/d\' (lęšių formulė)',
    'Γ = d\'/d (didinimas)',
    // Branduolinė fizika
    'E = hf (fotono energija)',
    'E = mc² (Einšteino lygtis)',
    'N = N₀(1/2)^(t/T) (radioaktyvusis skilimas)'
  ],
  practicalWork: [
    'Matavimų atlikimas ir paklaidų įvertinimas',
    'Mechaninių dėsnių eksperimentinis tyrimas',
    'Elektros grandinių sudarymas ir tyrimas',
    'Optinių reiškinių stebėjimas',
    'Duomenų analizė ir grafikų sudarymas'
  ],
  assessment: [
    'Teorinių žinių patikra',
    'Uždavinių sprendimas',
    'Eksperimentinių darbų atlikimas',
    'Projektinė veikla'
  ]
};

// Funkcija gauti specifinės klasės ir dalyko temų sąrašą
function getCurriculumData(subjectName, grade) {
  if (subjectName === 'Fizika' && grade === 11) {
    return PHYSICS_11_GRADE_CURRICULUM;
  }
  // Galite pridėti kitus dalykus ir klases čia
  return null;
}

// Funkcija formatuoti curriculum tekstą AI prompt'ui
function formatCurriculumForPrompt(curriculumData) {
  if (!curriculumData) return '';
  
  let text = `
📚 ${curriculumData.grade} KLASĖS ${curriculumData.subject.toUpperCase()} MOKYMO PROGRAMA
(Valandos per metus: ${curriculumData.hoursPerYear}h${curriculumData.additionalModule ? ', ' + curriculumData.additionalModule : ''})

`;

  curriculumData.curriculum.forEach((unit, index) => {
    text += `\n${index + 1}. ${unit.unit}\n`;
    
    if (unit.subtopics) {
      // Jei yra subtopics (pvz., Mechanika)
      unit.subtopics.forEach((subtopic, subIndex) => {
        text += `   ${index + 1}.${subIndex + 1} ${subtopic.name}:\n`;
        subtopic.topics.forEach(topic => {
          text += `      • ${topic}\n`;
        });
      });
    } else if (unit.topics) {
      // Jei tiesiogiai topics
      unit.topics.forEach(topic => {
        text += `   • ${topic}\n`;
      });
    }
  });

  text += `\n🎯 MOKYMOSI TIKSLAI:\n`;
  curriculumData.learningObjectives.forEach(obj => {
    text += `   • ${obj}\n`;
  });

  text += `\n📐 SVARBIAUSIOS FORMULĖS:\n`;
  curriculumData.keyFormulas.forEach(formula => {
    text += `   • ${formula}\n`;
  });

  if (curriculumData.practicalWork) {
    text += `\n🔬 PRAKTINIAI DARBAI:\n`;
    curriculumData.practicalWork.forEach(work => {
      text += `   • ${work}\n`;
    });
  }

  return text;
}

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
  const { mode, subjectName, topic, grade } = context;
  
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

  // Gauti specifinės klasės mokymo programą
  const curriculumData = getCurriculumData(subjectName, grade || 11);
  const curriculumText = curriculumData ? formatCurriculumForPrompt(curriculumData) : '';
  
  return `Tu esi "${subjectConfig.name}" ${subjectConfig.emoji} - ${subjectConfig.expertise}.

${curriculumText}

📖 DABARTINĖ TEMA: ${topic || 'Bendra'}

💡 TAVO STILIUS:
${subjectConfig.style}

📊 MOKINIO PROGRESAS:
- Bendras progresas: ${userProgress.overallProgress || 0}%
- Silpnos sritys: ${userProgress.weakAreas?.join(', ') || 'Nėra'}

📝 INSTRUKCIJOS:
1. Tu esi EKSPERTAS ${grade ? grade + ' klasės' : ''} ${subjectName} srityje - mokyk giliai ir išsamiai
2. Naudok pavyzdžius ir analogijas iš kasdienio gyvenimo
3. Jei mokinys klausia apie konkrečią temą, nurodyk kur ji yra mokymo programoje (pvz., "Ši tema priklauso Mechanikos skyriui, Kinematikos poskyriui")
4. Naudok tinkamas formules iš mokymo programos
5. Užduok klausimus patikrinti supratimą
6. Būk kantriai ir draugiškas
7. Jei reikia, pateik formules, diagramas ir skaičiavimo pavyzdžius
8. Atsakyk LIETUVIŠKAI
9. Būk išsamus - galite rašyti ilgus atsakymus kai reikia paaiškinti
10. Fokusuokis į ${grade || 11} klasės mokymo programos temas ir tikslus
11. Jei mokinys klausia apie KĄ NORS ne tavo srityje, mandagiai nukreipk atgal į dashboard`;
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
  // Handle case when userProgress is null/undefined
  const recommendations = [
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

  // Add subject-specific recommendations if userProgress is available
  if (userProgress && userProgress.subjects && userProgress.subjects.length > 0) {
    const lowProgressSubjects = userProgress.subjects.filter(s => (s.progress || 0) < 50);
    if (lowProgressSubjects.length > 0) {
      lowProgressSubjects.slice(0, 2).forEach(subject => {
        recommendations.push({
          type: 'focus',
          title: `Sutelkite dėmesį į ${subject.name}`,
          description: `Jūsų ${subject.name} progresas yra ${subject.progress || 0}%. Rekomenduojame daugiau laiko skirti šiai temai.`,
          subject: subject.name,
          priority: 'high',
          estimatedTime: '45-60 min',
          reason: `Žemas progresas (${subject.progress || 0}%)`
        });
      });
    }
  }

  return recommendations;
}

