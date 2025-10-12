export default function HeroLanding() {

    return (
        <main className="layout-content-container flex flex-col max-w-[80vw] flex-1 mx-auto">
            <div className="@container py-10">
                <div className="flex flex-col gap-6 px-4 @[480px]:gap-8 @[864px]:flex-row-reverse">
                    <div
                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
                        data-alt="Dos personas apretando sus manos con un documento legal"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1521790797524-b2497295b8a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169')"
                        }}
                    ></div>

                    <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                        <div className="flex flex-col gap-2 text-left">
                            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">Encuentra demandas laborales en nuestro sitio</h1>
                            <h2 className="text-gray-300 text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal  @[480px]:leading-normal">Encuentra demandas laborales por o hacia una persona solo con su numero de cedula.</h2>
                        </div>
                        <div className="flex-wrap gap-3 flex">
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em]">
                                <span className="truncate">Buscar Demanda</span>
                            </button>
                            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary/20 text-primary text-base font-bold leading-normal tracking-[0.015em]">
                                <span className="truncate">Subir Demanda</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-10 px-4 py-10 @container bg-background-dark/50 rounded-xl my-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:tracking-[-0.033em] max-w-[720px]">  Encuentra y gestiona demandas laborales en un solo lugar
                        </h1>
                        <p className="text-gray-300 text-base font-normal leading-normal max-w-[720px]">Comparte si has demandado o has recibido una demanda laboral y contribuye a que otros usuarios puedan tomar decisiones informadas y seguras al momento de buscar empleo o contratar a un empleador.</p>
                    </div>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-0">
                    <div className="flex flex-1 gap-4 rounded-lg border border-gray-700 bg-background-dark p-6 flex-col ">
                        <div className="text-primary">
                            <span className="material-symbols-outlined !text-4xl">search</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-white text-lg font-bold leading-tight">Busca y filtra demandas fácilmente</h2>
                            <p className="text-gray-400 text-sm font-normal leading-normal">Encuentra la información que necesitas de manera rápida y precisa con nuestras herramientas de búsqueda avanzada.</p>
                        </div>
                    </div>

                    <div className="flex flex-1 gap-4 rounded-lg border border-gray-700 bg-background-dark p-6 flex-col ">
                        <div className="text-primary">
                            <span className="material-symbols-outlined !text-4xl">lock</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-white text-lg font-bold leading-tight">Sube tu información de manera segura</h2>
                            <p className="text-gray-400 text-sm font-normal leading-normal">Tus datos están protegidos con los más altos estándares de seguridad para garantizar tu tranquilidad.</p>
                        </div>
                    </div>

                    <div className="flex flex-1 gap-4 rounded-lg border border-gray-700 bg-background-dark p-6 flex-col ">
                        <div className="text-primary">
                            <span className="material-symbols-outlined !text-4xl">verified_user</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="text-white text-lg font-bold leading-tight">Información totalmente verificada</h2>
                            <p className="text-gray-400 text-sm font-normal leading-normal">Todas las demandas son verificadas para garantizar la calidad de la información.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )

}