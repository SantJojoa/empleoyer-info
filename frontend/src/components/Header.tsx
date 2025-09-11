import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";


export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    {/* Header */ }
    return (
        <header className="flex justify-between items-center px-6 py-4 shadow-md bg-gray-900 text-gray-100 relative">
            <h1 className="text-2xl font-bold text-blue-400">EmployerInfo</h1>
            {/* Navbar for desktop */}
            <nav className="hidden md:flex space-x-6 items-center">
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Crear cuenta</Link>
                <Link to="/login" className="text-gray-300 hover:text-blue-400 transition-colors">Iniciar sesión</Link>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">Acerca de Nosotros</Link>
            </nav>

            {/* Hamburger menu for mobile */}

            <button
                className="md:hidden text-gray-300 hover:text-blue-400 cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile menu */}

            {menuOpen && (
                <div className="absolute top-16 right-0 w-2/3 bg-gray-900 shadow-lg rounded-l-lg p-6 flex flex-col space-y-4 md:hidden " onClick={() => setMenuOpen(false)}>
                    <Link to="/about" className="text-gray-300 hover:text-blue-400 " onClick={() => setMenuOpen(false)}>Acerca de Nosotros</Link>
                    <Link to="/login" className="text-gray-300 hover:text-blue-400 " onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
                    <Link to="/register" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white" onClick={() => setMenuOpen(false)}>Crear Cuenta</Link>

                </div>
            )

            }
        </header>



    )
}