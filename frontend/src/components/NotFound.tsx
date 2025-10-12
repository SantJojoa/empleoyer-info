import { useNavigate } from "react-router-dom"


export default function NotFound() {
    const navigate = useNavigate()
    return (
        <main className="flex-grow flex flex-col items-center justify-center text-center py-16 sm:py-20">
            <div className="flex flex-col items-center gap-6">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "80px" }}>search_off</span>
                <div className="flex flex-wrap justify-center gap-3 p-4">
                    <div className="flex min-w-72 flex-col gap-3">
                        <p className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">Error 404</p>
                        <p className="text-[#a0a0a0] text-base font-normal leading-normal">Parece que la página que buscas no existe o ha sido movida.</p>
                    </div>
                </div>
                <div className="flex px-4 py-3 justify-center">

                    <button
                        onClick={() => navigate("/")}
                        className="flex min-w-[84px] max-w-[480px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                        <span className="truncate">Ir a la página de inicio</span>
                    </button>

                </div>
            </div>


        </main>
    )
}