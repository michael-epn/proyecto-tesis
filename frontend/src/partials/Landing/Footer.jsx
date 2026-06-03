import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#002855] text-gray-300 py-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-sm">
            &copy; {new Date().getFullYear()} Escuela Politécnica Nacional - ESFOT. Todos los derechos reservados.
          </div>
          <div className="text-sm">
            Sistema Inteligente de Orientación Académica
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;