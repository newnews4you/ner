import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useState } from "react";

const Search = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchParams({ q: query });
    };

    return (
        <div className="min-h-screen bg-[#F7F7F5] p-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Grįžti atgal
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Paieška</h1>

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ieškoti visur..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-sm"
                            autoFocus
                        />
                    </div>
                </form>

                <div className="bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed">
                    <p className="text-gray-500">
                        {query ? `Rezultatai paieškai: "${query}"` : "Įveskite užklausą norėdami ieškoti."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Search;
