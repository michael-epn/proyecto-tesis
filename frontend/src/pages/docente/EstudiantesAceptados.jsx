import { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';

const EstudiantesAceptados = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { user } = useAuthStore();

    const cuposMaximos = user?.cupos_maximos || 5; 
    const faltanCupos = cuposMaximos - solicitudes.length;
    const puedeEnviar = solicitudes.length === cuposMaximos;

    useEffect(() => {
        cargarAceptados();
    }, []);

    const cargarAceptados = async () => {
        try {
            const { data } = await clienteAxios.get('/tesis/historial/recibidas');
            setSolicitudes(data.filter(sol => sol.estado === 'aceptada'));
        } catch (error) {
            toast.error("Error al cargar la lista");
        } finally {
            setCargando(false);
        }
    };

    const handleEliminar = async (idSolicitud) => {
        if(!window.confirm("¿Seguro que deseas remover a este estudiante? Perderá la tutoría.")) return;
        try {
            await clienteAxios.delete(`/tesis/docente/eliminar-aceptado/${idSolicitud}`);
            setSolicitudes(solicitudes.filter(sol => sol._id !== idSolicitud));
            toast.success("Estudiante removido exitosamente");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al eliminar");
        }
    };

    const handleEnviarComision = async () => {
        if (!puedeEnviar) {
            return toast.warning(`Aún te faltan ${faltanCupos} estudiantes para completar tu cupo de ${cuposMaximos}.`);
        }
        
        if(!window.confirm("¿Enviar esta lista final a la Comisión? Ya no podrás editarlos.")) return;
        
        try {
            const { data } = await clienteAxios.post('/tesis/docente/enviar-comision');
            toast.success(data.msg);
            setSolicitudes([]); 
        } catch (error) {
            toast.error("Error al enviar a la comisión");
        }
    };

    if (cargando) return <div className="p-8 text-center font-bold text-slate-500">Cargando lista...</div>;

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                
                <div className="bg-slate-800 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Mis Estudiantes Aceptados
                    </h2>
                    <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {solicitudes.length} estudiantes
                    </span>
                </div>

                <div className="p-6">
                    {solicitudes.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <p className="text-lg font-medium">No tienes estudiantes aceptados actualmente.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mb-8">
                            {solicitudes.map(sol => (
                                <div key={sol._id} className="flex flex-col md:flex-row justify-between items-center p-5 border border-slate-200 rounded-xl bg-slate-50">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">
                                            {sol.estudiante?.nombre} {sol.estudiante?.apellido}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium mt-1">Tema: {sol.tema?.titulo}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleEliminar(sol._id)}
                                        className="mt-4 md:mt-0 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm"
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-slate-200 pt-6 mt-4">
                        
                        {!puedeEnviar && solicitudes.length > 0 && (
                            <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-bold">Requisito de la Comisión</p>
                                    <p className="text-sm font-medium mt-1">
                                        Debes completar tu límite exacto de <strong>{cuposMaximos} estudiantes</strong> para poder enviar el reporte. 
                                        Actualmente tienes {solicitudes.length}, te {faltanCupos === 1 ? 'falta' : 'faltan'} <strong>{faltanCupos}</strong>.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleEnviarComision}
                            disabled={!puedeEnviar}
                            className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl hover:bg-violet-700 transition-colors shadow-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex justify-center items-center gap-2"
                        >
                            Confirmar Tutorías y Enviar a Comisión
                        </button>
                        <p className="text-xs text-center text-slate-500 mt-3 font-medium">
                            Al enviar, los estudiantes pasarán a revisión administrativa y no podrás eliminarlos de esta lista.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstudiantesAceptados;