import { useState } from "react";
import axios from "axios";
import SubscriptionSelector from "./SubscriptionSelector";



export default function RegisterForm() {

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    interface RegisterResponse {
        user: {
            id: number;
            email: string;
            role: string;
            firstName: string;
            lastName: string;
            phone: string;
            birthDate: string;
        };
        token: string;
    }

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

            // 3️⃣ Guardar token
            localStorage.setItem('token', loginRes.data.token);
            console.log("TOKEN", loginRes.data.token);

            // 4️⃣ Preguntar si quiere suscribirse
            const wantsPlan = window.confirm("¿Desea suscribirse a un plan?");
            if (wantsPlan) {
                setShowSubscription(true);
            }
        } catch (error) {
            console.log(error);
            alert("Error al registrar o iniciar sesión del usuario");
        }
    };



    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg white rounded-lg shadow-md">
            {!showSubscription ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-6">Registro</h2>
                    <input type="text"
                        name="firstName"
                        placeholder="Nombre"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar contraseña"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Teléfono"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <input
                        type="date"
                        name="birthDate"
                        placeholder="Fecha de nacimiento"
                        value={form.birthDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
                        Registrar
                    </button>
                </form>
            ) : (
                <SubscriptionSelector userEmail={form.email!} selectedPlan={selectedPlan ?? ''} setSelectedPlan={(plan: string) => setSelectedPlan(plan)} />
            )}
        </div>



    )
}