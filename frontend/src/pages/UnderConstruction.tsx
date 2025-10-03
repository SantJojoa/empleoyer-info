import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function UnderConstruction() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20"
                aria-hidden>
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-600 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-yellow-500/10 border border-yellow-400/30 mb-8 animate-pulse">
                    <AlertTriangle className="w-10 h-10 text-yellow-400" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
                    tuDemanda
                </h2>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                    <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                        Sitio en construcción
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300/90 max-w-2xl mx-auto mb-10">
                    Estamos trabajando para traerte una página espectacular que te va a encantar. ¡Muy pronto podrás disfrutar de una experiencia única!
                </p>



                <div className="mt-14 text-sm text-gray-400/80">
                    ¿Tienes dudas? Escríbenos y te responderemos apenas abramos.
                </div>
            </div>
        </section>
    );
}


