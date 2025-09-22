import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SubscriptionSelector from "./SubscriptionSelector";
import { useUser } from "../contexts/UserContext";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
    validateName,
    validateCedula,
    validatePhone,
    validateBirthDate,
    sanitizeInput,
    checkEmailExists,
    checkCedulaExists
} from "../utils/validations";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { useTimeout } from "../hooks/useTimeout";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";



export default function RegisterForm() {
    const navigate = useNavigate();
    const { login } = useUser();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        documentNumber: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: "",
    });

    const [showSubscription, setShowSubscription] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        documentNumber: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: "",
    });
    const [touchedFields, setTouchedFields] = useState({
        firstName: false,
        lastName: false,
        email: false,
        documentNumber: false,
        password: false,
        confirmPassword: false,
        phone: false,
        birthDate: false,
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isCheckingCedula, setIsCheckingCedula] = useState(false);

    const { createTimeout, clearTimeout } = useTimeout();

    // Validación en tiempo real solo para campos tocados
    useEffect(() => {
        const firstNameValidation = validateName(form.firstName, "El nombre");
        const lastNameValidation = validateName(form.lastName, "El apellido");
        const emailValidation = validateEmail(form.email);
        const cedulaValidation = validateCedula(form.documentNumber);
        const passwordValidation = validatePassword(form.password);
        const confirmPasswordValidation = validatePasswordConfirmation(form.password, form.confirmPassword);
        const phoneValidation = validatePhone(form.phone);
        const birthDateValidation = validateBirthDate(form.birthDate);

        setValidationErrors({
            firstName: touchedFields.firstName && !firstNameValidation.isValid ? firstNameValidation.message : "",
            lastName: touchedFields.lastName && !lastNameValidation.isValid ? lastNameValidation.message : "",
            email: touchedFields.email && !emailValidation.isValid ? emailValidation.message : "",
            documentNumber: touchedFields.documentNumber && !cedulaValidation.isValid ? cedulaValidation.message : "",
            password: touchedFields.password && !passwordValidation.isValid ? passwordValidation.message : "",
            confirmPassword: touchedFields.confirmPassword && !confirmPasswordValidation.isValid ? confirmPasswordValidation.message : "",
            phone: touchedFields.phone && !phoneValidation.isValid ? phoneValidation.message : "",
            birthDate: touchedFields.birthDate && !birthDateValidation.isValid ? birthDateValidation.message : "",
        });

        const allFieldsValid = firstNameValidation.isValid &&
            lastNameValidation.isValid &&
            emailValidation.isValid &&
            cedulaValidation.isValid &&
            passwordValidation.isValid &&
            confirmPasswordValidation.isValid &&
            phoneValidation.isValid &&
            birthDateValidation.isValid;

        setIsFormValid(allFieldsValid);
    }, [form, touchedFields]);

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

        // Verificar email y cédula únicos con debounce
        if (name === 'email' && value.trim()) {
            setIsCheckingEmail(true);
            setTimeout(async () => {
                const emailCheck = await checkEmailExists(value);
                if (emailCheck.exists) {
                    setValidationErrors(prev => ({
                        ...prev,
                        email: 'Este email ya está registrado'
                    }));
                }
                setIsCheckingEmail(false);
            }, 1000);
        }

        if (name === 'documentNumber' && value.trim()) {
            setIsCheckingCedula(true);
            setTimeout(async () => {
                const cedulaCheck = await checkCedulaExists(value);
                if (cedulaCheck.exists) {
                    setValidationErrors(prev => ({
                        ...prev,
                        documentNumber: 'Esta cédula ya está registrada'
                    }));
                }
                setIsCheckingCedula(false);
            }, 1000);
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

            const registerPromise = axios.post("http://localhost:3000/users/register", form);

            const registerRes = await Promise.race([registerPromise, timeoutPromise]) as any;

            login(registerRes.data.user, registerRes.data.token);

            alert("Usuario registrado correctamente");

            const wantsPlan = window.confirm("¿Desea suscribirse a un plan?");
            if (wantsPlan) {
                setShowSubscription(true);
            } else {
                navigate('/');
            }
        } catch (error: any) {
            console.error("Error al registrar usuario:", error);
            setError(
                error.message === "Tiempo de espera agotado"
                    ? "La solicitud tardó demasiado. Intenta nuevamente."
                    : error.response?.data?.message ||
                    "Error al registrar usuario. Intenta nuevamente."
            );
        } finally {
            setIsLoading(false);
            clearTimeout();
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

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                    <p className="text-red-400 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Nombre</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Tu nombre"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.firstName
                                                ? 'border-red-500 focus:ring-red-400'
                                                : form.firstName && !validationErrors.firstName
                                                    ? 'border-green-500 focus:ring-green-400'
                                                    : 'border-gray-600 focus:ring-blue-400'
                                                }`}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            {form.firstName && (
                                                validationErrors.firstName ? (
                                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                                ) : (
                                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {validationErrors.firstName && (
                                        <p className="text-red-400 text-xs mt-1">{validationErrors.firstName}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Apellido</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Tu apellido"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.lastName
                                                ? 'border-red-500 focus:ring-red-400'
                                                : form.lastName && !validationErrors.lastName
                                                    ? 'border-green-500 focus:ring-green-400'
                                                    : 'border-gray-600 focus:ring-blue-400'
                                                }`}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            {form.lastName && (
                                                validationErrors.lastName ? (
                                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                                ) : (
                                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {validationErrors.lastName && (
                                        <p className="text-red-400 text-xs mt-1">{validationErrors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-300">Correo electrónico</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="tu@email.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.email
                                            ? 'border-red-500 focus:ring-red-400'
                                            : form.email && !validationErrors.email
                                                ? 'border-green-500 focus:ring-green-400'
                                                : 'border-gray-600 focus:ring-blue-400'
                                            }`}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {isCheckingEmail ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                                        ) : form.email && (
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
                                <label className="text-sm font-medium text-gray-300">Cédula</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="documentNumber"
                                        placeholder="Tu cédula"
                                        value={form.documentNumber}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.documentNumber
                                            ? 'border-red-500 focus:ring-red-400'
                                            : form.documentNumber && !validationErrors.documentNumber
                                                ? 'border-green-500 focus:ring-green-400'
                                                : 'border-gray-600 focus:ring-blue-400'
                                            }`}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        {isCheckingCedula ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                                        ) : form.documentNumber && (
                                            validationErrors.documentNumber ? (
                                                <AlertCircle className="h-5 w-5 text-red-400" />
                                            ) : (
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            )
                                        )}
                                    </div>
                                </div>
                                {validationErrors.documentNumber && (
                                    <p className="text-red-400 text-xs mt-1">{validationErrors.documentNumber}</p>
                                )}
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
                                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.password
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
                                    <PasswordStrengthIndicator password={form.password} />
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
                                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.confirmPassword
                                                ? 'border-red-500 focus:ring-red-400'
                                                : form.confirmPassword && !validationErrors.confirmPassword
                                                    ? 'border-green-500 focus:ring-green-400'
                                                    : 'border-gray-600 focus:ring-blue-400'
                                                }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                    {validationErrors.confirmPassword && (
                                        <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Teléfono</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="+57 300 123 4567"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 placeholder-gray-400 text-white ${validationErrors.phone
                                                ? 'border-red-500 focus:ring-red-400'
                                                : form.phone && !validationErrors.phone
                                                    ? 'border-green-500 focus:ring-green-400'
                                                    : 'border-gray-600 focus:ring-blue-400'
                                                }`}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            {form.phone && (
                                                validationErrors.phone ? (
                                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                                ) : (
                                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {validationErrors.phone && (
                                        <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-300">Fecha de nacimiento</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={form.birthDate}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pr-10 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-700/50 hover:bg-gray-700 focus:bg-gray-700 text-gray-300 ${validationErrors.birthDate
                                                ? 'border-red-500 focus:ring-red-400'
                                                : form.birthDate && !validationErrors.birthDate
                                                    ? 'border-green-500 focus:ring-green-400'
                                                    : 'border-gray-600 focus:ring-blue-400'
                                                }`}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            {form.birthDate && (
                                                validationErrors.birthDate ? (
                                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                                ) : (
                                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {validationErrors.birthDate && (
                                        <p className="text-red-400 text-xs mt-1">{validationErrors.birthDate}</p>
                                    )}
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
                                        Creando cuenta...
                                    </div>
                                ) : (
                                    "Crear Cuenta"
                                )}
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