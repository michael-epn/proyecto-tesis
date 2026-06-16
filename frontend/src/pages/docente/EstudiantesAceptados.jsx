import { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';

const EstudiantesAceptados = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);

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
        if(solicitudes.length === 0) return toast.warning("No tienes estudiantes aceptados para enviar.");
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
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-800 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-extrabold text-white">Mis Estudiantes Aceptados</h2>
                    <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
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
                                <div key={sol._id} className="flex flex-col md:flex-row justify-between items-center p-5 border border-slate-200 rounded-xl hover:shadow-md transition-shadow bg-slate-50">
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

                    <div className="border-t border-slate-200 pt-6">
                        <button 
                            onClick={handleEnviarComision}
                            disabled={solicitudes.length === 0}
                            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg disabled:bg-slate-300 disabled:shadow-none flex justify-center items-center gap-2"
                        >
                            Confirmar Tutorías y Enviar a Comisión
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
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