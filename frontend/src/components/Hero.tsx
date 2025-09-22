import { Link } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { reportService, type EmployeeWithReports } from "../services/reportService";

// Función auxiliar para obtener el estado de la demanda
const getStatusInfo = (status: string) => {
    switch (status) {
        case 'active':
            return {
                text: 'Activa',
                color: 'bg-red-500/20 text-red-400',
                icon: '🔴'
            };
        case 'resolved':
            return {
                text: 'Resuelta',
                color: 'bg-green-500/20 text-green-400',
                icon: '✅'
            };
        case 'closed':
            return {
                text: 'Cerrada',
                color: 'bg-gray-500/20 text-gray-400',
                icon: '⚫'
            };
        default:
            return {
                text: 'Activa',
                color: 'bg-red-500/20 text-red-400',
                icon: '🔴'
            };
    }
};



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
                        <div className="mt-8 bg-gray-800/60 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                            {/* Header del empleado */}
                            <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-gray-700 p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {result.firstName.charAt(0)}{result.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {result.firstName} {result.lastName}
                                        </h3>
                                        <p className="text-gray-300 text-lg">Cédula: {result.documentNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido principal */}
                            <div className="p-6">
                                {result.Reports.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-xl text-gray-300 font-medium">No hay reportes en la plataforma</p>
                                        <p className="text-gray-400 mt-2">Este empleado no presenta demandas laborales registradas</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h4 className="text-xl font-semibold text-white">Reportes Laborales</h4>
                                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                                                {result.Reports.length} {result.Reports.length === 1 ? 'reporte' : 'reportes'}
                                            </span>
                                        </div>

                                        {result.Reports.map((r, index) => (
                                            <div key={r.id} className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:bg-gray-900/70 transition-all duration-200">
                                                {/* Header del reporte */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                                                            <span className="text-red-400 font-bold text-sm">#{index + 1}</span>
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-semibold text-white">Reporte Laboral</h5>
                                                            <p className="text-gray-400 text-sm">Fecha: {new Date(r.incidentDate).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 justify-center content-center">
                                                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">
                                                            Demanda
                                                        </span>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusInfo(r.status).color}`}>
                                                            {getStatusInfo(r.status).text}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Información del empleador */}
                                                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                                                    <h6 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Empleador Demandado</h6>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-xs text-gray-400 mb-1">Nombre</p>
                                                            <p className="text-white font-medium">{r.User.firstName} {r.User.lastName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 mb-1">Cédula</p>
                                                            <p className="text-white font-medium">{r.User.documentNumber || "No disponible"}</p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <p className="text-xs text-gray-400 mb-1">Email</p>
                                                            <p className="text-white font-medium">{r.User.email}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detalles del incidente */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-1">Ciudad</p>
                                                        <p className="text-white font-medium">{r.city}</p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-1">Estado de la Demanda</p>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{getStatusInfo(r.status).icon}</span>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusInfo(r.status).color}`}>
                                                                {getStatusInfo(r.status).text}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-gray-400 mb-1">Descripción</p>
                                                        <p className="text-gray-300 leading-relaxed">{r.description}</p>
                                                    </div>

                                                    {r.evidenceUrl && (
                                                        <div className="pt-3 border-t border-gray-700">
                                                            <a
                                                                href={`http://localhost:3000${r.evidenceUrl.replace(/\\/g, '/')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                <span className="font-medium">Ver evidencia</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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





