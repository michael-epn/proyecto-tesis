import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

function AuditoriaTramites() {
    const [tramites, setTramites] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [modalRechazo, setModalRechazo] = useState(false);
    const [textoFeedback, setTextoFeedback] = useState('');
    const user = useAuthStore   ((state) => state.user);
    const comisionadoId = user?._id || 'global';
    const storageKey = `tramiteActivo_comision_${comisionadoId}`;
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
        const guardado = localStorage.getItem(storageKey);
        return guardado ? JSON.parse(guardado) : null;
    });

    const tomarTramite = async (tramite) => {
        try {
            const { data } = await clienteAxios.put(`/comision/tramites/tomar/${tramite._id}`);
            toast.info("Has bloqueado este trámite para tu revisión.");
            setTramiteActivo(data.tramite);
            localStorage.setItem(storageKey, JSON.stringify(data.tramite));
            cargarTramites(); 
        } catch (error) {
            toast.error(error.response?.data?.msg || "No se pudo tomar el trámite.");
        }
    };

    const limpiarTramiteActivo = () => {
        setTramiteActivo(null);
        localStorage.removeItem(storageKey);
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
        <div className="w-full min-h-screen relative">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Pool Global de Auditoría</h2>
                    <p className="text-slate-500 mt-2 font-medium">Revisa y oficializa las duplas de estudiante/tutor aceptadas en la ESFOT.</p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className={`${tramiteActivo ? 'lg:col-span-1' : 'lg:col-span-2'} transition-all duration-300 w-full`}>
                        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
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
                                                            <div className="bg-slate-200/50 dark:bg-slate-800 p-1.5 rounded-lg text-slate-600 dark:text-slate-400">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">
                                                                Tutor: {t.docente?.nombre} {t.docente?.apellido}
                                                            </h4>
                                                        </div>
                                                        <div className="ml-9">
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                                Estudiante: <span className="text-slate-700 dark:text-slate-200 font-bold">{t.estudiante?.nombre} {t.estudiante?.apellido}</span>
                                                            </p>
                                                            <div className="mt-2">
                                                                {t.estado === 'en_revision' ? (
                                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800/50">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                                        En revisión por: {t.revisor?.nombre || 'Colega'}
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-800/50">
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
                                                            className="flex-shrink-0 bg-white dark:bg-slate-900 border border-violet-200 dark:border-slate-800 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-800 hover:text-violet-800 dark:hover:text-violet-300 font-bold py-2.5 px-5 rounded-xl text-sm shadow-sm flex items-center gap-2"
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
                        <div className="lg:col-span-1 lg:sticky lg:top-8 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden w-full">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center rounded-t-2xl">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Resolución de Trámite
                                </h3>
                                <button 
                                    onClick={liberarTramite} 
                                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-violet-500/20 dark:hover:text-violet-300 dark:hover:border-violet-500/40"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cerrar
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Propuesta del Estudiante
                                    </h4>
                                    <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 leading-tight mb-2">{tramiteActivo.tema?.titulo}</h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-4">{tramiteActivo.tema?.descripcion}</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {tramiteActivo.tema?.tecnologias?.map((tech, i) => (
                                            <span key={i} className="inline-flex items-center px-3 py-1 bg-white dark:bg-slate-900 text-violet-500 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Aval del Docente
                                    </h4>
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 mt-2">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium">"{tramiteActivo.feedback}"</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button 
                                        onClick={abrirModalRechazo}
                                        className="flex-1 text-sm text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm hover:bg-slate-900 dark:hover:bg-slate-700 bg-slate-800"                                        >
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
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="bg-rose-50 dark:bg-rose-900 px-6 py-4 border-b border-rose-100 dark:border-rose-700 flex items-center gap-2">
                            <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400">Motivo de Rechazo</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">Por favor, escribe el feedback o motivo por el cual no puedes aceptar esta tutoría.</p>
                            <textarea 
                                value={textoFeedback}
                                onChange={(e) => setTextoFeedback(e.target.value)}
                                className="w-full h-32 px-4 py-3 dark:bg-slate-900 bg-white text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                placeholder="Ej: Actualmente me encuentro enfocado en otras áreas de investigación..."
                            ></textarea>
                            <div className="mt-6 flex gap-3">
                                <button 
                                    onClick={resolverRechazo}
                                    disabled={textoFeedback.trim().length === 0}
                                    className="flex-1 bg-rose-600 dark:bg-rose-800 text-slate-50 font-bold py-3 rounded-xl hover:bg-rose-700 dark:hover:bg-rose-700 transition-colors disabled:bg-rose-300 dark:disabled:bg-rose-950 dark:disabled:text-slate-600"
                                >
                                    Confirmar Rechazo
                                </button>
                                <button 
                                    onClick={() => setModalRechazo(false)}
                                    className="flex-1 font-bold py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-900 dark:hover:bg-slate-700"
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