import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

const InputField = ({ label, register, name, type = "text", disabled = false, options = {} }) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
        <input 
            type={type} 
            {...register(name, options)} 
            disabled={disabled}
            className={`w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : ''}`} 
        />
    </div>
);

const EditarPerfilDocente = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm();
    
    const { user, token, rol, setAuth } = useAuthStore();
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // Estados para imágenes
    const [fotoPreview, setFotoPreview] = useState(null);
    const [archivoFoto, setArchivoFoto] = useState(null);
    
    const [bannerPreview, setBannerPreview] = useState(null);
    const [archivoBanner, setArchivoBanner] = useState(null);

    // Estados para mostrar/ocultar contraseñas
    const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
    const [mostrarPasswordNuevo, setMostrarPasswordNuevo] = useState(false);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get(`/docente/perfil?t=${new Date().getTime()}`);
                reset({
                    ...data,
                    areas_investigacion: data.areas_investigacion?.join(', ') || '',
                    tecnologias_especialidad: data.tecnologias_especialidad?.join(', ') || ''
                });
                if(data.fotoPerfil) {
                    setFotoPreview(data.fotoPerfil);
                }
                if(data.bannerPerfil) {
                    setBannerPreview(data.bannerPerfil);
                }
            } catch (error) {
                toast.error("Error al cargar la información del perfil");
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, [reset]);

    const handleFileChange = (e, setFileState, setPreviewState) => {
        const file = e.target.files[0];
        if (file) {
            setFileState(file);
            setPreviewState(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (formData) => {
        try {
            const { email, ...dataRestante } = formData;

            const areasArray = typeof dataRestante.areas_investigacion === 'string' ? dataRestante.areas_investigacion.split(',').map(i => i.trim()).filter(Boolean) : [];
            const techArray = typeof dataRestante.tecnologias_especialidad === 'string' ? dataRestante.tecnologias_especialidad.split(',').map(i => i.trim()).filter(Boolean) : [];

            const dataToSend = new FormData();
            dataToSend.append('nombre', dataRestante.nombre);
            dataToSend.append('apellido', dataRestante.apellido);
            dataToSend.append('disponibilidad', dataRestante.disponibilidad);
            dataToSend.append('cupos_maximos', Number(dataRestante.cupos_maximos));
            dataToSend.append('areas_investigacion', JSON.stringify(areasArray));
            dataToSend.append('tecnologias_especialidad', JSON.stringify(techArray));
            
            if (archivoFoto) {
                dataToSend.append('fotoPerfil', archivoFoto);
            }
            if (archivoBanner) {
                dataToSend.append('bannerPerfil', archivoBanner);
            }

            const { data } = await clienteAxios.put(`/docente/perfil/${user?._id}`, dataToSend);
            setAuth(token, data, rol);
            toast.success("Perfil actualizado con éxito");
            navigate('/docente/perfil');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el perfil");
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            await clienteAxios.put('/docente/password', data);
            toast.success("Contraseña actualizada correctamente");
            resetPassword();
            setMostrarPasswordActual(false);
            setMostrarPasswordNuevo(false);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar contraseña");
        }
    };

    if (cargando) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Configuración de Perfil Docente</h2>
                    <p className="text-slate-500 mt-2 font-medium">Actualiza tu información personal, áreas de tutoría y seguridad.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Información Académica y Personal
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
                                <div className="flex flex-col gap-8 p-6 bg-slate-50 rounded-xl border border-slate-100 mb-6">               
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-full md:w-64 h-32 shrink-0 rounded-xl overflow-hidden border-4 border-white shadow-md bg-slate-200 relative flex items-center justify-center">
                                            {bannerPreview ? (
                                                <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center">
                                                    <span className="text-white/90 text-sm font-semibold text-center px-2 drop-shadow-sm">Subir banner</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Banner de Perfil</label>
                                            <input 
                                                type="file" 
                                                accept="image/jpeg, image/png, image/webp" 
                                                onChange={(e) => handleFileChange(e, setArchivoBanner, setBannerPreview)}
                                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition-colors" 
                                            />
                                            <p className="text-xs text-slate-400 mt-2 font-medium">Formato horizontal recomendado. Tamaño máximo 2MB.</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-slate-200"></div>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200 flex items-center justify-center">
                                            {fotoPreview ? (
                                                <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-slate-400 text-sm font-semibold text-center px-2">Subir foto</span>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Fotografía de Perfil</label>
                                            <input 
                                                type="file" 
                                                accept="image/jpeg, image/png, image/webp" 
                                                onChange={(e) => handleFileChange(e, setArchivoFoto, setFotoPreview)}
                                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer transition-colors" 
                                            />
                                            <p className="text-xs text-slate-400 mt-2 font-medium">Formatos recomendados: JPG, PNG. Tamaño máximo 2MB.</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Nombre" register={register} name="nombre" />
                                    <InputField label="Apellido" register={register} name="apellido" />
                                    <InputField label="Correo Electrónico" register={register} name="email" type="email" disabled={true} />
                                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700">Disponibilidad de Tutoría</label>
                                            <p className="text-xs text-slate-500 mt-1">Activa esta opción si aceptas nuevos estudiantes.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                {...register("disponibilidad")} 
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    <InputField label="Cupos Máximos de Tutoría" register={register} name="cupos_maximos" type="number" options={{ required: true }} />
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Áreas de Investigación (separadas por coma)</label>
                                        <textarea 
                                            {...register("areas_investigacion", { required: true })} 
                                            rows="3" 
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none" 
                                            placeholder="Ej: Inteligencia Artificial, Redes y Telecomunicaciones..."
                                        ></textarea>
                                        {errors.areas_investigacion && <span className="text-xs text-red-500 mt-1 block">Este campo es requerido</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tecnologías de Especialidad (separadas por coma)</label>
                                        <textarea 
                                            {...register("tecnologias_especialidad")} 
                                            rows="3" 
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none" 
                                            placeholder="Ej: Python, React, Node.js..."
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-100">
                                    <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2">
                                        Guardar Cambios
                                    </button>
                                    <button type="button" onClick={() => navigate('/docente/perfil')} className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Seguridad
                                </h3>
                            </div>
                            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="p-6 space-y-6">
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña Actual</label>
                                    <div className="relative">
                                        <input
                                            type={mostrarPasswordActual ? "text" : "password"}
                                            {...registerPassword("passwordactual", { required: true })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                                            onClick={() => setMostrarPasswordActual(!mostrarPasswordActual)}
                                        >
                                            {mostrarPasswordActual ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nueva Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={mostrarPasswordNuevo ? "text" : "password"}
                                            {...registerPassword("passwordnuevo", { required: true })}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                                            onClick={() => setMostrarPasswordNuevo(!mostrarPasswordNuevo)}
                                        >
                                            {mostrarPasswordNuevo ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-900 transition-colors shadow-md flex justify-center items-center gap-2 mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Actualizar Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarPerfilDocente;