import React, { useState } from 'react';
import { toast } from 'react-toastify';

function AuditoriaTramites() {
    // Simulacion de solicitudes que ya fueron aceptadas por un docente y esperan resolucion final
    const [tramites, setTramites] = useState([
        { id: 101, alumno: "Jaime Cordova", carrera: "Desarrollo de Software", tema: "Sistema Inteligente de Recomendacion de Tesis", tutor: "Ing. Carlos Mendoza", afinidad: "96%", estado: "Revision Direccion" },
        { id: 102, alumno: "Lilia Celeste Chavez", carrera: "Desarrollo de IoT", tema: "Control Biometrico con Wearables (BioSafe)", tutor: "Ing. Laura Sanchez", afinidad: "88%", estado: "Revision Direccion" }
    ]);

    const gestionarTramite = (id, accion) => {
        setTramites(tramites.filter(t => t.id !== id));
        if(accion === 'aprobar'){
            toast.success("El tema de tesis ha sido formalizado y oficializado.");
        } else {
            toast.warn("El tramite ha sido devuelto para correccion.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Auditoria de Emparejamientos</h1>
                <p className="text-gray-500 mt-2">Revisa y oficializa las duplas de estudiante/tutor sugeridas por el sistema.</p>
            </header>

            <div className="bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-200 dark:border-gray-700/60">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full dark:text-gray-300">
                        <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 py-4 text-left">Informacion del Estudiante</th>
                                <th className="px-4 py-4 text-left">Propuesta & Tutor Asignado</th>
                                <th className="px-4 py-4 text-center">Score IA</th>
                                <th className="px-4 py-4 text-center">Resolucion Final</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
                            {tramites.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No existen tramites pendientes de auditoria.</td>
                                </tr>
                            ) : (
                                tramites.map((tramite) => (
                                    <tr key={tramite.id}>
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-gray-800 dark:text-gray-100">{tramite.alumno}</div>
                                            <div className="text-xs text-gray-500">{tramite.carrera}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-gray-800 dark:text-gray-200">{tramite.tema}</div>
                                            <div className="text-xs text-indigo-500 font-medium mt-1">Tutor: {tramite.tutor}</div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{tramite.afinidad}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button 
                                                    onClick={() => gestionarTramite(tramite.id, 'aprobar')}
                                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded transition-colors text-xs font-medium"
                                                >
                                                    Oficializar
                                                </button>
                                                <button 
                                                    onClick={() => gestionarTramite(tramite.id, 'devolver')}
                                                    className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded transition-colors text-xs font-medium"
                                                >
                                                    Devolver
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
    );
}

export default AuditoriaTramites;