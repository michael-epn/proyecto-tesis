import React from 'react';

function Features() {
  return (
    <section id="solucion" className="relative bg-slate-50 py-12 md:py-20 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="text-3xl font-bold text-[#0033A0] mb-4">Transformando la asignación en la ESFOT</h2>
            <p className="text-xl text-gray-600">
              Automatizamos procesos administrativos para eliminar cuellos de botella, garantizando que desarrolles software alineado a tus verdaderas fortalezas tecnológicas.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-16 items-start">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-white rounded shadow-xl border-t-4 border-[#C8102E]">
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-2 text-[#0033A0]">Algoritmos de Similitud</h4>
              <p className="text-gray-600 text-center">
                Procesamos historiales académicos y perfiles docentes para generar emparejamientos precisos y respaldados por datos.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-white rounded shadow-xl border-t-4 border-[#C8102E]">
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-2 text-[#0033A0]">Trazabilidad Centralizada</h4>
              <p className="text-gray-600 text-center">
                La dirección de la ESFOT obtiene visibilidad total del flujo de revisión y aprobación, equilibrando la carga docente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-white rounded shadow-xl border-t-4 border-[#C8102E]">
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-2 text-[#0033A0]">Prevención de Abandono</h4>
              <p className="text-gray-600 text-center">
                Al conectar tus intereses y rendimiento previo con el tema correcto, aumentamos la motivación y reducimos retrasos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;