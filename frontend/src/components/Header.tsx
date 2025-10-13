import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, FileText } from "lucide-react";
import { useUser } from "../contexts/UserContext";



export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useUser();

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-700 px-4 sm:px-10 py-3">
            <div className="flex items-center gap-4 text-white">
                <div className="size-8 text-primary">
                    <img src="/TuDemanda-Icon.png" alt="Logo" className="size-8 text-primary" />

                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Tu Demanda</h2>
            </div>

            {isAuthenticated ? (
                <>
                    <div className="hidden md:flex flex-1 justify-end gap-8">


                        <div className="flex items-center gap-4">
                            <span className="text-[#92adc9] text-sm">{user?.planType}</span>

                            <button className="flex items-center gap-2  text-white hover:text-primary">
                                <span className="material-symbols-outlined">account_circle</span>
                                <span >{user?.firstName}</span>
                            </button>

                            <button onClick={logout} className="flex items-center justify-center h-10 w-10 cursor-pointer rounded-full bg-card-dark text-white hover:bg-primary/90 transition-colors duration-200">
                                <span className="material-symbols-outlined">logout</span>
                            </button>

                        </div>
                    </div>




                </>
            ) : (
                <>
                    <div className="md:hidden flex flex-1 justify-end gap-8">

                        <div className="flex items-center gap-9">
                            <Link to="/" className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400
                                after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-blue-400 after:transition-all after:duration-300 after:-translate-x-1/2 
                            hover:after:w-full">Ir al inicio</Link>
                            <Link to="/about" className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400
                                after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-blue-400 after:transition-all after:duration-300 after:-translate-x-1/2 
                            hover:after:w-full">Acerca de</Link>
                            <Link to="/contact" className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400
                                after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-blue-400 after:transition-all after:duration-300 after:-translate-x-1/2 
                            hover:after:w-full">Contáctenos</Link>
                            <Link to="/login" className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400
                                after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-blue-400 after:transition-all after:duration-300 after:-translate-x-1/2 
                            hover:after:w-full">Iniciar Sesión</Link>
                        </div>

                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden 
                                rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[-0.015em] 
                                transition-all duration-200 hover:bg-primary/80 hover:scale-105 active:scale-95">
                            <span className="truncate">Subir Nueva Demanda</span>
                        </button>
                    </div>

                </>
            )}

            {/* Hamburger menu for mobile */}

            <button
                className="md:hidden text-gray-300 hover:text-blue-400 cursor-pointer transition-colors duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {menuOpen && (
                <nav className="absolute top-16 right-0 w-2/3 bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-l-2xl border border-gray-700/50 p-6 flex flex-col space-y-4 md:hidden" onClick={() => setMenuOpen(false)}>
                    {isAuthenticated ? (
                        <>

                            {/* Botón perfil */}
                            <button className="flex items-center gap-2 text-white hover:text-primary py-2 px-4 rounded-lg w-full justify-start">
                                <span className="material-symbols-outlined">account_circle</span>
                                <span>{user?.firstName}</span>
                            </button>

                            <span className="flex items-center pl-6 text-[#92adc9] text-sm mb-5">{user?.planType}</span>
                            {/* Botón logout */}
                            <button
                                onClick={logout}
                                className="flex items-center justify-start gap-2 py-2 px-4 rounded-lg bg-card-dark text-white hover:bg-primary/90 transition-colors duration-200 w-full"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                <span>Cerrar sesión</span>
                            </button>

                        </>


                    ) : (
                        <>
                            <Link to="/" className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400
                                after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-blue-400 after:transition-all after:duration-300 after:-translate-x-1/2 
                            hover:after:w-full">Ir al inicio</Link>
                            <Link
                                to="/about"
                                className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400
                                after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-blue-400 after:transition-all after:duration-300 after:-translate-x-1/2 
                            hover:after:w-full"
                                onClick={() => setMenuOpen(false)}
                            >
                                Acerca de
                            </Link>

                            <Link
                                to="/contact"
                                className="relative text-gray-300 font-medium transition-colors duration-300 hover:text-blue-400
                                after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 
                            after:bg-blue-400 after:transition-all after:duration-300 after:-translate-x-1/2 
                            hover:after:w-full"
                                onClick={() => setMenuOpen(false)}
                            >
                                Contáctenos

                            </Link>

                            <Link
                                to="/login"
                                className="text-gray-300 hover-text-blue-400 transition-colors duration-200 font-medium"
                                onClick={() => setMenuOpen(false)}
                            >
                                Iniciar Sesión

                            </Link>

                            <button
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[-0.015em] transition-colors duration-200 hover:bg-primary/80"
                                onClick={() => setMenuOpen(false)}
                            >
                                <span className="truncate">Subir Nueva Demanda</span>
                            </button>

                        </>

                    )
                    }

                </nav >
            )}

        </header >


    )
}