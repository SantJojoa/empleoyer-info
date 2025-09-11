import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useUser } from "../contexts/UserContext";

type SubscriptionSelectorProps = {
    userEmail: string;                // el email del usuario
    selectedPlan: string;             // plan seleccionado
    setSelectedPlan: (plan: string) => void; // función para actualizar el plan
};

export default function SubscriptionSelector({ userEmail }: SubscriptionSelectorProps) {
    const navigate = useNavigate();
    const { token } = useUser();

    const plans = [
        {
            id: 0,
            name: "Plan Gratis",
            price: 0,
            description: "Perfecto para empezar",
            features: ["Una consulta por cada reporte que realices", "Soporte por email"],
            icon: <Zap className="w-6 h-6" />,
            popular: false,
            color: "from-gray-500 to-gray-600"
        },
        {
            id: 1,
            name: "Plan 10 Consultas",
            price: 50000,
            description: "Ideal para pequeñas empresas",
            features: ["10 consultas", "Soporte por email"],
            icon: <Star className="w-6 h-6" />,
            popular: true,
            color: "from-blue-500 to-blue-600"
        },
        {
            id: 2,
            name: "Plan Mensual",
            price: 130000,
            description: "Para empresas en crecimiento",
            features: ["Consultas ilimitadas", "Soporte por email"],
            icon: <Crown className="w-6 h-6" />,
            popular: false,
            color: "from-purple-500 to-purple-600"
        },
        {
            id: 3,
            name: "Plan Anual",
            price: 800000,
            description: "La mejor opción para empresas",
            features: ["Consultas ilimitadas", "Soporte por email"],
            icon: <Crown className="w-6 h-6" />,
            popular: false,
            color: "from-emerald-500 to-emerald-600"
        },
    ]

    const handleSubscribe = async (planName: string) => {
        try {
            console.log("TOKEN RECIBIDO", token);
            await axios.post("http://localhost:3000/subscriptions", {
                userEmail,
                planType: planName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Suscripción creada correctamente");
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Error al crear la suscripción");
        }
    };

    const formatPrice = (price: number) => {
        if (price === 0) return "Gratis";
        return `$${price.toLocaleString('es-CO')}`;
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                        Elige tu Plan
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Selecciona el plan que mejor se adapte a las necesidades de tu empresa
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 transform hover:scale-105 transition-all duration-300 ${plan.popular ? 'ring-2 ring-blue-400/50' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Más Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} mb-4`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                                <div className="text-4xl font-bold text-white mb-2">
                                    {formatPrice(plan.price)}
                                </div>
                                {plan.price > 0 && (
                                    <p className="text-gray-400 text-sm">
                                        {plan.id === 3 ? 'por año' : 'por mes'}
                                    </p>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.name)}
                                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${plan.popular
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
                                    : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600 hover:border-gray-500'
                                    }`}
                            >
                                {plan.price === 0 ? 'Comenzar Gratis' : 'Suscribirse'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-400 text-sm">
                        ¿Necesitas ayuda para elegir? <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Contacta a nuestro equipo</span>
                    </p>
                </div>
            </div>
        </div>
    )
}