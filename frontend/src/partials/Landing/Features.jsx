import React from 'react';

function Features() {
  return (
    <div id="solucion" className="bg-slate-50 dark:bg-slate-900/50">
      
      {/* Banner de Métricas */}
      <div className="border-t border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around items-center text-center gap-6 opacity-90">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">IA</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Generación Inteligente</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">0%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Cuellos de Botella</p>
            </div>
            <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Trazabilidad Centralizada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Identificando Cuellos de Botella */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-16">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-6">Identificando los Cuellos de Botella</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                La asignación manual de temas y tutores en la ESFOT genera desequilibrio en la carga docente y elecciones desconectadas de las fortalezas de los estudiantes.
              </p>
              <ul className="space-y-5 mt-8">
                <li className="flex items-start gap-4">
                  <div className="bg-violet-50 dark:bg-slate-800 p-2 rounded-lg text-violet-600 dark:text-violet-400 flex-shrink-0 border border-violet-100 dark:border-slate-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Solución Escalable con IA</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Implementación de sistemas para procesar historiales académicos y perfiles docentes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-violet-50 dark:bg-slate-800 p-2 rounded-lg text-violet-600 dark:text-violet-400 flex-shrink-0 border border-violet-100 dark:border-slate-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Algoritmos de Similitud</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tecnología que optimiza la generación de temas precisas y garantiza la viabilidad.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-violet-600/10 dark:bg-violet-900/20 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Respaldo Científico</span>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-violet-100 dark:border-slate-700">Referencia Verificada</span>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic">"La implementación de sistemas de recomendación con Inteligencia Artificial (IA) ofrece una solución escalable... viabilidad respaldada por la literatura científica [1]."</p>
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 border-l-4 border-l-violet-600">
                    <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wide">Cita Generada (IEEE)</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                      [1] G. Adomavicius y A. Tuzhilin, "Toward the next generation of recommender systems: a survey of the state-of-the-art and possible extensions," <i>IEEE Transactions on Knowledge and Data Engineering</i>, vol. 17, no. 6, pp. 734-749, Jun. 2005.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Transformación Digital */}
      <section className="py-24 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-slate-900 dark:text-white">Transformación Digital de Procesos</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium text-lg">Promoviendo una orientación sólida alineada a las necesidades tecnológicas actuales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tarjeta 1 - Orientación (Acento Violeta) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 dark:bg-slate-800 rounded-bl-full -mr-8 -mt-8 opacity-100 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center mb-6 border border-violet-100 dark:border-slate-700 relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 relative z-10">Orientación Estudiantil</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 relative z-10">Mitiga la desmotivación encontrando áreas de conocimiento afines a tu experiencia previa y rendimiento.</p>
            </div>

            {/* Tarjeta 2 - Balance (Acento Índigo/Azul para variar ligeramente dentro de la misma paleta fría) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-slate-800 rounded-bl-full -mr-8 -mt-8 opacity-100 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6 border border-indigo-100 dark:border-slate-700 relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 relative z-10">Balance Docente</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 relative z-10">Equilibrio efectivo en la carga docente, asignando tutores cuyas especialidades coincidan con los temas.</p>
            </div>

            {/* Tarjeta 3 - Eficiencia (Acento Pizarra/Gris) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-bl-full -mr-8 -mt-8 opacity-100 group-hover:scale-110 transition-transform"></div>
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 relative z-10">Eficiencia Administrativa</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 relative z-10">La dirección evita que el histórico de graduados se desperdicie, centralizando datos para las decisiones en la carrera.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Features;