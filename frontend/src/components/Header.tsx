import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, FileText } from "lucide-react";
import { useUser } from "../contexts/UserContext";



export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useUser();

    return (
        <header className="flex justify-between items-center px-6 py-4 shadow-2xl bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 text-gray-100 relative">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate("/")}>Demandas.com</h1>
            {/* Navbar for desktop */}
            <nav className="hidden md:flex space-x-6 items-center">
                {isAuthenticated ? (
                    <>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300">
                                Hola, <span className="text-blue-400 font-semibold">{user?.firstName}</span>
                            </span>
                            <Link
                                to="/reports"
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors duration-200"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Subir Reportes</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/register"
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Crear cuenta
                        </Link>
                        <Link
                            to="/login"
                            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                        >
                            Acerca de Nosotros
                        </Link>
                    </>
                )}
            </nav>

            {/* Hamburger menu for mobile */}
            <button
                className="md:hidden text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="absolute top-16 right-0 w-2/3 bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-l-2xl border border-gray-700/50 p-6 flex flex-col space-y-4 md:hidden" onClick={() => setMenuOpen(false)}>
                    {isAuthenticated ? (
                        <>
                            <div className="text-gray-300 mb-2">
                                Hola, <span className="text-blue-400 font-semibold">{user?.firstName}</span>
                            </div>
                            <Link
                                to="/reports"
                                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                <FileText className="w-4 h-4" />
                                <span>Subir Reportes</span>
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setMenuOpen(false);
                                }}
                                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/about"
                                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Acerca de Nosotros
                            </Link>
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all duration-200 transform hover:scale-105"
                                onClick={() => setMenuOpen(false)}
                            >
                                Crear Cuenta
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>



    )
}