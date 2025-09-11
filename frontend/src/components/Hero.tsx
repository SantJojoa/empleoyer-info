import { Link } from "react-router-dom";

export default function Hero() {
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