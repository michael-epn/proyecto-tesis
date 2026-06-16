import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const VerPerfilEstudiante = () => {
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get(`/estudiante/perfil?t=${new Date().getTime()}`);
                setPerfil(data);
            } catch (error) {
                toast.error("Error al cargar la información del perfil");
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, []);

    if (cargando) return <div className="text-center mt-10">Cargando información...</div>;

    return (
        <div className="w-full min-h-full bg-slate-50 p-4 md:p-8">
            <div className="w-full max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                    <div 
                        className="h-32 md:h-48 bg-gradient-to-r from-indigo-600 to-blue-500 relative flex justify-end p-4 md:p-6"
                        style={perfil?.bannerPerfil ? { backgroundImage: `url(${perfil.bannerPerfil})` } : {}}
                    >
                        <Link 
                            to="/estudiante/configuracion" 
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-all flex items-center gap-2 border border-white/30 shadow-sm h-fit"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                                <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                            </svg>
                            Editar Perfil
                        </Link>
                    </div>

                <div className="px-6 md:px-12 pb-12">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20 mb-10 relative z-10">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center shrink-0">
                            {perfil?.fotoPerfil ? (
                                <img src={perfil.fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl md:text-6xl text-slate-400 font-bold tracking-tight uppercase">
                                    {perfil?.nombre?.charAt(0)}{perfil?.apellido?.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="mt-2 w-full">
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{perfil?.nombre} {perfil?.apellido}</h2>
                            <p className="text-lg text-indigo-600 font-semibold mt-1 flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                                {perfil?.carrera}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contacto
                                </h4>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Correo Electrónico</p>
                                    <p className="text-sm font-semibold text-slate-800 break-all">{perfil?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8m-4-4v4m-4-4h8a2 2 0 002-2V5H6v10a2 2 0 002 2zm10-10h2a1 1 0 011 1v1a4 4 0 01-4 4M6 7H4a1 1 0 00-1 1v1a4 4 0 004 4"/>
                                    </svg>
                                    Materias Favoritas
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {perfil?.materias_favoritas?.length > 0 ? (
                                        perfil.materias_favoritas.map((materia, index) => (
                                            <span key={index} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm px-4 py-1.5 rounded-full font-semibold">
                                                {materia}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 italic w-full p-4 bg-slate-50 rounded-lg text-center border border-dashed border-slate-300">
                                            Aún no has registrado tus materias favoritas.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    Cursos Adicionales
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {perfil?.cursos_adicionales?.length > 0 ? (
                                        perfil.cursos_adicionales.map((curso, index) => (
                                            <span key={index} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm px-4 py-1.5 rounded-full font-semibold">
                                                {curso}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 italic w-full p-4 bg-slate-50 rounded-lg text-center border border-dashed border-slate-300">
                                            Aún no has registrado tus cursos adicionales.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerPerfilEstudiante;