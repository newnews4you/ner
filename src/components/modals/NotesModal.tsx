import { useState } from "react";
import { X, Save, Plus, Trash2, Edit2 } from "lucide-react";

interface Note {
    id: string;
    content: string;
    timestamp: string;
}

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    topicTitle: string;
}

const NotesModal = ({ isOpen, onClose, topicTitle }: NotesModalProps) => {
    const [notes, setNotes] = useState<Note[]>([
        { id: '1', content: "Svarbi formulė: E = mc^2", timestamp: "2024-03-20 14:30" },
        { id: '2', content: "Pasikartoti 3 skyrių", timestamp: "2024-03-21 09:15" }
    ]);
    const [newNote, setNewNote] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    if (!isOpen) return null;

    const addNote = () => {
        if (!newNote.trim()) return;

        const note: Note = {
            id: Date.now().toString(),
            content: newNote,
            timestamp: new Date().toLocaleString('lt-LT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        setNotes([note, ...notes]);
        setNewNote("");
        setIsAdding(false);
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md flex flex-col bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden h-[600px]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Užrašai</h2>
                        <p className="text-xs text-gray-500 font-medium">{topicTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                    {isAdding && (
                        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Rašykite pastabą..."
                                className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 resize-none h-24 mb-2"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors text-gray-700"
                                >
                                    Atšaukti
                                </button>
                                <button
                                    onClick={addNote}
                                    className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-black transition-all flex items-center gap-1 shadow-sm active:scale-95"
                                >
                                    <Save className="w-3 h-3" />
                                    Išsaugoti
                                </button>
                            </div>
                        </div>
                    )}

                    {notes.map((note) => (
                        <div key={note.id} className="group bg-white hover:bg-gray-50 rounded-xl p-4 border border-gray-200 transition-all">
                            <p className="text-sm text-gray-900 mb-2 whitespace-pre-wrap">{note.content}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 font-medium">{note.timestamp}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {notes.length === 0 && !isAdding && (
                        <div className="text-center py-12 text-gray-500">
                            <p>Užrašų nėra</p>
                            <p className="text-xs mt-1">Spauskite + norėdami pridėti</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <button
                        onClick={() => setIsAdding(true)}
                        disabled={isAdding}
                        className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Naujas užrašas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;
