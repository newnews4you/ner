import db, { initDatabase } from './db-new.js';
import { v4 as uuidv4 } from 'uuid';

// 11 klasės (III gimnazijos) Lietuvos švietimo sistemos programa
// Pagal oficialias bendrąsias programas iš emokykla.lt

const subjects = [
    {
        name: "Anglų kalba",
        teacher: "AI Mokytojas • Anglų k.",
        grade: 11,
        gradient: "gradient-purple-pink",
        iconName: "BookOpen",
        currentTopic: "Reading Comprehension",
        nextAssessment: "2025 m. sausio 15 d.",
        topics: [
            // B2 lygis - 15 temų
            { title: "Present Perfect and Past Perfect", description: "Tobulojo laiko formos ir jų vartojimas", duration: "45 min" },
            { title: "Conditional Sentences (Type 1, 2, 3)", description: "Sąlygos sakiniai ir jų struktūra", duration: "50 min" },
            { title: "Passive Voice", description: "Neveikiamoji rūšis įvairiuose laikuose", duration: "45 min" },
            { title: "Modal Verbs (must, should, could, might)", description: "Modaliniai veiksmažodžiai ir jų reikšmės", duration: "40 min" },
            { title: "Reading Comprehension - Literary Texts", description: "Grožinių tekstų skaitymas ir analizė", duration: "55 min" },
            { title: "Reading Comprehension - Articles and Essays", description: "Straipsnių ir esė skaitymas", duration: "50 min" },
            { title: "Formal Letter Writing", description: "Oficialių laiškų rašymas", duration: "45 min" },
            { title: "Essay Writing - Opinion Essays", description: "Nuomonės esė rašymas", duration: "60 min" },
            { title: "Essay Writing - For and Against Essays", description: "Argumentų už ir prieš esė", duration: "55 min" },
            { title: "Report Writing", description: "Ataskaitų rašymas", duration: "50 min" },
            { title: "Speaking - Presentations", description: "Pristatymai ir kalbėjimas viešai", duration: "45 min" },
            { title: "Speaking - Discussions and Debates", description: "Diskusijos ir debatai", duration: "50 min" },
            { title: "Academic Vocabulary", description: "Akademinis žodynas", duration: "40 min" },
            { title: "Environment and Ecology", description: "Aplinka, ekologija, globalinis atšilimas", duration: "45 min" },
            { title: "Culture and Society", description: "Kultūra, visuomenė, teisingumas", duration: "45 min" },
        ],
    },
    {
        name: "Informatika",
        teacher: "AI Mokytojas • Informatika",
        grade: 11,
        gradient: "gradient-cyan-blue",
        iconName: "Monitor",
        currentTopic: "C++ Pagrindai",
        nextAssessment: "2025 m. sausio 20 d.",
        topics: [
            // C++ programavimas - 14 temų
            { title: "Įvadas į C++ programavimą", description: "C++ kalbos pagrindai, kompiliavimas", duration: "50 min" },
            { title: "Kintamieji ir duomenų tipai", description: "int, float, double, char, bool tipai", duration: "45 min" },
            { title: "Įvestis ir išvestis (cin, cout)", description: "Duomenų įvedimas ir išvedimas", duration: "40 min" },
            { title: "Aritmetiniai ir loginiai operatoriai", description: "Matematinės ir loginės operacijos", duration: "45 min" },
            { title: "Sąlygos sakiniai (if, else, switch)", description: "Sprendimų priėmimas programoje", duration: "50 min" },
            { title: "Ciklai (for, while, do-while)", description: "Kartojimų struktūros", duration: "55 min" },
            { title: "Masyvai", description: "Vienmačiai ir daugiamačiai masyvai", duration: "60 min" },
            { title: "Funkcijos", description: "Funkcijų kūrimas ir kvietimas", duration: "55 min" },
            { title: "Simbolių eilutės (string)", description: "Darbas su tekstiniais duomenimis", duration: "50 min" },
            { title: "Algoritmų sudarymas", description: "Algoritminės užduotys ir jų sprendimas", duration: "60 min" },
            { title: "Rikiavimo algoritmai", description: "Bubble sort, Selection sort", duration: "55 min" },
            { title: "Paieškos algoritmai", description: "Linijinė ir dvejetainė paieška", duration: "50 min" },
            { title: "Failų skaitymas ir rašymas", description: "Darbas su failais C++", duration: "55 min" },
            { title: "Praktinės užduotys", description: "Sudėtingesnių programų kūrimas", duration: "70 min" },
        ],
    },
    {
        name: "Fizika",
        teacher: "AI Mokytojas • Fizika",
        grade: 11,
        gradient: "gradient-orange-red",
        iconName: "Atom",
        currentTopic: "Mechanika",
        nextAssessment: "2025 m. sausio 12 d.",
        topics: [
            // Fizika - 16 temų
            { title: "Judėjimas. Kinematika", description: "Tolygus ir kintamas judėjimas", duration: "50 min" },
            { title: "Tolygiai greitėjantis judėjimas", description: "Pagreitis, greičio ir kelio skaičiavimas", duration: "55 min" },
            { title: "Horizontaliai mesto kūno judėjimas", description: "Parabolinis judėjimas", duration: "60 min" },
            { title: "Niutono dėsniai", description: "Trys Niutono dėsniai ir jų taikymas", duration: "55 min" },
            { title: "Jėgos. Trinties jėga", description: "Įvairios jėgos ir jų skaičiavimas", duration: "50 min" },
            { title: "Gravitacija ir laisvasis kritimas", description: "Gravitacijos dėsnis, laisvojo kritimo greitis", duration: "55 min" },
            { title: "Mechaninė energija", description: "Kinetinė ir potencinė energija", duration: "50 min" },
            { title: "Darbas ir galingumus", description: "Mechaninio darbo skaičiavimas", duration: "45 min" },
            { title: "Impulso tvermės dėsnis", description: "Impulsas ir jo tvermė", duration: "50 min" },
            { title: "Termodinamika. Šiluma", description: "Temperatūra, šiluma, vidinė energija", duration: "55 min" },
            { title: "Dujų dėsniai", description: "Boilio-Marioto, Gei-Liusako dėsniai", duration: "50 min" },
            { title: "Elektrostatika", description: "Elektros krūvis, elektrinis laukas", duration: "55 min" },
            { title: "Kulono dėsnis", description: "Elektrinių jėgų skaičiavimas", duration: "45 min" },
            { title: "Elektros srovė", description: "Srovės stipris, įtampa, varža", duration: "50 min" },
            { title: "Omo dėsnis", description: "Omo dėsnis grandinės daliai ir visai grandinei", duration: "50 min" },
            { title: "Elektros grandinės", description: "Nuoseklus ir lygiagretus jungimas", duration: "55 min" },
        ],
    },
    {
        name: "Ekonomika",
        teacher: "AI Mokytojas • Ekonomika",
        grade: 11,
        gradient: "gradient-green-teal",
        iconName: "TrendingUp",
        currentTopic: "Mikroekonomika",
        nextAssessment: "2025 m. sausio 18 d.",
        topics: [
            // Ekonomika - 12 temų
            { title: "Ekonomikos mokslo raida", description: "Ekonomika kaip mokslas, ryšiai su kitais mokslais", duration: "40 min" },
            { title: "Ištekliai ir gamybos galimybės", description: "Išteklių ribotumas, gamybos galimybių kreivė", duration: "50 min" },
            { title: "Pasiūla ir paklausa", description: "Paklausos ir pasiūlos dėsniai", duration: "55 min" },
            { title: "Rinkos pusiausvyra", description: "Pusiausvyros kaina ir kiekis", duration: "50 min" },
            { title: "Elastingumas", description: "Paklausos ir pasiūlos elastingumas", duration: "55 min" },
            { title: "Vartotojo elgsena", description: "Naudingumas, vartotojo pasirinkimas", duration: "50 min" },
            { title: "Gamybos kaštai", description: "Fiksuoti ir kintami kaštai", duration: "45 min" },
            { title: "Rinkos struktūros", description: "Konkurencija, monopolija, oligopolija", duration: "55 min" },
            { title: "BVP ir ekonomikos augimas", description: "Bendrasis vidaus produktas", duration: "50 min" },
            { title: "Infliacija ir nedarbas", description: "Kainų kilimas, nedarbo rūšys", duration: "55 min" },
            { title: "Pinigai ir bankų sistema", description: "Pinigų funkcijos, centrinis bankas", duration: "50 min" },
            { title: "Tarptautinė prekyba", description: "Eksportas, importas, prekybos balansas", duration: "50 min" },
        ],
    },
    {
        name: "Istorija",
        teacher: "AI Mokytojas • Istorija",
        grade: 11,
        gradient: "gradient-indigo-purple",
        iconName: "Globe",
        currentTopic: "Lietuvos istorija",
        nextAssessment: "2025 m. sausio 14 d.",
        topics: [
            // Istorija - 14 temų
            { title: "Lietuvos Didžioji Kunigaikštystė", description: "LDK susikūrimas ir raida", duration: "55 min" },
            { title: "Mindaugo karūnavimas", description: "Lietuvos valstybės įkūrimas", duration: "50 min" },
            { title: "Žalgirio mūšis", description: "1410 m. mūšis ir jo reikšmė", duration: "55 min" },
            { title: "Liublino unija", description: "1569 m. unija ir jos pasekmės", duration: "50 min" },
            { title: "Lietuvos statutai", description: "Teisės aktai LDK", duration: "45 min" },
            { title: "Reformacija ir kontrreformacija", description: "Religiniai pokyčiai Lietuvoje", duration: "50 min" },
            { title: "Abiejų Tautų Respublika", description: "Politinė santvarka", duration: "55 min" },
            { title: "Lietuvos padalinimai", description: "XVIII a. pabaigos įvykiai", duration: "50 min" },
            { title: "1863 m. sukilimas", description: "Sukilimas prieš Rusijos imperiją", duration: "55 min" },
            { title: "Tarpukario Lietuva", description: "Nepriklausomybė 1918-1940", duration: "60 min" },
            { title: "Pasauliniai karai", description: "I ir II pasauliniai karai", duration: "60 min" },
            { title: "Šaltasis karas", description: "Pasaulio pasidalijimas po II PK", duration: "55 min" },
            { title: "Lietuvos nepriklausomybės atkūrimas", description: "1990 m. kovo 11 d.", duration: "50 min" },
            { title: "Šiuolaikinė Lietuva", description: "Lietuva ES ir NATO", duration: "45 min" },
        ],
    },
    {
        name: "Geografija",
        teacher: "AI Mokytojas • Geografija",
        grade: 11,
        gradient: "gradient-yellow-orange",
        iconName: "Map",
        currentTopic: "Lietuvos geografija",
        nextAssessment: "2025 m. sausio 22 d.",
        topics: [
            // Geografija - 13 temų
            { title: "Geografinė erdvė ir orientavimasis", description: "Žemėlapiai, koordinatės", duration: "45 min" },
            { title: "Lietuvos geografinė padėtis", description: "Lietuvos vieta Europoje", duration: "50 min" },
            { title: "Lietuvos reljefas", description: "Aukštumos, žemumos, kalvos", duration: "55 min" },
            { title: "Lietuvos klimatas", description: "Klimato ypatybės, sezonai", duration: "50 min" },
            { title: "Lietuvos vandenys", description: "Upės, ežerai, jūra", duration: "50 min" },
            { title: "Lietuvos gamtiniai ištekliai", description: "Mineralai, miškai, dirvožemis", duration: "45 min" },
            { title: "Europos fizinė geografija", description: "Europos reljefas ir klimatas", duration: "55 min" },
            { title: "Europos ekonominė geografija", description: "Pramonė, žemės ūkis, paslaugos", duration: "60 min" },
            { title: "Pasaulio klimato juostos", description: "Klimato tipai ir jų ypatybės", duration: "50 min" },
            { title: "Pasaulio gamtiniai ištekliai", description: "Energetiniai ir mineraliniai ištekliai", duration: "55 min" },
            { title: "Gyventojų geografija", description: "Gyventojų skaičius, tankis, migracija", duration: "50 min" },
            { title: "Aplinkosauga", description: "Ekologinės problemos", duration: "55 min" },
            { title: "Klimato kaita", description: "Globalinis atšilimas ir jo pasekmės", duration: "60 min" },
        ],
    },
];

async function seed() {
    try {
        console.log('🌱 Seeding database with 11th grade Lithuanian curriculum...');

        // Drop existing tables to force schema update
        await db.run('DROP TABLE IF EXISTS subjects');
        await db.run('DROP TABLE IF EXISTS topics');
        console.log('🗑️  Dropped existing tables to ensure new schema');

        // Initialize database tables (will create new schema)
        await initDatabase();


        // Insert subjects (global - no user_id)
        for (const subject of subjects) {
            const subjectId = uuidv4();

            // Insert subject
            await db.run(`
        INSERT INTO subjects (id, name, teacher, grade, gradient, icon_name, current_topic, next_assessment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [subjectId, subject.name, subject.teacher, subject.grade, subject.gradient, subject.iconName, subject.currentTopic, subject.nextAssessment]);

            // Insert topics
            for (let i = 0; i < subject.topics.length; i++) {
                const topic = subject.topics[i];
                await db.run(`
          INSERT INTO topics (subject_id, title, description, status, duration, score, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [subjectId, topic.title, topic.description || null, 'locked', topic.duration, null, i]);
            }

            console.log(`✅ Created subject: ${subject.name} (${subject.topics.length} topics)`);
        }

        console.log('🎉 Database seeded successfully!');
        console.log(`📚 Total: ${subjects.length} subjects, ${subjects.reduce((sum, s) => sum + s.topics.length, 0)} topics`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
