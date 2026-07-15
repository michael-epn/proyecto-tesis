import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Header() {
  const { isAuthenticated, user, rol } = useAuthStore();
  const dashboardRoute = rol ? `/${rol}` : '/';
  const profileRoute = rol ? `/${rol}/perfil` : '/';
  const iniciales = user ? `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}` : 'UI';

  return (
    <header className="fixed w-full z-50 bg-white dark:bg-slate-900 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                TEMAS <span className="text-violet-600 dark:text-violet-400">IA</span>
              </span>
            </Link>
          </div>

          <nav className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link 
                  to={dashboardRoute} 
                  className="hidden md:inline-flex items-center justify-center text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl transition-colors"
                >
                  Mi Dashboard
                </Link>

                <Link to={profileRoute} title="Ver mi perfil">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-violet-50 dark:bg-slate-800 border border-violet-200 dark:border-slate-700 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-sm cursor-pointer hover:ring-2 ring-violet-600/50 ring-offset-2 dark:ring-offset-slate-900 transition-all">
                    {iniciales}
                  </div>
                </Link>
              </div>
            ) : (
              <ul className="flex items-center gap-1 sm:gap-4">
                <li>
                  <Link to="/auth/login" 
                    className="text-slate-700 dark:text-slate-300 px-2 sm:px-5 py-2 hover:text-violet-600 dark:hover:text-violet-400 transition duration-150 font-semibold text-xs sm:text-sm whitespace-nowrap"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link to="/auth/registro" 
                    className="text-xs sm:text-sm font-bold inline-flex items-center justify-center bg-violet-600 text-white hover:bg-violet-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                  >
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