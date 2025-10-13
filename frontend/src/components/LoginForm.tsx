import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { validateEmail, validatePassword, sanitizeInput } from "../utils/validations";
import { useTimeout } from "../hooks/useTimeout";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useUser();
    const { isAuthenticated } = useUser();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated]);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    const { createTimeout, clearTimeout } = useTimeout();

    useEffect(() => {
        const emailValidation = validateEmail(form.email);
        const passwordValidation = validatePassword(form.password);

        setIsFormValid(
            emailValidation.isValid &&
            passwordValidation.isValid &&
            form.email.length > 0 &&
            form.password.length > 0
        );
    }, [form.email, form.password]);

    const validateField = (name: string, value: string) => {
        let message = '';

        if (name == 'email') {
            const emailValidation = validateEmail(value);
            if (!emailValidation.isValid) {
                message = emailValidation.message;
            }
        }

        if (name == 'password') {
            const passwordValidation = validatePassword(value);
            if (!passwordValidation.isValid) {
                message = passwordValidation.message;
            }
        }

        setErrors((prev) => ({
            ...prev,
            [name]: message
        }));

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: sanitizeInput(value)
        }));

        if (touched[name as keyof typeof touched]) {
            validateField(name, value);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid) {
            setError('Por favor completa todos los campos correctamente')
            return;
        }
        setIsLoading(true)
        setError('')
        clearTimeout()

        try {
            const timeoutPromise = new Promise((_, reject) => {
                createTimeout(() => reject(new Error('Tiempo de espera agotado')), 3000)
            });

            const loginPromise = axios.post('http://localhost:3000/users/login', form);
            const response = (await Promise.race([loginPromise, timeoutPromise])) as any;

            const userData = response.data.user || {
                id: 0,
                email: form.email,
                firstName: form.email.split('@')[0],
                lastName: "",
                phone: "",
                birthDate: "",
                role: "user"
            };

            login(userData, response.data.token);
            setTimeout(() => navigate('/', { replace: true }), 200);
        } catch (error: any) {
            console.error('Error al iniciar sesión', error);
            setError(
                error.message === 'Tiempo de espera agotado' ?
                    'Tiempo de espera agotado' :
                    error.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales."
            );
        } finally {
            setIsLoading(false);
            clearTimeout();
        }
    }

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark dark group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex flex-1 justify-center items-center py-5 px-4 sm:px-6 lg:px-8">
                    <div className="layout-content-container flex flex-col max-w-md w-full">


                        <div className="flex justify-center mb-5">
                            <div
                                className="w-20 h-20 bg-center bg-no-repeat bg-cover"
                                data-alt='Logo Tu Demanda'
                                style={{ backgroundImage: 'url("/TuDemanda-Icon.png")' }}>
                            </div>
                        </div>


                        <div className="text-center mb-8">
                            <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                                Bienvenido a Tu Demanda
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                                    <p className="text-red-400 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">

                                <div className="flex flex-col">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">
                                            Correo Electrónico
                                        </p>
                                        <div className="relative">
                                            <div className="text-[#92adc9] absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <span className="material-symbols-outlined">mail</span>
                                            </div>
                                            <input
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="email"
                                                placeholder="tu@email.com"
                                                aria-label="Correo Electrónico"
                                                autoComplete="email"
                                                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#333333] focus:border-primary'} bg-[#192633] focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] pl-12 text-base font-normal leading-normal `}
                                            />
                                        </div>

                                        {touched.email && errors.email && (
                                            <p className="text-red-400 text-sm mt-2 ml-1">{errors.email}</p>
                                        )}

                                    </label>
                                </div>

                                <div className="flex flex-col">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">
                                            Contraseña
                                        </p>
                                        <div className="flex w-full flex-1 items-stretch rounded-lg relative">
                                            <div className="text-[#92adc9] absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none" data-icon="Lock" data-size="24px" data-weight="regular">
                                                <span className="material-symbols-outlined">lock</span>
                                            </div>
                                            <input
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type={showPassword ? "text" : "password"}
                                                aria-label="Contraseña"
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                className={`form-input flex- w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#333333] focus:border-primary'} bg-[#192633] focus:border-primary h-14 placeholder:text-[#92adc9] p-[15px] pl-12 pr-12 text-base font-normal leading-normal`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#92adc9] hover:text-white transition-colors duration-200"
                                                data-icon="Eye"
                                                data-size="24px"
                                                data-weight="regular">
                                                <span className="material-symbols-outlined cursor-pointer">{showPassword ? "visibility_off" : "visibility"}</span>
                                            </button>
                                        </div>
                                        {touched.password && errors.password && (
                                            <p className="text-red-400 text-sm mt-2 ml-1">{errors.password}</p>
                                        )}

                                    </label>
                                </div>
                            </div>



                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95 duration-200 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}>
                                    <span>Iniciar Sesión</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <Link to="/password-reset" className="text-primary hover:underline text-sm font-medium">Olvidaste tu contraseña?</Link>
                        </div>

                        <div className="mt-2 text-center">
                            <p className="text-[#EAEAEA] text-sm">¿No tienes una cuenta? <Link to="/signin" className="text-primary hover:underline text-sm font-bold">Regístrate</Link></p>
                        </div>



                    </div>
                </div>
            </div>
        </div>


    );
}