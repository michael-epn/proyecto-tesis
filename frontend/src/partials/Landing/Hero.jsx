import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Hero() {
  const { isAuthenticated, rol } = useAuthStore();
  return (
    <section className="relative bg-white dark:bg-slate-900 overflow-hidden pt-24 md:pt-32">
      {/* Fondo punteado adaptado a la paleta neutra */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-16 pb-20 md:pt-8 md:pb-24 lg:flex lg:items-start lg:gap-12">
          
          {/* Texto Principal */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 bg-violet-50 dark:bg-slate-800 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-slate-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse"></span>
              Sistema de Gestión de Titulación
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-6">
              Optimiza tu proceso de titulación en la <span className="text-violet-600 dark:text-violet-400">ESFOT</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Una plataforma inteligente diseñada para conectar estudiantes, docentes y la comisión académica. Gestiona perfiles, propuestas y flujos de trabajo en un solo lugar.
            </p>
          </div>

          {/* Imagen / Mockup publicitario */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative hidden md:block">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] blur opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
              alt="Dashboard Académico" 
              className="relative rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 object-cover h-[400px] w-full" 
            />
            
            {/* Tarjeta flotante interactiva */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 w-72 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-violet-50 dark:bg-slate-900/50 p-2 rounded-full">
                <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estado del Proceso</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Validación de Perfil Completa</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;