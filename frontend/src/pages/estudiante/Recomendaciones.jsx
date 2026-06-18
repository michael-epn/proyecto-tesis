import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const Recomendaciones = () => {
    const { register, handleSubmit, reset } = useForm();
    const [cargandoIA, setCargandoIA] = useState(false);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [docentesSeleccionados, setDocentesSeleccionados] = useState({});

    useEffect(() => {
        const obtenerDocentes = async () => {
            try {
                const { data } = await clienteAxios.get('/docente');
                setDocentes(Array.isArray(data) ? data : data.docentes || data.data || []);
            } catch (error) {
                console.error("Error al cargar docentes", error);
                toast.error("No se pudo cargar la lista de docentes.");
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

            const { data } = await clienteAxios.post('/tesis/generar', payload);
            setRecomendaciones([data, ...recomendaciones]);
            toast.success("Borrador generado.");
            reset();
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al conectar con la IA");
        } finally {
            setCargandoIA(false);
        }
    };

    const handleSelectChange = (temaId, docenteId) => {
        setDocentesSeleccionados(prev => ({...prev, [temaId]: docenteId}));
    };

    const cancelarBorrador = (idTemporal) => {
        setRecomendaciones(recomendaciones.filter(rec => rec.id_temporal !== idTemporal));
        
        const nuevosSeleccionados = { ...docentesSeleccionados };
        delete nuevosSeleccionados[idTemporal];
        setDocentesSeleccionados(nuevosSeleccionados);
    };

    const enviarSolicitud = async (borrador) => {
        const docenteAsignado = docentesSeleccionados[borrador.id_temporal];
        if (!docenteAsignado) return toast.warning("Debes seleccionar un tutor para proceder");
        try {
            await clienteAxios.post('/tesis/solicitar', {
                temaData: {
                    titulo: borrador.titulo,
                    descripcion: borrador.descripcion,
                    tecnologias: borrador.tecnologias,
                    promptData: borrador.promptData
                },
                docenteId: docenteAsignado
            });
            cancelarBorrador(borrador.id_temporal);
            toast.success("Tema guardado y solicitud enviada al docente.");

        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al enviar solicitud");
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Motor Generador de Temas</h2>
                    <p className="text-slate-500 mt-2 font-medium">Ingresa tu contexto académico para generar propuestas usando Inteligencia Artificial.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    <div className="lg:sticky lg:top-8 bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden w-full">
                        <div className="bg-slate-800 px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Parámetros del Algoritmo
                            </h3>
                        </div>
                        
                        <form onSubmit={handleSubmit(ejecutarMotorIA)} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Habilidades Técnicas (separados por coma)</label>
                                <input 
                                    type="text" 
                                    {...register("habilidades", { required: true })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                     placeholder="Ej: habilidad 1, habilidad 2..."  
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Áreas de Interés (separadas por coma)</label>
                                <input 
                                    type="text" 
                                    {...register("intereses", { required: true })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    placeholder="Ej: interes 1, interes 2..." 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Contexto del problema</label>
                                <input 
                                    type="text" 
                                    {...register("contexto", { required: true })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                                    placeholder="Detalla el problema a resolver..." 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Ideas preliminares</label>
                                <textarea 
                                    {...register("ideas", { required: true })}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none" 
                                    placeholder="Describe qué te gustaría construir..." 
                                />
                            </div>

                            <div className="pt-2">
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
                                    {cargandoIA ? 'Procesando modelo...' : 'Generar Propuesta'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 gap-6 w-full">
                        {recomendaciones.map((rec) => (
                            <div key={rec.id_temporal} className="bg-white shadow-xl rounded-2xl border border-indigo-200 overflow-hidden flex flex-col hover:shadow-2xl transition-shadow w-full ring-2 ring-indigo-50">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-xl font-extrabold text-slate-800 leading-tight">{rec.titulo}</h2>
                                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded border border-amber-200">Borrador</span>
                                    </div>
                                    <p className="text-slate-600 text-sm font-medium mb-6 line-clamp-4">{rec.descripcion}</p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {rec.tecnologias?.map((tech, i) => (
                                            <span key={i} className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold border border-indigo-100">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-5 border-t border-slate-200 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Estado de Docentes</label>
                                        <select 
                                            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow bg-white text-sm"
                                            value={docentesSeleccionados[rec.id_temporal] || ""}
                                            onChange={(e) => handleSelectChange(rec.id_temporal, e.target.value)}
                                        >
                                            <option value="" disabled>-- Elige un docente para continuar --</option>
                                            {docentes.map(doc => {
                                                const noDisponible = !doc.disponibilidad;
                                                const lleno = doc.cupos_ocupados >= doc.cupos_maximos;
                                                const deshabilitado = noDisponible || lleno;
                                                
                                                let etiqueta = "";
                                                if (noDisponible) etiqueta = "(Fuera de servicio)";
                                                else if (lleno) etiqueta = "(Sin cupos)";
                                                else etiqueta = `(${doc.cupos_maximos - doc.cupos_ocupados} cupos disp.)`;

                                                return (
                                                    <option key={doc._id} value={doc._id} disabled={deshabilitado}>
                                                        {doc.nombre} {doc.apellido} {etiqueta}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => cancelarBorrador(rec.id_temporal)}
                                            className="w-1/3 bg-white border border-slate-300 text-slate-700 text-sm font-bold py-3 px-4 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={() => enviarSolicitud(rec)}
                                            className="w-2/3 bg-indigo-600 text-white text-sm font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex justify-center items-center"
                                        >
                                            Guardar y Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recomendaciones;