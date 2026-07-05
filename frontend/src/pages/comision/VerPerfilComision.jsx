import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const VerPerfilComision = () => {
    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get(`/comision/perfil?t=${new Date().getTime()}`);
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
        <div className="w-full min-h-full">
            <div className="w-full max-w-6xl mx-auto bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                
                <div 
                    className="h-32 md:h-48 bg-gradient-to-r from-violet-600 to-blue-500 relative flex justify-end p-4 md:p-6"
                    style={perfil?.bannerPerfil ? { backgroundImage: `url(${perfil.bannerPerfil})` } : {}}
                >
                    <Link 
                        to="/comision/configuracion" 
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm h-fit"
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
                            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">{perfil?.nombre} {perfil?.apellido}</h2>
                            <p className="text-lg text-violet-600 font-semibold mt-1 flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {perfil?.cargo}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-8">
                            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contacto
                                </h4>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Correo Electrónico</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">{perfil?.email}</p>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Cédula</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{perfil?.cedula}</p>
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Celular</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{perfil?.celular}</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col justify-center items-center text-center">
                                <div className="w-16 h-16 bg-violet-50 dark:bg-violet-950/40 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4V5a2 2 0 00-2-2H9a2 2 0 00-2 2v7z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Miembro de Comisión</h4>
                                <p className="text-sm text-slate-500 mt-2 max-w-lg">
                                    Como autoridad de la ESFOT, tienes permisos para revisar, auditar y emitir resoluciones definitivas sobre los procesos de titulación de los estudiantes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerPerfilComision;