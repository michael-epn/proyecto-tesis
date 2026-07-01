import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

function AuditoriaTramites() {
    const [tramites, setTramites] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalRechazo, setModalRechazo] = useState(false);
    const [textoFeedback, setTextoFeedback] = useState('');

    useEffect(() => {
        cargarTramites();
    }, []);

    const cargarTramites = async () => {
        try {
            const { data } = await clienteAxios.get('/comision/tramites-pendientes');
            setTramites(data);
        } catch (error) {
            toast.error("Error al cargar los trámites pendientes.");
        } finally {
            setCargando(false);
        }
    };

    const [tramiteActivo, setTramiteActivo] = useState(() => {
        const guardado = localStorage.getItem('tramiteActivo_comision');
        return guardado ? JSON.parse(guardado) : null;
    });
    const tomarTramite = async (tramite) => {
        try {
            const { data } = await clienteAxios.put(`/comision/tramites/tomar/${tramite._id}`);
            toast.info("Has bloqueado este trámite para tu revisión.");
            setTramiteActivo(data.tramite);
            localStorage.setItem('tramiteActivo_comision', JSON.stringify(data.tramite)); // <- Guardar
            cargarTramites(); 
        } catch (error) {
            toast.error(error.response?.data?.msg || "No se pudo tomar el trámite.");
        }
    };
    const limpiarTramiteActivo = () => {
        setTramiteActivo(null);
        localStorage.removeItem('tramiteActivo_comision');
    };

    const liberarTramite = async () => {
        if (!tramiteActivo) return;
        try {
            await clienteAxios.put(`/comision/tramites/liberar/${tramiteActivo._id}`);
            toast.success("Trámite liberado al Pool Global.");
            limpiarTramiteActivo();
            setModalRechazo(false);
            setTextoFeedback('');
            cargarTramites();
        } catch (error) {
            toast.error("Error al liberar el trámite.");
        }
    };

    const abrirModalRechazo = () => {
        setTextoFeedback('');
        setModalRechazo(true);
    };

    const resolverRechazo = async () => {
        if (!textoFeedback || textoFeedback.trim() === "") {
            return toast.warning("El feedback es obligatorio para rechazar la propuesta.");
        }

        try {
            await clienteAxios.put(`/comision/tramites/resolver/${tramiteActivo._id}`, {
                estadoFinal: 'rechazado_comision',
                feedback: textoFeedback
            });
            toast.success("Trámite rechazado con observaciones.");
            setModalRechazo(false);
            setTextoFeedback('');
            limpiarTramiteActivo();
            cargarTramites();
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al rechazar el trámite.");
        }
    };

    const resolverAprobacion = async () => {
        if (!window.confirm("¿Aprobar definitivamente este tema? El estudiante podrá iniciar su titulación.")) return;

        try {
            await clienteAxios.put(`/comision/tramites/resolver/${tramiteActivo._id}`, {
                estadoFinal: 'aprobado_final',
                feedback: "Aprobado por la Comisión."
            });
            toast.success("Trámite aprobado oficialmente.");
            limpiarTramiteActivo();
            cargarTramites();
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al aprobar el trámite.");
        }
    };

    if (cargando) return <div className="p-8 text-center font-bold text-slate-500">Cargando trámites...</div>;

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Pool Global de Auditoría</h2>
                    <p className="text-slate-500 mt-2 font-medium">Revisa y oficializa las duplas de estudiante/tutor aceptadas en la ESFOT.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    <div className={`${tramiteActivo ? 'lg:col-span-5' : 'lg:col-span-12'} transition-all duration-300`}>
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                            <div className="bg-slate-800 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">Bandeja de Entrada</h3>
                                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {tramites.length} Pendientes
                                </span>
                            </div>
                            
                            <div className="p-0">
                                {tramites.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400">
                                        <p className="text-lg font-medium">La bandeja de la comisión está vacía.</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-slate-100">
                                        {tramites.map((t) => (
                                            <li key={t._id} className="p-5 hover:bg-slate-50 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">{t.estudiante?.nombre} {t.estudiante?.apellido}</h4>
                                                        <p className="text-sm text-slate-500 font-medium mt-1">Tutor: {t.docente?.nombre} {t.docente?.apellido}</p>
                                                        
                                                        {t.estado === 'en_revision' ? (
                                                            <span className="inline-block mt-2 text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                                                                En revisión por: {t.revisor?.nombre || 'Colega'}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block mt-2 text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">
                                                                Libre (En Comisión)
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {t.estado === 'en_comision' && !tramiteActivo && (
                                                        <button 
                                                            onClick={() => tomarTramite(t)}
                                                            className="bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100 hover:border-indigo-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                                                        >
                                                            Revisar
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {tramiteActivo && (
                        <div className="lg:col-span-7 lg:sticky lg:top-8 bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden w-full">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Resolución de Trámite
                                </h3>
                                <button onClick={liberarTramite} className="text-slate-300 hover:text-white text-sm font-medium underline">
                                    Liberar y cerrar
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-5">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Propuesta del Estudiante</h4>
                                    <h2 className="text-lg font-extrabold text-slate-800 leading-tight">{tramiteActivo.tema?.titulo}</h2>
                                    <p className="text-slate-600 text-sm font-medium mt-2">{tramiteActivo.tema?.descripcion}</p>
                                    
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {tramiteActivo.tema?.tecnologias?.map((tech, i) => (
                                            <span key={i} className="inline-flex items-center px-2 py-1 bg-indigo-50 text-indigo-800 rounded-md text-xs font-bold border border-indigo-100">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Aval del Docente</h4>
                                    <p className="text-sm font-bold text-slate-700">Tutor asignado: {tramiteActivo.docente?.nombre} {tramiteActivo.docente?.apellido}</p>
                                    <p className="text-sm text-slate-600 italic mt-1 font-medium">"{tramiteActivo.feedback}"</p>
                                </div>

                                <div className="pt-4 flex gap-4 border-t border-slate-200">
                                    <button 
                                        onClick={abrirModalRechazo}
                                        className="flex-1 bg-white border text-sm border-red-300 text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-red-50 transition-colors shadow-sm"                                        >
                                        Rechazar con Observaciones
                                    </button>
                                    <button 
                                        onClick={resolverAprobacion}
                                        className="flex-1 bg-indigo-700 text-white text-sm font-bold py-3 px-4 rounded-xl hover:bg-indigo-800 transition-all shadow-md flex justify-center items-center"
                                    >
                                        Aprobar Definitivamente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modalRechazo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-2">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-bold text-red-800">Dictamen de Comisión</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4 font-medium">Por favor, detalla las observaciones por las cuales la comisión devuelve este trámite.</p>
                            <textarea 
                                value={textoFeedback}
                                onChange={(e) => setTextoFeedback(e.target.value)}
                                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                placeholder="Ej: La línea de investigación no se alinea con el alcance de la ESFOT..."
                            ></textarea>
                            <div className="mt-6 flex gap-3">
                                <button 
                                    onClick={resolverRechazo}
                                    disabled={textoFeedback.trim().length === 0}
                                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:bg-red-300"
                                >
                                    Confirmar Rechazo
                                </button>
                                <button 
                                    onClick={() => setModalRechazo(false)}
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
}

export default AuditoriaTramites;