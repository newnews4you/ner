import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AllCourses = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F7F7F5] p-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Grįžti atgal
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Visi kursai</h1>
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed">
                    <p className="text-gray-500">Čia bus rodomi visi prieinami kursai.</p>
                </div>
            </div>
        </div>
    );
};

export default AllCourses;
