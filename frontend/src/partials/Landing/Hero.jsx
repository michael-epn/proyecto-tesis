import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4 text-[#0033A0]">
            Encuentra tu tema de tesis ideal con <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C8102E] to-red-500">Inteligencia Artificial</span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              Olvídate de la frustración al elegir tu trabajo de titulación. Nuestro sistema cruza tu historial académico, habilidades y los perfiles docentes de la ESFOT para recomendarte el proyecto y tutor perfectos.
            </p>
            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
              <div>
                <Link to="/auth/registro" className="btn text-white bg-[#C8102E] hover:bg-red-800 w-full mb-4 sm:w-auto sm:mb-0 sm:mr-4 px-6 py-3 rounded-lg shadow-lg font-semibold transition-all">
                  Comenzar mi proyecto
                </Link>
              </div>
              <div>
                <a href="#solucion" className="btn text-[#0033A0] bg-gray-100 hover:bg-gray-200 w-full sm:w-auto px-6 py-3 rounded-lg shadow font-semibold transition-all">
                  Conocer más
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;