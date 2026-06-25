import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const Recomendaciones = () => {
    const { register, handleSubmit, reset } = useForm();
    const [cargandoIA, setCargandoIA] = useState(false);
    
    const [recomendaciones, setRecomendaciones] = useState(() => {
        const borradoresGuardados = localStorage.getItem('borradores_tesis');
        return borradoresGuardados ? JSON.parse(borradoresGuardados) : [];
    });

    const [docentes, setDocentes] = useState([]);
    const [docentesSeleccionados, setDocentesSeleccionados] = useState({});
    const [dropdownAbierto, setDropdownAbierto] = useState(null);

    useEffect(() => {
        localStorage.setItem('borradores_tesis', JSON.stringify(recomendaciones));
    }, [recomendaciones]);

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
            toast.success("Borrador generado. No olvides enviarlo.");
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
            toast.success("Tema guardado y solicitud enviada a la Comisión.");

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
                                    placeholder="Ej: Python, React, Node.js"  
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Áreas de Interés (separadas por coma)</label>
                                <input 
                                    type="text" 
                                    {...register("intereses", { required: true })}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    placeholder="Ej: Inteligencia Artificial, Redes" 
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
                        {recomendaciones.length === 0 && !cargandoIA && (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400 h-full min-h-[400px]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="font-medium text-lg text-center">Aún no hay propuestas generadas.</p>
                                <p className="text-sm text-center mt-2">Llena el formulario de la izquierda para comenzar.</p>
                            </div>
                        )}

                        {recomendaciones.map((rec) => (
                            <div key={rec.id_temporal} className="bg-white shadow-xl rounded-2xl border border-indigo-200 flex flex-col hover:shadow-2xl transition-shadow w-full ring-2 ring-indigo-50">
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
                                    <div className="relative">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Estado de Docentes
                                        </label>

                                        <button 
                                            type="button"
                                            onClick={() => setDropdownAbierto(dropdownAbierto === rec.id_temporal ? null : rec.id_temporal)}
                                            className={`w-full px-3 py-2.5 border transition-shadow bg-white text-sm flex justify-between items-center text-left outline-none focus:ring-2 focus:ring-indigo-500
                                                ${dropdownAbierto === rec.id_temporal 
                                                    ? 'border-slate-300 rounded-t-lg border-b-slate-100' 
                                                    : 'border-slate-300 rounded-lg'
                                                }`}
                                        >
                                            {(() => {
                                                const idSeleccionado = docentesSeleccionados[rec.id_temporal];
                                                if (!idSeleccionado) {
                                                    return <span className="text-slate-400 truncate pr-2">-- Elige un docente para continuar --</span>;
                                                }
                                                
                                                const docente = docentes.find(d => d._id === idSeleccionado);
                                                return (
                                                    <span className="text-slate-700 font-medium truncate pr-2">
                                                        {docente ? `${docente.nombre} ${docente.apellido}` : 'Docente no encontrado'}
                                                    </span>
                                                );
                                            })()}
                                            
                                            <svg 
                                                className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${dropdownAbierto === rec.id_temporal ? 'rotate-180' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {dropdownAbierto === rec.id_temporal && (
                                            <>
                                                <ul className="absolute top-full left-0 z-50 w-full bg-white border border-t-0 border-slate-300 rounded-b-lg shadow-xl max-h-60 overflow-y-auto">
                                                    {docentes.map(doc => {
                                                        const disponibilidadManual = doc.disponibilidad !== false; 
                                                        const maxCupos = doc.cupos_maximos || 0;
                                                        const cuposOcupados = doc.cupos_ocupados || 0;
                                                        
                                                        const estaLleno = cuposOcupados >= maxCupos;
                                                        
                                                        const estado = !disponibilidadManual 
                                                            ? { texto: "No disponible", color: "text-rose-500 font-bold", deshabilitado: true }
                                                            : estaLleno
                                                                ? { texto: "Sin cupos", color: "text-amber-500 font-bold", deshabilitado: true }
                                                                : { texto: `${maxCupos - cuposOcupados} cupos disp.`, color: "text-emerald-600 font-medium", deshabilitado: false };

                                                        return (
                                                            <li 
                                                                key={doc._id} 
                                                                onClick={() => {
                                                                    if (!estado.deshabilitado) {
                                                                        handleSelectChange(rec.id_temporal, doc._id);
                                                                        setDropdownAbierto(null);
                                                                    }
                                                                }}
                                                                className={`px-3 py-2.5 text-sm flex items-center justify-between gap-2 transition-colors border-b border-slate-100 last:border-0
                                                                    ${estado.deshabilitado 
                                                                        ? 'bg-slate-50 cursor-not-allowed opacity-75' 
                                                                        : 'hover:bg-indigo-50 cursor-pointer text-slate-700'
                                                                    }
                                                                `}
                                                            >
                                                                <span className="truncate">{doc.nombre} {doc.apellido}</span>
                                                                <span className={`flex-shrink-0 text-xs ${estado.color}`}>• {estado.texto}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                                
                                                <div className="fixed inset-0 z-40" onClick={() => setDropdownAbierto(null)}></div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => cancelarBorrador(rec.id_temporal)}
                                            className="flex-1 bg-white border border-slate-300 text-slate-700 text-sm font-bold py-3 px-4 rounded-lg hover:bg-slate-100 transition-colors shadow-sm flex justify-center items-center"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={() => enviarSolicitud(rec)}
                                            className="flex-1 bg-indigo-600 text-white text-sm font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex justify-center items-center"
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