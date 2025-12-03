import db, { initDatabase } from './db.js';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_USER_ID = '1';

const subjects = [
  {
    name: "Matematika",
    teacher: "AI Mokytojas • Matematika",
    grade: 11,
    gradient: "gradient-purple-pink",
    iconName: "Calculator",
    currentTopic: "Diferencialinės lygtys",
    nextAssessment: "2024 m. gruodžio 15 d.",
    topics: [
      { title: "Integralai ir jų taikymas", status: 'completed', duration: "45 min", score: 85, description: "Įvadas į integralinį skaičiavimą." },
      { title: "Funkcijų ribos", status: 'completed', duration: "38 min", score: 92, description: "Ribų skaičiavimo taisyklės." },
      { title: "Išvestinės ir jų geometrinė prasmė", status: 'completed', duration: "52 min", score: 78, description: "Išvestinių taikymas geometrijoje." },
      { title: "Trigonometrinės funkcijos", status: 'in-progress', duration: "40 min", description: "Sinusas, kosinusas ir tangentas." },
    ],
  },
  {
    name: "IT Technologijos",
    teacher: "AI Mokytojas • Informatika",
    grade: 11,
    gradient: "gradient-cyan-blue",
    iconName: "Monitor",
    currentTopic: "Python pagrindai",
    nextAssessment: "2024 m. gruodžio 20 d.",
    topics: [
      { title: "Kintamieji ir duomenų tipai", status: 'completed', duration: "30 min", score: 95 },
      { title: "Sąlygos sakiniai", status: 'completed', duration: "35 min", score: 88 },
      { title: "Ciklai ir iteracijos", status: 'in-progress', duration: "42 min" },
      { title: "Funkcijos Python'e", status: 'locked', duration: "48 min" },
    ],
  },
  {
    name: "Fizika",
    teacher: "AI Mokytojas • Fizika",
    grade: 11,
    gradient: "gradient-orange-red",
    iconName: "Atom",
    currentTopic: "Niutono dėsniai",
    nextAssessment: "2024 m. gruodžio 12 d.",
    topics: [
      { title: "Mechaninė energija", status: 'completed', duration: "40 min", score: 90 },
      { title: "Impulso tvermės dėsnis", status: 'completed', duration: "45 min", score: 85 },
      { title: "Gravitacija ir laisvasis kritimas", status: 'completed', duration: "38 min", score: 92 },
      { title: "Trinties jėgos", status: 'completed', duration: "32 min", score: 88 },
    ],
  },
  {
    name: "Lietuvių kalba",
    teacher: "AI Mokytojas • Lietuvių k.",
    grade: 11,
    gradient: "gradient-green-teal",
    iconName: "BookOpen",
    currentTopic: "Lietuvių literatūros klasika",
    nextAssessment: "2024 m. gruodžio 18 d.",
    topics: [
      { title: "Rašytinio darbo struktūra", status: 'completed', duration: "35 min", score: 80 },
      { title: "Argumentavimo būdai", status: 'completed', duration: "40 min", score: 85 },
      { title: "Stilistinės priemonės", status: 'in-progress', duration: "45 min" },
    ],
  },
  {
    name: "Dailė",
    teacher: "AI Mokytojas • Dailė",
    grade: 11,
    gradient: "gradient-indigo-purple",
    iconName: "Palette",
    currentTopic: "Spalvų teorija ir kompozicija",
    nextAssessment: "2024 m. gruodžio 22 d.",
    topics: [
      { title: "Piešimo pagrindai", status: 'completed', duration: "50 min", score: 98 },
      { title: "Perspektyva", status: 'completed', duration: "45 min", score: 95 },
      { title: "Šešėliavimas", status: 'in-progress', duration: "40 min" },
    ],
  },
  {
    name: "Istorija",
    teacher: "AI Mokytojas • Istorija",
    grade: 11,
    gradient: "gradient-yellow-orange",
    iconName: "Globe",
    currentTopic: "Lietuvos Didžioji Kunigaikštystė",
    nextAssessment: "2024 m. gruodžio 14 d.",
    topics: [
      { title: "Mindaugo karūnavimas", status: 'completed', duration: "40 min", score: 88 },
      { title: "Žalgirio mūšis", status: 'completed', duration: "50 min", score: 92 },
      { title: "Liublino unija", status: 'in-progress', duration: "45 min" },
    ],
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');
    
    // Initialize database tables
    await initDatabase();
    
    // Create default user if not exists
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [DEFAULT_USER_ID]);
    if (!existingUser) {
      await db.run(`
        INSERT INTO users (id, email, name, provider)
        VALUES (?, ?, ?, ?)
      `, [DEFAULT_USER_ID, 'demo@example.com', 'Demo Vartotojas', 'email']);
      console.log('✅ Created default user');
    }
    
    // Clear existing subjects for this user
    await db.run('DELETE FROM subjects WHERE user_id = ?', [DEFAULT_USER_ID]);
    await db.run('DELETE FROM progress WHERE user_id = ?', [DEFAULT_USER_ID]);
    console.log('🗑️ Cleared existing data');
    
    // Insert subjects
    for (const subject of subjects) {
      const subjectId = uuidv4();
      
      // Insert subject
      await db.run(`
        INSERT INTO subjects (id, user_id, name, teacher, grade, gradient, icon_name, current_topic, next_assessment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [subjectId, DEFAULT_USER_ID, subject.name, subject.teacher, subject.grade, subject.gradient, subject.iconName, subject.currentTopic, subject.nextAssessment]);
      
      // Calculate progress based on completed topics
      const completedTopics = subject.topics.filter(t => t.status === 'completed').length;
      const totalTopics = subject.topics.length;
      const progressPercentage = Math.round((completedTopics / totalTopics) * 100);
      
      // Insert progress
      await db.run(`
        INSERT INTO progress (id, user_id, subject_id, progress_percentage)
        VALUES (?, ?, ?, ?)
      `, [uuidv4(), DEFAULT_USER_ID, subjectId, progressPercentage]);
      
      // Insert topics
      for (let i = 0; i < subject.topics.length; i++) {
        const topic = subject.topics[i];
        await db.run(`
          INSERT INTO topics (subject_id, title, description, status, duration, score, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [subjectId, topic.title, topic.description || null, topic.status, topic.duration, topic.score || null, i]);
      }
      
      console.log(`✅ Created subject: ${subject.name} (${progressPercentage}% progress)`);
    }
    
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

