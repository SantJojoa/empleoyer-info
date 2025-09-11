import axios from "axios";

type SubscriptionSelectorProps = {
    userEmail: string;                // el email del usuario
    selectedPlan: string;             // plan seleccionado
    setSelectedPlan: (plan: string) => void; // función para actualizar el plan
};

export default function SubscriptionSelector({ userEmail, selectedPlan, setSelectedPlan }: SubscriptionSelectorProps) {

    const plans = [
        { id: 1, name: "Plan 10 Consultas", price: 50000 },
        { id: 2, name: "Plan Mensual", price: 130000 },
        { id: 3, name: "Plan Anual", price: 800000 },
    ]

    const handleSubscribe = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("TOKEN RECIBIDO", localStorage.getItem('token'));
            await axios.post("http://localhost:3000/subscriptions", {
                userEmail,
                planType: selectedPlan,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Suscripción creada correctamente");
        } catch (err) {
            console.error(err);
            alert("Error al crear la suscripción");
        }
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg white rounded-lg shadow-md space-y-4">
            <h2 className="text-2xl font-bold text-center">Selecciona un paquete de suscripción</h2>
            <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedPlan || ""}
                onChange={(e) => setSelectedPlan(e.target.value)}
            >
                <option value="">-- Elige un plan --</option>
                {plans.map((plan) => (
                    <option key={plan.id} value={plan.name}>
                        {plan.name} - ${plan.price}
                    </option>
                ))}
            </select>
            <button
                onClick={handleSubscribe}
                className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition cursor-pointer"
                disabled={!selectedPlan}
            >
                Comprar paquete
            </button>

        </div>
    )
}