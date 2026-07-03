import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const HistorialEstudiante = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [feedbackModal, setFeedbackModal] = useState({ abierto: false, texto: '', titulo: '' });
    const [orden, setOrden] = useState('reciente');

    useEffect(() => {
        const obtenerHistorial = async () => {
            try {
                const { data } = await clienteAxios.get('/tesis/mis-solicitudes');
                setSolicitudes(data);
            } catch (error) {
                toast.error("Error al cargar tu historial de trámites");
            } finally {
                setCargando(false);
            }
        };
        obtenerHistorial();
    }, []);

    const getBadgeEstilo = (estado) => {
        switch (estado) {
            case 'aprobado_final':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Aprobado (Final)
                    </span>
                );
            case 'finalizado':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Finalizado por Docente
                    </span>
                );
            case 'aceptada':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 border border-violet-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Aval Docente
                    </span>
                );
            case 'rechazada':
            case 'rechazado_comision':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Rechazado
                    </span>
                );
            case 'en_comision':
            case 'en_revision':
            case 'enviada':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        En Revisión
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wide">
                        Pendiente
                    </span>
                );
        }
    };

    const solicitudesOrdenadas = [...solicitudes].sort((a, b) => {
        const fechaA = new Date(a.createdAt || 0);
        const fechaB = new Date(b.createdAt || 0);
        return orden === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
    });

    const abrirModal = (sol) => {
        setFeedbackModal({ 
            abierto: true, 
            texto: sol.feedback || 'Sin comentarios registrados aún.',
            titulo: sol.tema?.titulo
        });
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Mis Solicitudes de Tesis</h2>
                            <p className="text-slate-500 mt-2 font-medium">Consulta el estado de tus propuestas enviadas a los docentes y comisión.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ordenar por:</label>
                            <select 
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-violet-600 focus:border-violet-600 block p-2 outline-none shadow-sm cursor-pointer"
                            >
                                <option value="reciente">Más recientes</option>
                                <option value="antiguo">Más antiguos</option>
                            </select>
                        </div>
                    </div>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Historial de Trámites
                        </h3>
                        <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {solicitudes.length} registros
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold w-1/3">Tema de Tesis</th>
                                    <th className="px-6 py-4 font-bold">Docente Tutor</th>
                                    <th className="px-6 py-4 font-bold text-center">Estado</th>
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
                                ) : solicitudesOrdenadas.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            Aún no has enviado ninguna solicitud de tesis.
                                        </td>
                                    </tr>
                                ) : (
                                    solicitudesOrdenadas.map((sol) => (
                                        <tr key={sol._id}>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800 text-base">{sol.tema?.titulo}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800">{sol.docente?.nombre} {sol.docente?.apellido}</div>
                                                <div className="text-xs font-medium text-slate-500 mt-1">{sol.docente?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                {getBadgeEstilo(sol.estado)}
                                                <div className="text-[10px] text-slate-400 font-medium mt-2">
                                                    {new Date(sol.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                <button 
                                                    onClick={() => abrirModal(sol)}
                                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-violet-600 font-bold text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Ver Resolución
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
            {feedbackModal.abierto && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Detalles de la Resolución
                            </h3>
                            <button onClick={() => setFeedbackModal({ abierto: false, texto: '', titulo: '' })} className="text-slate-300 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tema de Tesis</h4>
                            <p className="text-slate-800 font-bold mb-4 pb-4 border-b border-slate-100">{feedbackModal.titulo}</p>
                            
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Observaciones / Feedback</h4>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <p className="text-slate-700 leading-relaxed font-medium italic">"{feedbackModal.texto}"</p>
                            </div>

                            <button 
                                onClick={() => setFeedbackModal({ abierto: false, texto: '', titulo: '' })}
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

export default HistorialEstudiante;