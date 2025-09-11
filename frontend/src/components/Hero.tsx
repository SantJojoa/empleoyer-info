import { Link } from "react-router-dom";

export default function Hero() {
    return (

        <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-100 mb-4">
                Descubre si el trabajador que quieres contratar es confiable y seguro para tu empresa
            </h2>

            <p className="text-base md:text-lg text-gray-300 max-w-2xl mb-8 mt-5">
                Comparte si has recibido alguna demanda laboral por parte de un trabajador, y contribuye a que otros empleadores puedan tomar decisiones más informadas, seguras y responsables al momento de contratar.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
                <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-xl  font-medium hover:bg-blue-700 transition-colors">
                    Crear cuenta gratis
                </Link>

                <Link to="/login" className="px-6 py-3 border border-gray-600 rounded-xl font-medium text-gray-300 hover:bg-gray-800 transition-colors">
                    Ya tengo una cuenta
                </Link>
            </div>
        </main>
    )
}