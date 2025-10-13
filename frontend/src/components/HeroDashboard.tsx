
import { Link } from "react-router-dom";




export default function HeroDashboard() {

    return (
        <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-10">
            <div className="layout-content-container flex flex-col w-full max-w-5xl">
                <div className="flex flex-col items-start mb-8">
                    <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em]">Panel de Control</h2>
                    <p className="text-[#92adc9] text-base font-normal leading-normal">Encuentra o sube demandas, gestiona tu perfil y revisa tu historial de demandas.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <Link
                        to="/search"
                        className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 hover:bg-[#233684] transition-all duration-200">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                            <span className="material-symbols-outlined text-white text-3xl">search</span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white">Buscar Demanda</h3>
                            <p className="text-[#92adc9] text-sm mt-2">Encuentra demandas existentes en la base de datos, solo con el numero de cédula.</p>
                        </div>

                    </Link>

                    <Link
                        to="/reports"
                        className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 hover:bg-[#233684] transition-all duration-200">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                            <span className="material-symbols-outlined text-white text-3xl">upload_file</span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white">Subir Demanda</h3>
                            <p className="text-[#92adc9] text-sm mt-2">Añade una nueva demanda al sistema.</p>
                        </div>

                    </Link>

                    <Link
                        to="/profile"
                        className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 hover:bg-[#233684] transition-all duration-200">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                            <span className="material-symbols-outlined text-white text-3xl">manage_accounts</span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white">Gestionar Perfil</h3>
                            <p className="text-[#92adc9] text-sm mt-2">Actualiza tu información personal.</p>
                        </div>

                    </Link>
                    <Link
                        to="/my-reports"
                        className="group flex flex-col gap-4 rounded-xl bg-card-dark p-6 hover:bg-[#233684] transition-all duration-200">
                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                            <span className="material-symbols-outlined text-white text-3xl">history</span>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-white">Mis Demandas</h3>
                            <p className="text-[#92adc9] text-sm mt-2">Revisa el historial y el estado de las demandas que has subido.</p>
                        </div>

                    </Link>


                </div>

            </div>


        </main>
    )

};
