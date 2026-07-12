import React from "react";

function Steps() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 dark:bg-violet-900/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse [animation-delay:2000ms]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-4">
                        Aplicación Web Moderna y Escalable
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Desarrollada con una interfaz intuitiva para permitir el acceso
                        desde múltiples dispositivos y agilizar las aprobaciones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 transition-colors duration-300"></div>

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300 group shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold mb-6 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-colors duration-300">
                            1
                        </div>
                        <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">
                            Cruce de Perfiles
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Procesamiento de historiales de estudiantes y docentes mediante
                            algoritmos de similitud.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300 group shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold mb-6 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-colors duration-300">
                            2
                        </div>
                        <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">
                            Recomendación Ideal
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Identificación de proyectos perfectamente alineados a
                            las capacidades del estudiante.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300 group shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold mb-6 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-colors duration-300">
                            3
                        </div>
                        <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">
                            Trazabilidad Total
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            La dirección mantiene un flujo de revisión centralizado para
                            evitar cuellos de botella.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all duration-300 group shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 bg-violet-50 dark:bg-slate-900 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold mb-6 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-colors duration-300">
                            4
                        </div>
                        <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">
                            Aprobación Rápida
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Eficiencia administrativa optimizada, reduciendo enormemente los
                            tiempos de gestión.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Steps;