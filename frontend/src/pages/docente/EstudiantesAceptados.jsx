import { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';

const EstudiantesAceptados = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { user } = useAuthStore();

    const cuposMaximos = user?.cupos_maximos || 5; 
    const cuposOcupados = user?.cupos_ocupados || 0;
    const faltanCupos = cuposMaximos - cuposOcupados;
    const puedeEnviar = (cuposOcupados === cuposMaximos) && (solicitudes.length > 0);
    const [modalFeedback, setModalFeedback] = useState(false);
    const [solicitudAEliminar, setSolicitudAEliminar] = useState(null);
    const [textoFeedback, setTextoFeedback] = useState('');

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

    const abrirModalEliminar = (idSolicitud) => {
        setSolicitudAEliminar(idSolicitud);
        setTextoFeedback('');
        setModalFeedback(true);
    };

    const confirmarEliminacion = async () => {
        if (!textoFeedback || textoFeedback.trim() === "") {
            return toast.warning("El feedback es obligatorio para notificar la eliminación.");
        }
        
        try {
            await clienteAxios.delete(`/tesis/docente/eliminar-aceptado/${solicitudAEliminar}`, {
                data: { feedback: textoFeedback }
            });
            setSolicitudes(solicitudes.filter(sol => sol._id !== solicitudAEliminar));
            toast.success("Estudiante removido exitosamente e historial actualizado");
            
            // Cerrar y limpiar modal
            setModalFeedback(false);
            setTextoFeedback('');
            setSolicitudAEliminar(null);
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
            <header className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Estudiantes Aceptados</h2>
                <p className="text-slate-500 mt-2 font-medium">Gestiona tu lista final de estudiantes y envíala a la Comisión Académica.</p>
            </header>
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
                                        onClick={() => abrirModalEliminar(sol._id)}
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
                                        Debes completar tu límite exacto de <strong>{cuposMaximos} estudiantes en total</strong>. 
                                        Actualmente tienes {cuposOcupados} cupos ocupados globales, te {faltanCupos === 1 ? 'falta' : 'faltan'} <strong>{faltanCupos}</strong> para poder despachar este grupo a la comisión.
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
            {modalFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center gap-2">
                            <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-bold text-rose-800">Motivo de Eliminación</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4 font-medium">Por favor, escribe el feedback o motivo por el cual eliminas a este estudiante de tu lista final.</p>
                            <textarea 
                                value={textoFeedback}
                                onChange={(e) => setTextoFeedback(e.target.value)}
                                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                placeholder="Ej: Hubo un cambio de mutuo acuerdo respecto al alcance del proyecto..."
                            ></textarea>
                            <div className="mt-6 flex gap-3">
                                <button 
                                    onClick={confirmarEliminacion}
                                    disabled={textoFeedback.trim().length === 0}
                                    className="flex-1 bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 transition-colors disabled:bg-rose-300"
                                >
                                    Confirmar Eliminación
                                </button>
                                <button 
                                    onClick={() => setModalFeedback(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstudiantesAceptados;