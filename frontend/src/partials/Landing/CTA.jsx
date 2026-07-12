import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function CTA() {
    const navigate = useNavigate();
    const { isAuthenticated, rol } = useAuthStore();

    const handleAccess = () => {
        if (isAuthenticated && rol) {
            navigate(`/${rol}`);
        } else {
            navigate('/auth/login');
        }
    };

    return (
        <section className="py-24 bg-slate-900 text-center px-4 relative overflow-hidden border-t border-slate-800">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Impulsa tu titulación hoy mismo
                </h2>
                
                <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Únete a la plataforma inteligente de la <span className="text-violet-400 font-semibold">ESFOT</span> que aporta significativamente a la transformación digital de la facultad.
                </p>
                
                <div className="pt-4">
                    <button
                        onClick={handleAccess}
                        className="bg-violet-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-md hover:bg-violet-700 active:scale-[0.98] transition-all duration-200"
                    >
                        {isAuthenticated ? 'Ir a mi Panel de Control' : 'Ingresar al Portal'}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CTA;