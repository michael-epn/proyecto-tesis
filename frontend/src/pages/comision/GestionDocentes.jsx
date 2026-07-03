import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const GestionDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDocentes();
    }, []);

    const cargarDocentes = async () => {
        try {
            const { data } = await clienteAxios.get('/comision/docentes');
            setDocentes(data);
        } catch (error) {
            toast.error("Error al cargar la lista de docentes");
        } finally {
            setCargando(false);
        }
    };

    const handleTogglePermiso = async (id, valorActual) => {
        try {
            const nuevoEstado = !valorActual;
            const { data } = await clienteAxios.put(`/comision/docentes/permiso-reinicio/${id}`, {
                permiso_reinicio: nuevoEstado
            });
            
            setDocentes(docentes.map(docente => 
                docente._id === id ? { ...docente, permiso_reinicio: nuevoEstado } : docente
            ));
            
            toast.success(data.msg || "Permiso actualizado correctamente");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el permiso");
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Docentes y Cupos</h2>
                            <p className="text-slate-500 mt-2 font-medium">Administra los permisos especiales y supervisa la carga de los tutores.</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Directorio de Tutores
                        </h3>
                        <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {docentes.length} registrados
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold w-1/3">Docente</th>
                                    <th className="px-6 py-4 font-bold text-center">Estado y Disponibilidad</th>
                                    <th className="px-6 py-4 font-bold text-center">Ocupación de Cupos</th>
                                    <th className="px-6 py-4 font-bold text-center">Permiso de Reinicio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cargando ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : docentes.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            No hay docentes registrados en el sistema.
                                        </td>
                                    </tr>
                                ) : (
                                    docentes.map((docente) => {
                                        const estaLleno = docente.cupos_ocupados >= docente.cupos_maximos;
                                        const porcentaje = docente.cupos_maximos > 0 ? (docente.cupos_ocupados / docente.cupos_maximos) * 100 : 0;
                                        
                                        return (
                                            <tr key={docente._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="font-bold text-slate-800 text-base">{docente.nombre} {docente.apellido}</div>
                                                    <div className="text-xs font-medium text-slate-500 mt-1">{docente.email}</div>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-center">
                                                    {docente.disponibilidad ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-200">
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wide border border-rose-200">
                                                            Pausado
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 align-middle">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className={`text-sm font-bold ${estaLleno ? 'text-rose-600' : 'text-slate-700'}`}>
                                                            {docente.cupos_ocupados} / {docente.cupos_maximos} ocupados
                                                        </span>
                                                        <div className="w-full max-w-[120px] bg-slate-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full ${estaLleno ? 'bg-rose-500' : 'bg-violet-500'}`} 
                                                                style={{ width: `${porcentaje}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 align-middle text-center">
                                                    <label className="relative inline-flex items-center cursor-pointer justify-center">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={docente.permiso_reinicio || false}
                                                            onChange={() => handleTogglePermiso(docente._id, docente.permiso_reinicio)}
                                                        />
                                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                        <span className={`ml-3 text-xs font-bold ${docente.permiso_reinicio ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                            {docente.permiso_reinicio ? 'Concedido' : 'Denegado'}
                                                        </span>
                                                    </label>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionDocentes;