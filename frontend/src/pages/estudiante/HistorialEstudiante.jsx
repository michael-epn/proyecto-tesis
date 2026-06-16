import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const HistorialEstudiante = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [feedbackModal, setFeedbackModal] = useState({ abierto: false, texto: '' });
    // Nuevo estado para el filtro
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

    const getEstadoEstilo = (estado) => {
        switch (estado) {
            case 'aceptada': return 'bg-green-100 text-green-700 border-green-200';
            case 'enviada': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'rechazada': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const solicitudesOrdenadas = [...solicitudes].sort((a, b) => {
        const fechaA = new Date(a.createdAt || 0);
        const fechaB = new Date(b.createdAt || 0);
        return orden === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
    });

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 relative">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Mis Solicitudes de Tesis</h2>
                            <p className="text-slate-500 mt-2 font-medium">Consulta el estado de tus propuestas enviadas a los docentes de la ESFOT.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ordenar por:</label>
                            <select 
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none shadow-sm cursor-pointer"
                            >
                                <option value="reciente">Más recientes primero</option>
                                <option value="antiguo">Más antiguos primero</option>
                            </select>
                        </div>
                    </div>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Historial de Trámites
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Tema de Tesis</th>
                                    <th className="px-6 py-4 font-bold">Docente Tutor</th>
                                    <th className="px-6 py-4 font-bold text-center">Estado</th>
                                    <th className="px-6 py-4 font-bold text-center">Resolución</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cargando ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
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
                                        <tr key={sol._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 align-top max-w-md">
                                                <div className="font-bold text-slate-800">{sol.tema?.titulo}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-medium text-slate-800">{sol.docente?.nombre} {sol.docente?.apellido}</div>
                                                <div className="text-xs text-slate-500">{sol.docente?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                <span className={`inline-flex px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wide ${getEstadoEstilo(sol.estado)}`}>
                                                    {sol.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                {(sol.estado === 'rechazada' || sol.estado === 'aceptada') ? (
                                                    <button 
                                                        onClick={() => setFeedbackModal({ abierto: true, texto: sol.feedback || 'Sin comentarios adicionales.' })}
                                                        className="text-indigo-600 hover:text-indigo-800 font-bold text-sm underline decoration-indigo-300 underline-offset-4"
                                                    >
                                                        Ver Feedback
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 text-sm italic">En espera...</span>
                                                )}
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                            <h3 className="font-bold text-white">Comentarios de Resolución</h3>
                            <button onClick={() => setFeedbackModal({ abierto: false, texto: '' })} className="text-slate-300 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-700 leading-relaxed font-medium">"{feedbackModal.texto}"</p>
                            <button 
                                onClick={() => setFeedbackModal({ abierto: false, texto: '' })}
                                className="mt-6 w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-xl hover:bg-slate-900 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialEstudiante;