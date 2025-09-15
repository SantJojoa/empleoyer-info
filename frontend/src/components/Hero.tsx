import { Link } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { reportService, type EmployeeWithReports } from "../services/reportService";



export default function Hero() {
    const { isAuthenticated, user, token } = useUser();
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [result, setResult] = useState<EmployeeWithReports | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setResult(null);

        const doc = searchId.trim();
        if (!doc) return;
        if (!token) {
            setMessage("Debes iniciar sesión para buscar empleados");
            return;
        }
        try {
            setLoading(true);
            const employee = await reportService.searchEmployeeWithReports(token, doc);
            if (!employee) {
                setMessage("El empleado no presenta reportes en la plataforma");
                setResult(null);
                return;
            }
            setResult(employee);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Error al buscar empleado");
            setResult(null);
        } finally {
            setLoading(false);
        }
        console.log("Hero - isAuthenticated:", isAuthenticated);
        console.log("Hero - user:", user);
    }

    if (isAuthenticated) {
        return (
            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 leading-tight">
                        Buscar Empleado
                    </h2>

                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
                        Hola {user?.firstName}, ingresa la cédula del empleado que deseas consultar para verificar su historial laboral y tomar decisiones informadas.
                    </p>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Ingresa la cédula del empleado"
                                className="w-full pl-12 pr-36 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-lg"
                            />
                            <button
                                type="submit"
                                disabled={loading || !searchId.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                            >
                                {loading ? "Buscando..." : "Buscar"}
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div className="mt-4 p-4 rounded-md bg-gray-800/50 border border-gray-600 text-red-400">
                            {message}
                        </div>
                    )}

                    {result && (
                        <div className="mt-8 text-left bg-gray-800/60 border border-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-gray-100 mb-2">
                                {result.firstName} {result.lastName}
                            </h3>
                            <p className="text-gray-300 mb-4">Cédula: {result.documentNumber}</p>

                            {result.Reports.length === 0 ? (
                                <p className="text-gray-300 mb-4">No hay reportes en la plataforma</p>
                            ) : (
                                <div className="space-y-4">
                                    {result.Reports.map((r) => (
                                        <div key={r.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                                            <p className="text-gray-200 ">
                                                <span className="font-semibold">Empleador demandado:</span> {r.User.firstName} {r.User.lastName}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="font-semibold">Cédula del empleador demandado:</span> {r.User.documentNumber || "No disponible"}
                                            </p>
                                            <p className="text-gray-300">
                                                <span>Email del empleador demandado:</span> {r.User.email}
                                            </p>

                                            <p className="text-gray-300">
                                                <span className="font-semibold">Fecha de la demanda:</span> {new Date(r.incidentDate).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="font-semibold">Ciudad:</span> {r.city}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="font-semibold">Descripción:</span> {r.description}
                                            </p>
                                            {r.evidenceUrl && (
                                                <a
                                                    href={`htpp://localhost:3000${r.evidenceUrl.replace(/\\/g, '/')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-500 underline"
                                                >
                                                    Ver evidencia
                                                </a>
                                            )

                                            }
                                        </div>
                                    ))}

                                </div>
                            )

                            }
                        </div>

                    )
                    }

                    <div className="mt-8 text-sm text-gray-400">
                        <p>💡 Tip: Asegúrate de ingresar la cédula completa y correcta</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 leading-tight">
                    Descubre si el trabajador que quieres contratar es confiable y seguro para tu empresa
                </h2>

                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-12 leading-relaxed">
                    Comparte si has recibido alguna demanda laboral por parte de un trabajador, y contribuye a que otros empleadores puedan tomar decisiones más informadas, seguras y responsables al momento de contratar.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        to="/register"
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400/20"
                    >
                        Crear cuenta gratis
                    </Link>

                    <Link
                        to="/login"
                        className="px-8 py-4 border-2 border-gray-600 rounded-xl font-semibold text-gray-300 hover:border-blue-400 hover:text-blue-400 hover:bg-gray-800/50 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        Ya tengo una cuenta
                    </Link>
                </div>
            </div>
        </main>
    )
}





