import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const VerPerfilDocente = () => {
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get(`/docente/perfil?t=${new Date().getTime()}`);
                setPerfil(data);
            } catch (error) {
                toast.error("Error al cargar la información del perfil");
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, []);
    
    if (cargando) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="w-full min-h-full bg-slate-50 p-4 md:p-8">
            <div className="w-full max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                    <div 
                        className="h-32 md:h-48 bg-gradient-to-r from-indigo-600 to-blue-500 relative flex justify-end p-4 md:p-6"
                        style={perfil?.bannerPerfil ? { backgroundImage: `url(${perfil.bannerPerfil})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                        <Link 
                            to="/docente/configuracion" 
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
                                <img src={perfil.fotoPerfil} alt="Foto de perfil del docente" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl md:text-6xl text-slate-400 font-bold tracking-tight uppercase">
                                    {perfil?.nombre?.charAt(0)}{perfil?.apellido?.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div className="mt-2 w-full flex flex-col md:flex-row justify-between items-start md:items-end">
                            <div>
                                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{perfil?.nombre} {perfil?.apellido}</h2>
                                <p className="text-lg text-indigo-600 font-semibold mt-1 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                    </svg>
                                    Docente Tutor
                                </p>
                            </div>
                            
                            <div className="mt-4 md:mt-0">
                                {perfil?.disponibilidad && (perfil?.cupos_ocupados < perfil?.cupos_maximos) ? (
                                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-full border border-emerald-200">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Disponible para tutorías
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-sm font-bold px-4 py-2 rounded-full border border-rose-200">
                                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                        {perfil?.cupos_ocupados >= perfil?.cupos_maximos 
                                            ? "Límite de cupos alcanzado" 
                                            : "No disponible temporalmente"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
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

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Capacidad de Tutoría
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${perfil?.cupos_ocupados >= perfil?.cupos_maximos ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {perfil?.cupos_ocupados || 0}/{perfil?.cupos_maximos || 0}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Estado de Cupos</p>
                                        <p className="text-xs text-slate-500">
                                            {perfil?.cupos_maximos - (perfil?.cupos_ocupados || 0)} disponibles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Áreas de Investigación
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {perfil?.areas_investigacion?.length > 0 ? (
                                        perfil.areas_investigacion.map((area, index) => (
                                            <span key={index} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm px-4 py-1.5 rounded-full font-semibold">
                                                {area}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 italic w-full p-4 bg-slate-50 rounded-lg text-center border border-dashed border-slate-300">
                                            No se han registrado áreas de investigación.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    Tecnologías de Especialidad
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {perfil?.tecnologias_especialidad?.length > 0 ? (
                                        perfil.tecnologias_especialidad.map((tech, index) => (
                                            <span key={index} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm px-4 py-1.5 rounded-full font-semibold">
                                                {tech}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 italic w-full p-4 bg-slate-50 rounded-lg text-center border border-dashed border-slate-300">
                                            No se han registrado tecnologías específicas.
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

export default VerPerfilDocente;