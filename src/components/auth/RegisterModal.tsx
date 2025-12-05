import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register, isLoading } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(email, password, name);
            onClose();
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sukurti paskyrą ✨</h2>
                    <p className="text-sm text-gray-500">Pradėkite savo kelionę su AI mokytoju</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 ml-1">Vardas</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="Jūsų vardas"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 ml-1">El. paštas</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="vardas@pavyzdys.lt"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 ml-1">Slaptažodis</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-6 active:scale-95"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Registruotis
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    Jau turite paskyrą?{" "}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Prisijungti
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterModal;
