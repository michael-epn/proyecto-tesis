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
            localStorage.setItem('tramiteActivo_comision', JSON.stringify(data.tramite));
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className={`${tramiteActivo ? 'lg:col-span-1' : 'lg:col-span-2'} transition-all duration-300 w-full`}>
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center rounded-t-2xl">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    Bandeja de Entrada
                                </h3>
                                <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
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
                                            <li key={t._id} className="p-5 border-b border-slate-100 last:border-0 group">
                                                <div className="flex justify-between items-center gap-4">
                                                    
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <div className="bg-slate-200/50 p-1.5 rounded-lg text-slate-600">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <h4 className="font-extrabold text-slate-800 text-base">
                                                                Tutor: {t.docente?.nombre} {t.docente?.apellido}
                                                            </h4>
                                                        </div>
                                                        <div className="ml-9">
                                                            <p className="text-sm text-slate-500 font-medium">
                                                                Estudiante: <span className="text-slate-700 font-bold">{t.estudiante?.nombre} {t.estudiante?.apellido}</span>
                                                            </p>
                                                            <div className="mt-2">
                                                                {t.estado === 'en_revision' ? (
                                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                                        En revisión por: {t.revisor?.nombre || 'Colega'}
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                                                                        Libre (En Comisión)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {t.estado === 'en_comision' && !tramiteActivo && (
                                                        <button 
                                                            onClick={() => tomarTramite(t)}
                                                            className="flex-shrink-0 bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-800 font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
                                                        >
                                                            Revisar
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                            </svg>
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
                        <div className="lg:col-span-1 lg:sticky lg:top-8 bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden w-full">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center rounded-t-2xl">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Resolución de Trámite
                                </h3>
                                <button 
                                    onClick={liberarTramite} 
                                    className="flex items-center gap-1.5 bg-slate-500/10 hover:bg-violet-500/20 text-slate-300 hover:text-violet-300 border border-slate-500/20 hover:border-violet-500/30 py-1.5 px-3 rounded-full transition-all text-xs font-bold"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cerrar
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Propuesta del Estudiante
                                    </h4>
                                    <h2 className="text-lg font-extrabold text-slate-800 leading-tight mb-2">{tramiteActivo.tema?.titulo}</h2>
                                    <p className="text-slate-600 text-sm font-medium mb-4">{tramiteActivo.tema?.descripcion}</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {tramiteActivo.tema?.tecnologias?.map((tech, i) => (
                                            <span key={i} className="inline-flex items-center px-3 py-1 bg-white text-violet-500 rounded-lg text-xs font-bold border border-slate-200 shadow-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Aval del Docente
                                    </h4>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200 mt-2">
                                        <p className="text-sm text-slate-600 italic font-medium">"{tramiteActivo.feedback}"</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button 
                                        onClick={abrirModalRechazo}
                                        className="flex-1 bg-white border border-slate-300 text-slate-700 text-sm font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"                                        >
                                        Rechazar (Observaciones)
                                    </button>
                                    <button 
                                        onClick={resolverAprobacion}
                                        className="flex-1 bg-violet-600 text-white text-sm font-bold py-3 px-4 rounded-xl hover:bg-violet-700 transition-all shadow-md flex justify-center items-center"
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