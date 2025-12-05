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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Mokymosi medžiaga</h2>
                    <p className="text-sm text-gray-500 mt-1">Tvarkykite savo dokumentus ir užrašus vienoje vietoje</p>
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
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span>Įkelti failą</span>
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ieškoti medžiagos..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-gray-900 text-sm transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {subjects.length > 0 && (
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="pl-9 pr-8 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <option value="all">Visi kursai</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id.toString()}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="pl-9 pr-8 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <option value="all">Visi tipai</option>
                            <option value="files">Failai</option>
                            <option value="folders">Aplankai</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border border-dashed rounded-xl p-10 mb-8 text-center transition-all duration-300 ${isDragging
                    ? 'border-blue-400 bg-blue-50/50 scale-[1.01]'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
                    }`}
            >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                    {isDragging ? 'Paleiskite failus čia' : 'Tempkite failus čia'}
                </h3>
                <p className="text-xs text-gray-500">
                    Maksimalus failo dydis 10MB
                </p>
            </div>

            {/* Materials List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMaterials.map((item) => (
                        <div
                            key={item.id}
                            className="group p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2.5 rounded-lg ${item.type === 'folder' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                    }`}>
                                    {item.type === 'folder' ? <Folder className="w-5 h-5" /> : <File className="w-5 h-5" />}
                                </div>
                                <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">{item.name}</h4>
                            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                                <span>{item.type === 'folder' ? `${item.items} elementai` : item.size}</span>
                                <span>{item.date}</span>
                            </div>
                            {item.topic && (
                                <div className="mt-3 text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block border border-gray-200">
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
