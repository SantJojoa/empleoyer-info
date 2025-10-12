import { Link } from "react-router-dom"
export default function Footer() {
    return (
        <footer className="flex flex-col gap-6 px-5 py-10 text-center @container border-t border-solid border-t-gray-700">
            <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <Link className="text-gray-400 text-base font-normal leading-normal min-w-40" to="/privacy-policy">Política de Privacidad</Link>
                <Link className="text-gray-400 text-base font-normal leading-normal min-w-40" to="/terms">Términos y Condiciones</Link>
                <Link className="text-gray-400 text-base font-normal leading-normal min-w-40" to="/contact">Contacto</Link>
            </div>


            <p className="text-gray-400 text-base font-normal leading-normal"> &copy; 2025 Tu Demanda. Todos los derechos reservados.</p>



        </footer>
    )
}