import { Calculator, Monitor, Atom, BookOpen, Palette, Globe } from "lucide-react";

// Types
export interface Topic {
    id: number;
    title: string;
    description?: string;
    status: 'completed' | 'in-progress' | 'locked';
    duration: string;
    score?: number;
}

export interface Subject {
    id: string;
    name: string;
    teacher: string;
    progress: number;
    grade: number;
    gradient: string;
    iconName: string; // Storing icon name as string for serializability
    currentTopic: string;
    nextAssessment: string;
    pastTopics: Topic[];
}

export interface Material {
    id: string;
    name: string;
    type: 'file' | 'folder';
    size?: string;
    date: string;
    items?: number;
    subjectId?: string;
    topic?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

// Mock Data
const mockSubjects: Subject[] = [
    {
        id: "1",
        name: "Matematika",
        teacher: "AI Mokytojas • Matematika",
        progress: 72,
        grade: 11,
        gradient: "gradient-purple-pink",
        iconName: "Calculator",
        currentTopic: "Diferencialinės lygtys",
        nextAssessment: "2024 m. gruodžio 15 d.",
        pastTopics: [
            { id: 1, title: "Integralai ir jų taikymas", status: 'completed', duration: "45 min", score: 85, description: "Įvadas į integralinį skaičiavimą." },
            { id: 2, title: "Funkcijų ribos", status: 'completed', duration: "38 min", score: 92, description: "Ribų skaičiavimo taisyklės." },
            { id: 3, title: "Išvestinės ir jų geometrinė prasmė", status: 'completed', duration: "52 min", score: 78, description: "Išvestinių taikymas geometrijoje." },
            { id: 4, title: "Trigonometrinės funkcijos", status: 'in-progress', duration: "40 min", description: "Sinusas, kosinusas ir tangentas." },
        ],
    },
    {
        id: "2",
        name: "IT Technologijos",
        teacher: "AI Mokytojas • Informatika",
        progress: 45,
        grade: 11,
        gradient: "gradient-cyan-blue",
        iconName: "Monitor",
        currentTopic: "Python pagrindai",
        nextAssessment: "2024 m. gruodžio 20 d.",
        pastTopics: [
            { id: 1, title: "Kintamieji ir duomenų tipai", status: 'completed', duration: "30 min", score: 95 },
            { id: 2, title: "Sąlygos sakiniai", status: 'completed', duration: "35 min", score: 88 },
            { id: 3, title: "Ciklai ir iteracijos", status: 'in-progress', duration: "42 min" },
            { id: 4, title: "Funkcijos Python'e", status: 'locked', duration: "48 min" },
        ],
    },
    {
        id: "3",
        name: "Fizika",
        teacher: "AI Mokytojas • Fizika",
        progress: 88,
        grade: 11,
        gradient: "gradient-orange-red",
        iconName: "Atom",
        currentTopic: "Niutono dėsniai",
        nextAssessment: "2024 m. gruodžio 12 d.",
        pastTopics: [
            { id: 1, title: "Mechaninė energija", status: 'completed', duration: "40 min", score: 90 },
            { id: 2, title: "Impulso tvermės dėsnis", status: 'completed', duration: "45 min", score: 85 },
            { id: 3, title: "Gravitacija ir laisvasis kritimas", status: 'completed', duration: "38 min", score: 92 },
            { id: 4, title: "Trinties jėgos", status: 'completed', duration: "32 min", score: 88 },
        ],
    },
    {
        id: "4",
        name: "Lietuvių kalba",
        teacher: "AI Mokytojas • Lietuvių k.",
        progress: 61,
        grade: 11,
        gradient: "gradient-green-teal",
        iconName: "BookOpen",
        currentTopic: "Lietuvių literatūros klasika",
        nextAssessment: "2024 m. gruodžio 18 d.",
        pastTopics: [
            { id: 1, title: "Rašytinio darbo struktūra", status: 'completed', duration: "35 min", score: 80 },
            { id: 2, title: "Argumentavimo būdai", status: 'completed', duration: "40 min", score: 85 },
            { id: 3, title: "Stilistinės priemonės", status: 'in-progress', duration: "45 min" },
        ],
    },
    {
        id: "5",
        name: "Dailė",
        teacher: "AI Mokytojas • Dailė",
        progress: 34,
        grade: 11,
        gradient: "gradient-indigo-purple",
        iconName: "Palette",
        currentTopic: "Spalvų teorija ir kompozicija",
        nextAssessment: "2024 m. gruodžio 22 d.",
        pastTopics: [
            { id: 1, title: "Piešimo pagrindai", status: 'completed', duration: "50 min", score: 98 },
            { id: 2, title: "Perspektyva", status: 'completed', duration: "45 min", score: 95 },
            { id: 3, title: "Šešėliavimas", status: 'in-progress', duration: "40 min" },
        ],
    },
    {
        id: "6",
        name: "Istorija",
        teacher: "AI Mokytojas • Istorija",
        progress: 55,
        grade: 11,
        gradient: "gradient-yellow-orange",
        iconName: "Globe",
        currentTopic: "Lietuvos Didžioji Kunigaikštystė",
        nextAssessment: "2024 m. gruodžio 14 d.",
        pastTopics: [
            { id: 1, title: "Mindaugo karūnavimas", status: 'completed', duration: "40 min", score: 88 },
            { id: 2, title: "Žalgirio mūšis", status: 'completed', duration: "50 min", score: 92 },
            { id: 3, title: "Liublino unija", status: 'in-progress', duration: "45 min" },
        ],
    },
];

const mockMaterials: Material[] = [
    { id: '1', name: 'Matematika', type: 'folder', items: 12, date: '2024-03-20', subjectId: '1' },
    { id: '2', name: 'Fizika', type: 'folder', items: 8, date: '2024-03-19', subjectId: '3' },
    { id: '3', name: 'Formulės.pdf', type: 'file', size: '2.4 MB', date: '2024-03-18', subjectId: '1', topic: 'Integralai' },
    { id: '4', name: 'Python Cheat Sheet.pdf', type: 'file', size: '1.2 MB', date: '2024-03-21', subjectId: '2', topic: 'Python pagrindai' },
];

// API Service
export const api = {
    subjects: {
        getAll: async (): Promise<Subject[]> => {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
            return [...mockSubjects];
        },
        getById: async (id: string): Promise<Subject | undefined> => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockSubjects.find(s => s.id === id);
        }
    },
    materials: {
        getAll: async (subjectId?: string, topic?: string): Promise<Material[]> => {
            await new Promise(resolve => setTimeout(resolve, 600));
            let filtered = [...mockMaterials];
            if (subjectId && subjectId !== 'all') {
                filtered = filtered.filter(m => m.subjectId === subjectId);
            }
            if (topic) {
                filtered = filtered.filter(m => m.topic === topic);
            }
            return filtered;
        },
        upload: async (file: File, subjectId?: string, topic?: string): Promise<Material> => {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newMaterial: Material = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: 'file',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                date: new Date().toISOString().split('T')[0],
                subjectId,
                topic
            };
            mockMaterials.push(newMaterial);
            return newMaterial;
        }
    }
};
