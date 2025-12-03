import { useState, useMemo, useEffect } from "react";
import { Upload, File, Folder, MoreVertical, Search, Plus, X, Filter, Loader2 } from "lucide-react";
import { api, Material } from "@/services/api";



interface MaterialsManagerProps {
    subjects?: { id: string; name: string }[];
    initialSubject?: string;
    initialTopic?: string;
}

const MaterialsManager = ({ subjects = [], initialSubject, initialTopic }: MaterialsManagerProps) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || "all");
    const [selectedType, setSelectedType] = useState<string>("all");

    useEffect(() => {
        const fetchMaterials = async () => {
            setIsLoading(true);
            try {
                const data = await api.materials.getAll(selectedSubject === 'all' ? undefined : selectedSubject);
                setMaterials(data);
            } catch (error) {
                console.error("Failed to fetch materials:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, [selectedSubject]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            // Upload first file as an example
            try {
                const newMaterial = await api.materials.upload(
                    files[0],
                    selectedSubject === 'all' ? undefined : selectedSubject
                );
                setMaterials(prev => [...prev, newMaterial]);
            } catch (error) {
                console.error("Upload failed:", error);
            }
        }
    };

    const filteredMaterials = useMemo(() => {
        return materials.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'all' ||
                (selectedType === 'files' && item.type === 'file') ||
                (selectedType === 'folders' && item.type === 'folder');

            return matchesSearch && matchesType;
        });
    }, [materials, searchQuery, selectedType]);

    return (
        <div className="h-full flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Mokymosi medžiaga</h2>
                    <p className="text-sm text-muted-foreground">Tvarkykite savo dokumentus ir užrašus</p>
                </div>
                <button
                    onClick={() => {
                        // Simulate file upload click
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                                const newMaterial = await api.materials.upload(
                                    file,
                                    selectedSubject === 'all' ? undefined : selectedSubject
                                );
                                setMaterials(prev => [...prev, newMaterial]);
                            }
                        };
                        input.click();
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl gradient-cyan-blue text-white font-medium hover:opacity-90 transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Įkelti failą</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ieškoti medžiagos..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/30 border border-white/5 focus:outline-none focus:border-primary/50 text-foreground transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {subjects.length > 0 && (
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-3 py-2.5 rounded-xl bg-secondary/30 border border-white/5 text-foreground focus:outline-none focus:border-primary/50 text-sm"
                        >
                            <option value="all">Visi kursai</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id.toString()}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-secondary/30 border border-white/5 text-foreground focus:outline-none focus:border-primary/50 text-sm"
                    >
                        <option value="all">Visi tipai</option>
                        <option value="files">Failai</option>
                        <option value="folders">Aplankai</option>
                    </select>
                </div>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 mb-8 text-center transition-all ${isDragging
                    ? 'border-primary bg-primary/10 scale-[1.02]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
            >
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    {isDragging ? 'Paleiskite failus čia' : 'Tempkite failus čia'}
                </h3>
                <p className="text-sm text-muted-foreground">
                    arba spauskite mygtuką viršuje
                </p>
            </div>

            {/* Materials List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMaterials.map((item) => (
                        <div
                            key={item.id}
                            className="group p-4 rounded-xl bg-secondary/30 border border-white/5 hover:bg-secondary/50 hover:border-white/10 transition-all cursor-pointer relative"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 rounded-lg ${item.type === 'folder' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                    }`}>
                                    {item.type === 'folder' ? <Folder className="w-6 h-6" /> : <File className="w-6 h-6" />}
                                </div>
                                <button className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <h4 className="font-medium text-foreground mb-1 truncate">{item.name}</h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{item.type === 'folder' ? `${item.items} elementai` : item.size}</span>
                                <span>{item.date}</span>
                            </div>
                            {item.topic && (
                                <div className="mt-2 text-xs text-primary/80 bg-primary/10 px-2 py-1 rounded-md inline-block">
                                    {item.topic}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MaterialsManager;
