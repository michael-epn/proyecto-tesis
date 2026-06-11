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
                const { data } = await clienteAxios.get('/estudiante/perfil');
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
        <div className="bg-white shadow-md rounded-sm border border-slate-200 p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Mi Perfil</h2>
                <Link 
                    to="/estudiante/configuracion" 
                    className="bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-indigo-600 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4 fill-current opacity-70" viewBox="0 0 16 16">
                        <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                    </svg>
                    Editar Perfil
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-3 w-full md:w-1/3">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                        {perfil?.fotoPerfil ? (
                            <img src={perfil.fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl text-slate-400 font-bold">
                                {perfil?.nombre?.charAt(0)}{perfil?.apellido?.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-lg text-slate-800">{perfil?.nombre} {perfil?.apellido}</h3>
                        <p className="text-sm text-slate-500">{perfil?.carrera || 'Estudiante'}</p>
                    </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 uppercase mb-2">Información de Contacto</h4>
                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                            <p className="text-sm text-slate-600"><span className="font-medium mr-2">Email:</span> {perfil?.email}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 uppercase mb-2">Intereses</h4>
                        <div className="flex flex-wrap gap-2">
                            {perfil?.intereses?.length > 0 ? (
                                perfil.intereses.map((interes, index) => (
                                    <span key={index} className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                        {interes}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">No hay intereses registrados.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-slate-800 uppercase mb-2">Habilidades Técnicas</h4>
                        <div className="flex flex-wrap gap-2">
                            {perfil?.habilidades_tecnicas?.length > 0 ? (
                                perfil.habilidades_tecnicas.map((hab, index) => (
                                    <span key={index} className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                        {hab}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">No hay habilidades registradas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerPerfilEstudiante;