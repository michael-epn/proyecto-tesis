import { useState } from 'react'
import { toast } from 'react-toastify'

const Recomendaciones = () => {
    const [cargandoIA, setCargandoIA] = useState(false)
    const [recomendaciones, setRecomendaciones] = useState([])

    // Esta funcion simula el llamado al endpoint predictivo que se construira luego
    const ejecutarMotorIA = () => {
        setCargandoIA(true)
        setRecomendaciones([])
        
        setTimeout(() => {
            setRecomendaciones([
                {
                    id: 1,
                    tema: "Sistema Inteligente para Optimizacion de Rutas de Transporte Estudiantil",
                    tutor: "Ing. Carlos Mendoza",
                    afinidad: "94%",
                    tecnologias_match: ["Python", "Analisis de Datos", "React"]
                },
                {
                    id: 2,
                    tema: "Implementacion de Sensores IoT para Invernaderos Automatizados",
                    tutor: "Ing. Laura Sanchez",
                    afinidad: "88%",
                    tecnologias_match: ["Arduino", "IoT", "C++"]
                }
            ])
            setCargandoIA(false)
            toast.success("Analisis de similitud completado")
        }, 2500)
    }

    const enviarSolicitud = (idTema) => {
        // Logica futura para enviar la propuesta a la bandeja del docente
        toast.info(`Solicitud enviada preliminarmente al tutor del tema ${idTema}`)
    }

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Sugerencias de Titulacion</h1>
                    <p className="text-slate-500 mt-2">Descubre temas y tutores de tesis basados en tu perfil tecnico y el algoritmo predictivo.</p>
                </div>
                <button 
                    onClick={ejecutarMotorIA} 
                    disabled={cargandoIA}
                    className={`font-bold py-2 px-4 rounded transition-colors ${cargandoIA ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                    {cargandoIA ? 'Procesando Algoritmo...' : 'Generar Recomendaciones'}
                </button>
            </header>

            {cargandoIA && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm border border-slate-200 shadow-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-600 font-medium">Cruzando tu perfil con historiales de tesis y cupos de docentes...</p>
                </div>
            )}

            {!cargandoIA && recomendaciones.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recomendaciones.map((rec) => (
                        <div key={rec.id} className="bg-white rounded-sm border border-slate-200 shadow-sm p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Afinidad: {rec.afinidad}</span>
                            </div>
                            
                            <h2 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{rec.tema}</h2>
                            <p className="text-sm text-slate-600 mb-4 font-medium">Tutor Sugerido: <span className="text-slate-800">{rec.tutor}</span></p>
                            
                            <div className="mb-6 flex-grow">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Tecnologias Coincidentes:</p>
                                <div className="flex flex-wrap gap-2">
                                    {rec.tecnologias_match.map((tech, index) => (
                                        <span key={index} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded border border-slate-200">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => enviarSolicitud(rec.id)}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Enviar Solicitud de Tutoria
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!cargandoIA && recomendaciones.length === 0 && (
                <div className="text-center py-20 bg-white rounded-sm border border-slate-200 shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-800 mb-1">Sin recomendaciones activas</h3>
                    <p className="text-slate-500">Haz clic en el boton superior para que la IA evalue tu perfil.</p>
                </div>
            )}
        </div>
    )
}

export default Recomendaciones