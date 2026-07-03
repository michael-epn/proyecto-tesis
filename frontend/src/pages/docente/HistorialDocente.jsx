import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const HistorialDocente = () => {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [feedbackModal, setFeedbackModal] = useState({ abierto: false, texto: '', titulo: '', remitente: '' });
    const [orden, setOrden] = useState('reciente');

    useEffect(() => {
        const obtenerHistorial = async () => {
            try {
                const { data } = await clienteAxios.get('/tesis/historial/recibidas');
                const estadosGestionados = ['aceptada', 'rechazada', 'en_comision', 'en_revision', 'aprobado_final', 'rechazado_comision'];
                const gestionadas = data.filter(sol => estadosGestionados.includes(sol.estado));
                setHistorial(gestionadas);
            } catch (error) {
                toast.error("Error al cargar el historial de gestiones");
            } finally {
                setCargando(false);
            }
        };
        obtenerHistorial();
    }, []);

    const estadosActivos = ['aceptada', 'en_comision', 'en_revision', 'aprobado_final'];
    const cuposOcupados = historial.filter(sol => estadosActivos.includes(sol.estado)).length;

    const historialOrdenado = [...historial].sort((a, b) => {
        const fechaA = new Date(a.updatedAt || a.createdAt || 0);
        const fechaB = new Date(b.updatedAt || b.createdAt || 0);
        return orden === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
    });

    const abrirModal = (sol) => {
        const esDeComision = sol.estado.includes('comision') || sol.estado === 'aprobado_final';
        setFeedbackModal({ 
            abierto: true, 
            texto: sol.feedback || 'Sin observaciones registradas.',
            titulo: sol.tema?.titulo,
            remitente: esDeComision ? 'Dictamen de Comisión' : 'Tu Feedback Emitido'
        });
    };

    const renderBadgeEstado = (estado) => {
        switch(estado) {
            case 'aprobado_final':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Aprobado en Comisión
                    </span>
                );
            case 'rechazado_comision':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Devuelto en Comisión
                    </span>
                );
            case 'en_comision':
            case 'en_revision':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        En Auditoría
                    </span>
                );
            case 'aceptada':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 border border-violet-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Aceptada (Local)
                    </span>
                );
            case 'rechazada':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Rechazada (Local)
                    </span>
                );
            default:
                return null;
        }
    };
    const handleReiniciarCupos = async () => {
        if(!window.confirm("¿Estás seguro? Esto limpiará tu contador. Si no tienes permiso de la comisión, la acción será rechazada.")) return;
        
        try {
            const { data } = await clienteAxios.post('/tesis/docente/reiniciar-cupos');
            toast.success(data.msg);
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al solicitar reinicio");
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Historial de Tutorías</h2>
                            <p className="text-slate-500 mt-2 font-medium">Audita el estado de tus estudiantes en la Comisión y tus resoluciones locales.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ordenar por:</label>
                            <select 
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block p-2 outline-none shadow-sm cursor-pointer"
                            >
                                <option value="reciente">Última actualización</option>
                                <option value="antiguo">Más antiguos</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <div className="bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-sm flex items-center gap-4">
                            <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Cupos Activos</p>
                                <p className="text-xl font-extrabold text-slate-800">{cuposOcupados} <span className="text-sm font-medium text-slate-400">estudiantes</span></p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleReiniciarCupos}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Ejecutar Reinicio de Cupos
                        </button>
                    </div>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Gestiones y Trazabilidad
                        </h3>
                        <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {historial.length} gestiones
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold w-1/3">Estudiante</th>
                                    <th className="px-6 py-4 font-bold">Tema de Tesis</th>
                                    <th className="px-6 py-4 font-bold text-center">Estado Actual</th>
                                    <th className="px-6 py-4 font-bold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cargando ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : historialOrdenado.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            Aún no has gestionado ninguna solicitud.
                                        </td>
                                    </tr>
                                ) : (
                                    historialOrdenado.map((sol) => (
                                        <tr key={sol._id}>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800 text-base">{sol.estudiante?.nombre} {sol.estudiante?.apellido}</div>
                                                <div className="text-xs font-medium text-slate-500 mt-1">{sol.estudiante?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-medium text-slate-700">{sol.tema?.titulo}</div>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                {renderBadgeEstado(sol.estado)}
                                                <div className="text-[10px] text-slate-400 font-medium mt-2">
                                                    {new Date(sol.updatedAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                <button 
                                                    onClick={() => abrirModal(sol)}
                                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-violet-600 font-bold text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Ver Detalles
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Detalles replicado */}
            {feedbackModal.abierto && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Registro de Observaciones
                            </h3>
                            <button onClick={() => setFeedbackModal({ abierto: false, texto: '', titulo: '', remitente: '' })} className="text-slate-300 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tema de Tesis</h4>
                            <p className="text-slate-800 font-bold mb-4 pb-4 border-b border-slate-100">{feedbackModal.titulo}</p>
                            
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{feedbackModal.remitente}</h4>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="text-slate-700 leading-relaxed font-medium italic">"{feedbackModal.texto}"</p>
                            </div>

                            <button 
                                onClick={() => setFeedbackModal({ abierto: false, texto: '', titulo: '', remitente: '' })}
                                className="mt-6 w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-900 transition-colors shadow-md"
                            >
                                Cerrar Ventana
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialDocente;