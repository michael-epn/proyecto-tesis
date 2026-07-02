import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const SolicitudesEntrantes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [modalFeedback, setModalFeedback] = useState(false);
    const [solicitudARechazar, setSolicitudARechazar] = useState(null);
    const [textoFeedback, setTextoFeedback] = useState('');

    useEffect(() => {
        const obtenerSolicitudes = async () => {
            try {
                const { data } = await clienteAxios.get('/tesis/historial/recibidas');
                setSolicitudes(data.filter(sol => sol.estado === 'enviada'));
            } catch (error) {
                toast.error("Error al cargar las solicitudes de tesis");
            } finally {
                setCargando(false);
            }
        };
        obtenerSolicitudes();
    }, []);

    const aceptarSolicitud = async (idSolicitud) => {
        if (!window.confirm("¿Estás seguro de aceptar esta propuesta de tesis?")) return;

        try {
            await clienteAxios.put(`/tesis/responder/${idSolicitud}`, {
                estado: 'aceptada',
                feedback: "Solicitud aprobada por el docente y lista para registro."
            });
            
            setSolicitudes(solicitudes.filter(s => s._id !== idSolicitud));
            toast.success("Tema de tesis aceptado exitosamente");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al aceptar la solicitud");
        }
    };

    const abrirModalRechazo = (idSolicitud) => {
        setSolicitudARechazar(idSolicitud);
        setTextoFeedback('');
        setModalFeedback(true);
    };

    const confirmarRechazo = async () => {
        if (!textoFeedback || textoFeedback.trim() === "") {
            return toast.warning("El feedback es obligatorio para rechazar la propuesta");
        }

        try {
            await clienteAxios.put(`/tesis/responder/${solicitudARechazar}`, {
                estado: 'rechazada',
                feedback: textoFeedback
            });
            
            setSolicitudes(solicitudes.filter(s => s._id !== solicitudARechazar));
            toast.success("Tema de tesis rechazado. Se notificará al estudiante.");
            
            setModalFeedback(false);
            setTextoFeedback('');
            setSolicitudARechazar(null);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al rechazar la solicitud");
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 relative">
            <div className="w-full">
                <header className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Bandeja de Solicitudes</h2>
                    <p className="text-slate-500 mt-2 font-medium">Revisa y gestiona las propuestas de titulación recibidas.</p>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Trámites Pendientes
                        </h3>
                        <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {solicitudes.length} en cola
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Estudiante</th>
                                    <th className="px-6 py-4 font-bold">Propuesta Técnica</th>
                                    <th className="px-6 py-4 font-bold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cargando ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center">
                                            <div className="flex justify-center items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : solicitudes.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            No tienes solicitudes en espera en este momento.
                                        </td>
                                    </tr>
                                ) : (
                                    solicitudes.map((sol) => (
                                        <tr key={sol._id}>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800 text-base">
                                                    {sol.estudiante?.nombre} {sol.estudiante?.apellido}
                                                </div>
                                                <div className="text-sm font-medium text-slate-500 mt-1">{sol.estudiante?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top max-w-xl">
                                                <div className="font-bold text-slate-800 text-base mb-1">{sol.tema?.titulo}</div>
                                                <div className="text-sm font-medium text-slate-600 mb-3">{sol.tema?.descripcion}</div>
                                                <div className="flex gap-2 flex-wrap">
                                                    {sol.tema?.tecnologias?.map(t => (
                                                        <span key={t} className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex flex-col gap-2 justify-center">
                                                    <button 
                                                        onClick={() => aceptarSolicitud(sol._id)} 
                                                        className="w-full bg-violet-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-violet-700 transition-colors shadow-sm text-sm"
                                                    >
                                                        Aceptar
                                                    </button>
                                                    <button 
                                                        onClick={() => abrirModalRechazo(sol._id)} 
                                                        className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm"
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
                            <h3 className="text-lg font-bold text-rose-800">Motivo de Rechazo</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4 font-medium">Por favor, escribe el feedback o motivo por el cual no puedes aceptar esta tutoría.</p>
                            <textarea 
                                value={textoFeedback}
                                onChange={(e) => setTextoFeedback(e.target.value)}
                                className="w-full h-32 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                placeholder="Ej: Actualmente me encuentro enfocado en otras áreas de investigación..."
                            ></textarea>
                            <div className="mt-6 flex gap-3">
                                <button 
                                    onClick={confirmarRechazo}
                                    disabled={textoFeedback.trim().length === 0}
                                    className="flex-1 bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 transition-colors disabled:bg-rose-300"
                                >
                                    Confirmar Rechazo
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

export default SolicitudesEntrantes;