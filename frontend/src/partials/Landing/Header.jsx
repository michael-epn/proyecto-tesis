import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="fixed w-full z-30 bg-[#0033A0] shadow-md transition-all duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Título */}
          <div className="shrink-0 mr-4">
            <Link to="/" className="block text-white font-bold text-xl tracking-wide">
              TESIS <span className="text-[#C8102E]">IA</span>
            </Link>
          </div>

          {/* Navegación Derecha */}
          <nav className="flex grow justify-end">
            <ul className="flex grow justify-end flex-wrap items-center space-x-4">
              <li>
                <Link to="/auth/login" className="text-slate-200 hover:text-white transition duration-150 ease-in-out font-medium">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/auth/registro" className="btn-sm text-white bg-[#C8102E] hover:bg-red-800 px-4 py-2 rounded shadow transition duration-150 ease-in-out">
                  Registrarse
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;