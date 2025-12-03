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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 overflow-hidden glass rounded-2xl border border-white/10 shadow-2xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Sukurti paskyrą ✨</h2>
                    <p className="text-sm text-muted-foreground">Pradėkite savo kelionę su AI mokytoju</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Vardas</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="Jūsų vardas"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground ml-1">El. paštas</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="vardas@pavyzdys.lt"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Slaptažodis</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl gradient-cyan-blue text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Registruotis
                    </button>
                </form>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Jau turite paskyrą?{" "}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                        Prisijungti
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterModal;
