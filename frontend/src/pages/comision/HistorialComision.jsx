import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const HistorialComision = () => {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [feedbackModal, setFeedbackModal] = useState({ abierto: false, texto: '', titulo: '' });
    const [orden, setOrden] = useState('reciente');

    useEffect(() => {
        const obtenerHistorial = async () => {
            try {
                const { data } = await clienteAxios.get('/comision/historial');
                setHistorial(data);
            } catch (error) {
                toast.error("Error al cargar el historial de resoluciones");
            } finally {
                setCargando(false);
            }
        };
        obtenerHistorial();
    }, []);

    const getBadgeEstilo = (estado) => {
        if (estado === 'aprobado_final') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wide">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Aprobado
                </span>
            );
        }
        if (estado === 'finalizado') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wide">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Tutoría Concluida
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-bold uppercase tracking-wide">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Rechazado
            </span>
        );
    };

    const historialOrdenado = [...historial].sort((a, b) => {
        const fechaA = new Date(a.updatedAt || 0);
        const fechaB = new Date(b.updatedAt || 0);
        return orden === 'reciente' ? fechaB - fechaA : fechaA - fechaB;
    });

    const abrirModal = (sol) => {
        setFeedbackModal({ 
            abierto: true, 
            texto: sol.feedback || 'Sin dictamen registrado.',
            titulo: sol.tema?.titulo
        });
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 relative">
            <div className="max-w-[1600px] mx-auto">
                
                <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Historial de Resoluciones</h2>
                            <p className="text-slate-500 mt-2 font-medium">Registro auditable de todos los dictámenes emitidos por el Pool de la Comisión.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ordenar por:</label>
                            <select 
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block p-2 outline-none shadow-sm cursor-pointer"
                            >
                                <option value="reciente">Resoluciones recientes</option>
                                <option value="antiguo">Resoluciones antiguas</option>
                            </select>
                        </div>
                    </div>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Archivo General
                        </h3>
                        <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {historial.length} dictámenes
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold w-1/3">Estudiante y Tema</th>
                                    <th className="px-6 py-4 font-bold">Tutor Académico</th>
                                    <th className="px-6 py-4 font-bold">Auditor (Comisión)</th>
                                    <th className="px-6 py-4 font-bold text-center">Veredicto</th>
                                    <th className="px-6 py-4 font-bold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cargando ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : historialOrdenado.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            Aún no se han emitido resoluciones finales.
                                        </td>
                                    </tr>
                                ) : (
                                    historialOrdenado.map((sol) => (
                                        <tr key={sol._id}>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800 text-base">{sol.estudiante?.nombre} {sol.estudiante?.apellido}</div>
                                                <div className="text-xs font-medium text-slate-500 mb-2">{sol.estudiante?.email}</div>
                                                <div className="font-medium text-slate-700 text-sm">{sol.tema?.titulo}</div>
                                            </td>
                                            
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800">{sol.docente?.nombre} {sol.docente?.apellido}</div>
                                                <span className="inline-block mt-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2 py-0.5 rounded font-medium">Docente Guía</span>
                                            </td>

                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800">{sol.revisor?.nombre} {sol.revisor?.apellido}</div>
                                                <span className="inline-block mt-1 bg-violet-50 text-violet-600 border border-violet-100 text-xs px-2 py-0.5 rounded font-medium">{sol.revisor?.cargo || 'Miembro Comisión'}</span>
                                            </td>

                                            <td className="px-6 py-4 align-middle text-center">
                                                {getBadgeEstilo(sol.estado)}
                                                <div className="text-[10px] text-slate-400 font-medium mt-2">
                                                    {new Date(sol.updatedAt).toLocaleDateString()}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-middle text-center">
                                                <button 
                                                    onClick={() => abrirModal(sol)}
                                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-violet-600 font-bold text-xs py-2 px-4 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Ver Dictamen
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
                                Dictamen Oficial
                            </h3>
                            <button onClick={() => setFeedbackModal({ abierto: false, texto: '', titulo: '' })} className="text-slate-300 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tema de Tesis</h4>
                            <p className="text-slate-800 font-bold mb-4 pb-4 border-b border-slate-100">{feedbackModal.titulo}</p>
                            
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resolución de Comisión</h4>
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

export default HistorialComision;