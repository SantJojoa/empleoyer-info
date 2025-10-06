export default function Footer() {
    return (
        <footer className="text-center py-8 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} Tu Demanda. Todos los derechos reservados.
                </p>
                <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-500">
                    <span>Privacidad</span>
                    <span>•</span>
                    <span>Términos de Servicio</span>
                    <span>•</span>
                    <span>Contacto</span>
                </div>
            </div>
        </footer>
    )
}