import { useState } from 'react'
import { toast } from 'react-toastify'

const SolicitudesEntrantes = () => {
    // Simulacion de carga de datos cruzados por el algoritmo
    const [solicitudes, setSolicitudes] = useState([
        { id: 101, alumno: "Jaime Cordova", carrera: "Desarrollo de Software", tema: "Sistema Inteligente de Recomendacion de Tesis", afinidad: "96%", estado: "Pendiente" },
        { id: 102, alumno: "Lilia Celeste Chavez", carrera: "Desarrollo de IoT", tema: "Control Biometrico con Wearables (BioSafe)", afinidad: "88%", estado: "Pendiente" }
    ])

    const procesarSolicitud = (id, accion) => {
        setSolicitudes(solicitudes.filter(s => s.id !== id))
        toast.success(`Solicitud ${accion === 'aceptar' ? 'aceptada y enviada a Direccion' : 'rechazada'} correctamente`)
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Bandeja de Solicitudes</h1>
                <p className="text-slate-500 mt-2">Revisa y gestiona los perfiles de estudiantes emparejados contigo por el motor predictivo.</p>
            </header>

            <div className="bg-white shadow-md rounded-sm border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left">Postulante</th>
                                <th className="px-4 py-3 text-left">Propuesta de Tesis</th>
                                <th className="px-4 py-3 text-center">Match IA</th>
                                <th className="px-4 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-200">
                            {solicitudes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-slate-500">No hay solicitudes en cola en este momento.</td>
                                </tr>
                            ) : (
                                solicitudes.map(sol => (
                                    <tr key={sol.id}>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-800">{sol.alumno}</div>
                                            <div className="text-xs text-slate-500">{sol.carrera}</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 font-medium">{sol.tema}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">{sol.afinidad}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center space-x-2">
                                            <button 
                                                onClick={() => procesarSolicitud(sol.id, 'aceptar')} 
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                                            >
                                                Aceptar
                                            </button>
                                            <button 
                                                onClick={() => procesarSolicitud(sol.id, 'rechazar')} 
                                                className="bg-slate-100 text-slate-600 px-3 py-1 rounded hover:bg-slate-200 border border-slate-200 transition-colors text-xs font-medium"
                                            >
                                                Rechazar
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
    )
}

export default SolicitudesEntrantes