import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Header() {
  const { isAuthenticated, user, rol } = useAuthStore();

  // LÓGICA CORREGIDA: Usamos template literals para que funcione con los 3 roles (estudiante, docente, comision)
  const dashboardRoute = rol ? `/${rol}` : '/';
  
  // Ruta dinámica para el perfil, basándonos en App.jsx (ej: /estudiante/perfil)
  const profileRoute = rol ? `/${rol}/perfil` : '/';

  // Obtenemos las iniciales del usuario para el avatar
  const iniciales = user ? `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`.toUpperCase() : 'UI';

  return (
    <header className="fixed w-full z-50 bg-white dark:bg-slate-900 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Logo / Título con Identidad EPN / ESFOT */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                SGT <span className="text-violet-600 dark:text-violet-400">ESFOT</span>
              </span>
            </Link>
          </div>

          {/* Navegación Derecha */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Botón hacia el Dashboard principal */}
                <Link 
                  to={dashboardRoute} 
                  className="hidden md:inline-flex items-center justify-center text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors"
                >
                  Mi Dashboard
                </Link>

                {/* ENLACE AL PERFIL: Envolvemos el avatar en un Link */}
                <Link to={profileRoute} title="Ver mi perfil">
                  <div className="h-10 w-10 rounded-full bg-violet-50 dark:bg-slate-800 border border-violet-200 dark:border-slate-700 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm cursor-pointer hover:ring-2 ring-violet-600/50 ring-offset-2 dark:ring-offset-slate-900 transition-all">
                    {iniciales}
                  </div>
                </Link>
              </div>
            ) : (
              <ul className="flex items-center gap-4">
                <li>
                  <Link to="/auth/login" className="text-slate-700 dark:text-slate-300 px-5 py-2.5 hover:text-violet-600 dark:hover:text-violet-400 transition duration-150 font-semibold text-sm">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link to="/auth/registro" className="text-sm font-bold inline-flex items-center justify-center bg-violet-600 text-white hover:bg-violet-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all">
                    Registrarse
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;