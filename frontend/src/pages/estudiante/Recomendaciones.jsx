import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import clienteAxios from '../config/axios';

const Recomendaciones = () => {
    const { register, handleSubmit, reset } = useForm();
    const [cargandoIA, setCargandoIA] = useState(false);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [docenteSeleccionado, setDocenteSeleccionado] = useState('');

    useEffect(() => {
        const obtenerDocentes = async () => {
            try {
                const { data } = await clienteAxios.get('/api/docente');
                setDocentes(data);
            } catch (error) {
                console.error("Error al cargar docentes", error);
            }
        };
        obtenerDocentes();
    }, []);

    const ejecutarMotorIA = async (formData) => {
        setCargandoIA(true);
        
        try {
            const payload = {
                habilidades: formData.habilidades.split(',').map(item => item.trim()).filter(Boolean),
                intereses: formData.intereses.split(',').map(item => item.trim()).filter(Boolean),
                contexto: formData.contexto,
                ideas: formData.ideas
            };

            const { data } = await clienteAxios.post('/api/tesis/generar', payload);
            
            setRecomendaciones([data, ...recomendaciones]);
            toast.success("Tema generado con éxito");
            reset(); // Limpia el formulario tras el éxito
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al conectar con la IA");
        } finally {
            setCargandoIA(false);
        }
    };

    const enviarSolicitud = async (idTema) => {
        if (!docenteSeleccionado) {
            return toast.warning("Debes seleccionar un tutor para proceder");
        }

        try {
            await clienteAxios.post('/api/tesis/solicitar', {
                temaId: idTema,
                docenteId: docenteSeleccionado
            });
            
            setRecomendaciones(recomendaciones.filter(rec => rec._id !== idTema));
            toast.success("Solicitud enviada exitosamente para revisión de la Comisión y el Docente");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al enviar solicitud");
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Motor Generador de Tesis</h2>
                    <p className="text-slate-500 mt-2 font-medium">Ingresa tu contexto académico para generar propuestas usando Inteligencia Artificial.</p>
                </header>

                <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden mb-8">
                    <div className="bg-slate-800 px-6 py-4 border-b border-slate-200">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Parámetros del Algoritmo
                        </h3>
                    </div>
                    
                    <form onSubmit={handleSubmit(ejecutarMotorIA)} className="p-6 md:p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Habilidades Técnicas</label>
                                <input 
                                    type="text" 
                                    {...register("habilidades", { required: true })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                                    placeholder="Ej: React, Node.js, Python..." 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Áreas de Interés</label>
                                <input 
                                    type="text" 
                                    {...register("intereses", { required: true })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                                    placeholder="Ej: Machine Learning, IoT..." 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Contexto del problema a resolver</label>
                                <input 
                                    type="text" 
                                    {...register("contexto", { required: true })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                                    placeholder="Ej: Optimización de recursos en el campus universitario" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tus ideas preliminares</label>
                                <textarea 
                                    {...register("ideas", { required: true })}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none" 
                                    placeholder="Describe brevemente qué te gustaría construir o investigar..." 
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <button 
                                type="submit" 
                                disabled={cargandoIA} 
                                className={`w-full font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${cargandoIA ? 'bg-indigo-400 cursor-not-allowed text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                {cargandoIA && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {cargandoIA ? 'Procesando modelo predictivo...' : 'Generar Propuesta con IA'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Grid de Resultados */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {recomendaciones.map((rec) => (
                        <div key={rec._id} className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full">
                            <div className="p-6 md:p-8 flex-grow">
                                <h2 className="text-xl font-extrabold text-slate-800 mb-3">{rec.titulo}</h2>
                                <p className="text-slate-600 font-medium mb-6">{rec.descripcion}</p>
                                
                                <div className="flex flex-wrap gap-2">
                                    {rec.tecnologias?.map((tech, i) => (
                                        <span key={i} className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold shadow-sm">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-6 border-t border-slate-200 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Docente Tutor</label>
                                    <select 
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow bg-white"
                                        onChange={(e) => setDocenteSeleccionado(e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>-- Elige un docente del listado --</option>
                                        {docentes.map(doc => (
                                            <option key={doc._id} value={doc._id}>{doc.nombre} {doc.apellido}</option>
                                        ))}
                                    </select>
                                </div>

                                <button 
                                    onClick={() => enviarSolicitud(rec._id)}
                                    className="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-900 transition-colors shadow-md"
                                >
                                    Enviar Solicitud de Tutoría
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Recomendaciones;