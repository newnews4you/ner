import config from '@/config';

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
    iconName: string;
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

// Get user ID from localStorage or use default
const getUserId = (): string => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            return user.id || '1';
        } catch {
            return '1';
        }
    }
    return '1';
};

// API base URL - Always use Render backend (hardcoded to ensure it works)
// Directly use Render URL to avoid any config issues
const API_URL = 'https://ner-nu07.onrender.com';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const userId = getUserId();
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
};

// API Service
export const api = {
    subjects: {
        getAll: async (): Promise<Subject[]> => {
            try {
                const data = await apiCall('/api/subjects');
                // Transform database format to frontend format
                return data.map((s: any) => ({
                    id: s.id,
                    name: s.name,
                    teacher: s.teacher,
                    progress: s.progress || 0,
                    grade: s.grade,
                    gradient: s.gradient,
                    iconName: s.icon_name,
                    currentTopic: s.current_topic || '',
                    nextAssessment: s.next_assessment || '',
                    pastTopics: s.pastTopics || []
                }));
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
                // Fallback to empty array
                return [];
            }
        },
        getById: async (id: string): Promise<Subject | undefined> => {
            try {
                const data = await apiCall(`/api/subjects/${id}`);
                return {
                    id: data.id,
                    name: data.name,
                    teacher: data.teacher,
                    progress: data.progress || 0,
                    grade: data.grade,
                    gradient: data.gradient,
                    iconName: data.icon_name,
                    currentTopic: data.current_topic || '',
                    nextAssessment: data.next_assessment || '',
                    pastTopics: data.pastTopics || []
                };
            } catch (error) {
                console.error('Failed to fetch subject:', error);
                return undefined;
            }
        }
    },
    materials: {
        getAll: async (subjectId?: string, topic?: string): Promise<Material[]> => {
            try {
                const params = new URLSearchParams();
                if (subjectId && subjectId !== 'all') params.append('subjectId', subjectId);
                if (topic) params.append('topicId', topic);
                
                const data = await apiCall(`/api/materials?${params.toString()}`);
                return data.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    type: m.type,
                    size: m.size,
                    date: m.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                    items: m.items,
                    subjectId: m.subject_id,
                    topic: topic || undefined
                }));
            } catch (error) {
                console.error('Failed to fetch materials:', error);
                return [];
            }
        },
        upload: async (file: File, subjectId?: string, topic?: string): Promise<Material> => {
            try {
                const userId = getUserId();
                const formData = new FormData();
                formData.append('file', file);
                if (subjectId) formData.append('subjectId', subjectId);
                if (topic) formData.append('topicId', topic);

                const response = await fetch(`${API_URL}/api/materials/upload`, {
                    method: 'POST',
                    headers: {
                        'x-user-id': userId,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                return {
                    id: data.id,
                    name: data.name,
                    type: data.type,
                    size: data.size,
                    date: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                    subjectId: data.subject_id,
                    topic: topic || undefined
                };
            } catch (error) {
                console.error('Failed to upload file:', error);
                throw error;
            }
        }
    },
    ai: {
        // Guide chat - main dashboard assistant
        chatGuide: async (message: string): Promise<string> => {
            try {
                const data = await apiCall('/api/ai/chat', {
                    method: 'POST',
                    body: JSON.stringify({ message, mode: 'guide' }),
                });
                return data.response;
            } catch (error) {
                console.error('Failed to get AI response:', error);
                throw error;
            }
        },
        // Subject-specific tutor chat
        chatTutor: async (message: string, subjectName: string, topic?: string): Promise<string> => {
            try {
                const data = await apiCall('/api/ai/chat', {
                    method: 'POST',
                    body: JSON.stringify({ message, mode: 'tutor', subjectName, topic }),
                });
                return data.response;
            } catch (error) {
                console.error('Failed to get AI response:', error);
                throw error;
            }
        },
        // Legacy method for backwards compatibility
        chat: async (message: string, subjectId?: string, topic?: string): Promise<string> => {
            try {
                const data = await apiCall('/api/ai/chat', {
                    method: 'POST',
                    body: JSON.stringify({ message, subjectId, topic }),
                });
                return data.response;
            } catch (error) {
                console.error('Failed to get AI response:', error);
                throw error;
            }
        },
        getRecommendations: async (subjectId?: string): Promise<any[]> => {
            try {
                const params = subjectId ? `?subjectId=${subjectId}` : '';
                const data = await apiCall(`/api/ai/recommendations${params}`);
                return data.recommendations || [];
            } catch (error) {
                console.error('Failed to get recommendations:', error);
                return [];
            }
        },
        generatePractice: async (subject: string, topic: string, difficulty: string = 'medium', count: number = 5): Promise<any[]> => {
            try {
                const data = await apiCall('/api/ai/practice', {
                    method: 'POST',
                    body: JSON.stringify({ subject, topic, difficulty, count }),
                });
                return data.questions || [];
            } catch (error) {
                console.error('Failed to generate practice:', error);
                return [];
            }
        },
        generateLearningPath: async (subject: string, currentLevel: number = 0): Promise<any[]> => {
            try {
                const data = await apiCall('/api/ai/learning-path', {
                    method: 'POST',
                    body: JSON.stringify({ subject, currentLevel }),
                });
                return data.steps || [];
            } catch (error) {
                console.error('Failed to generate learning path:', error);
                return [];
            }
        }
    }
};
