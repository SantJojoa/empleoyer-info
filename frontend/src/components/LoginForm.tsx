import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { validateEmail, validatePassword, sanitizeInput } from "../utils/validations";
import { useTimeout } from "../hooks/useTimeout";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useUser();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({
        email: "",
        password: "",
    });
    const [touchedFields, setTouchedFields] = useState({
        email: false,
        password: false,
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const { createTimeout, clearTimeout } = useTimeout();

    // Validación en tiempo real solo para campos tocados
    useEffect(() => {
        const emailValidation = validateEmail(form.email);
        const passwordValidation = validatePassword(form.password);

        setValidationErrors({
            email: touchedFields.email && !emailValidation.isValid ? emailValidation.message : "",
            password: touchedFields.password && !passwordValidation.isValid ? passwordValidation.message : "",
        });

        setIsFormValid(emailValidation.isValid && passwordValidation.isValid && form.email.trim() !== "" && form.password.trim() !== "");
    }, [form.email, form.password, touchedFields]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = sanitizeInput(value);

        setForm({ ...form, [name]: sanitizedValue });
        setError(""); // Limpiar error al escribir

        // Marcar el campo como tocado cuando el usuario empieza a escribir
        if (!touchedFields[name as keyof typeof touchedFields]) {
            setTouchedFields(prev => ({
                ...prev,
                [name]: true
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validación final antes de enviar
        if (!isFormValid) {
            setError("Por favor, completa todos los campos correctamente");
            return;
        }

        setIsLoading(true);
        setError("");
        clearTimeout(); // Limpiar timeout anterior

        try {
            // Timeout para requests largos (30 segundos)
            const timeoutPromise = new Promise((_, reject) => {
                createTimeout(() => reject(new Error("Tiempo de espera agotado")), 30000);
            });

            const loginPromise = axios.post("http://localhost:3000/users/login", form);

            const response = await Promise.race([loginPromise, timeoutPromise]) as any;

            console.log("LoginForm - Response data:", response.data);

            // Si el backend no devuelve user, crear un objeto user básico
            const userData = response.data.user || {
                id: 0,
                email: form.email,
                firstName: form.email.split('@')[0], // Usar parte del email como nombre
                lastName: "",
                phone: "",
                birthDate: "",
                role: "user"
            };

            // Guardar en contexto
            login(userData, response.data.token);

            console.log("LoginForm - User logged in successfully");

            // Pequeño delay para asegurar que el contexto se actualice
            setTimeout(() => {
                navigate('/');
            }, 100);
        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);
            setError(
                error.message === "Tiempo de espera agotado"
                    ? "La solicitud tardó demasiado. Intenta nuevamente."
                    : error.response?.data?.message ||
                    "Error al iniciar sesión. Verifica tus credenciales."
            );
        } finally {
            setIsLoading(false);
            clearTimeout();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-[1.02] transition-all duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                Iniciar Sesión
                            </h2>
                            <p className="text-gray-300 text-sm">Accede a tu cuenta</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Correo electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.email
                                        ? 'border-red-500 focus:ring-red-400'
                                        : form.email && !validationErrors.email
                                            ? 'border-green-500 focus:ring-green-400'
                                            : 'border-gray-600 focus:ring-blue-400'
                                        }`}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    {form.email && (
                                        validationErrors.email ? (
                                            <AlertCircle className="h-5 w-5 text-red-400" />
                                        ) : (
                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                        )
                                    )}
                                </div>
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-300">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.password
                                        ? 'border-red-500 focus:ring-red-400'
                                        : form.password && !validationErrors.password
                                            ? 'border-green-500 focus:ring-green-400'
                                            : 'border-gray-600 focus:ring-blue-400'
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                    Recordarme
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Iniciando sesión...
                                </div>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-gray-400 text-sm">
                                ¿No tienes una cuenta?{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                >
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
