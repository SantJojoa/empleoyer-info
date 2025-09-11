import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SubscriptionSelector from "./SubscriptionSelector";
import { useUser } from "../contexts/UserContext";



export default function RegisterForm() {
    const navigate = useNavigate();
    const { login } = useUser();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: "",
    });

    const [showSubscription, setShowSubscription] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // 1️⃣ Registrar usuario
            await axios.post("http://localhost:3000/users/register", form);
            alert("Usuario registrado correctamente");

            // 2️⃣ Login automático
            const loginRes = await axios.post("http://localhost:3000/users/login", {
                email: form.email,
                password: form.password,
            });

            // 3️⃣ Guardar en contexto
            login(loginRes.data.user, loginRes.data.token);

            // 4️⃣ Preguntar si quiere suscribirse
            const wantsPlan = window.confirm("¿Desea suscribirse a un plan?");
            if (wantsPlan) {
                setShowSubscription(true);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            alert("Error al registrar o iniciar sesión del usuario");
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {!showSubscription ? (
                <div className="max-w-md w-full space-y-8">
                    <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-[1.02] transition-all duration-300">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                    Crear Cuenta
                                </h2>
                                <p className="text-gray-300 text-sm">Únete a nuestra plataforma</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Nombre</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Tu nombre"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Apellido</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Tu apellido"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-300">Correo electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="••••••••"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pr-12 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Confirmar</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pr-12 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Teléfono</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        placeholder="+1 234 567 8900"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Fecha de nacimiento</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={form.birthDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 text-gray-300"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                            >
                                Crear Cuenta
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <SubscriptionSelector userEmail={form.email!} selectedPlan={selectedPlan ?? ''} setSelectedPlan={(plan: string) => setSelectedPlan(plan)} />
            )}
        </div>



    )
}