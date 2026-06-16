import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import clienteAxios from '../config/axios';

const HistorialDocente = () => {
    const [historial, setHistorial] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerHistorial = async () => {
            try {
                const { data } = await clienteAxios.get('/tesis/historial/recibidas');
                // Filtramos para mostrar SOLO las ya gestionadas
                const gestionadas = data.filter(sol => sol.estado === 'aceptada' || sol.estado === 'rechazada');
                setHistorial(gestionadas);
            } catch (error) {
                toast.error("Error al cargar el historial de gestiones");
            } finally {
                setCargando(false);
            }
        };
        obtenerHistorial();
    }, []);

    const cuposOcupados = historial.filter(sol => sol.estado === 'aceptada').length;

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Historial de Tutorías</h2>
                        <p className="text-slate-500 mt-2 font-medium">Registro de solicitudes de titulación aceptadas o rechazadas.</p>
                    </div>
                    
                    {/* Tarjeta resumen de cupos */}
                    <div className="bg-white border border-slate-200 px-6 py-3 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Proyectos Aceptados</p>
                            <p className="text-xl font-extrabold text-slate-800">{cuposOcupados} <span className="text-sm font-medium text-slate-400">estudiantes</span></p>
                        </div>
                    </div>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Gestiones Realizadas
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Estudiante</th>
                                    <th className="px-6 py-4 font-bold">Tema Propuesto</th>
                                    <th className="px-6 py-4 font-bold text-center">Estado de Resolución</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cargando ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : historial.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            Aún no has gestionado ninguna solicitud.
                                        </td>
                                    </tr>
                                ) : (
                                    historial.map((sol) => (
                                        <tr key={sol._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 align-top w-1/4">
                                                <div className="font-bold text-slate-800">{sol.estudiante?.nombre} {sol.estudiante?.apellido}</div>
                                                <div className="text-sm text-slate-500 mt-1">{sol.estudiante?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-bold text-slate-800 mb-1">{sol.tema?.titulo}</div>
                                                {/* Caja con el feedback enviado */}
                                                <div className="mt-3 bg-slate-100 border border-slate-200 p-3 rounded-lg flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Feedback enviado a la Comisión:</span>
                                                        <span className="text-sm text-slate-700 italic">"{sol.feedback || 'Sin feedback registrado'}"</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle text-center">
                                                {sol.estado === 'aceptada' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wide">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        Aceptada
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase tracking-wide">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                        Rechazada
                                                    </span>
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
        </div>
    );
};

export default HistorialDocente;