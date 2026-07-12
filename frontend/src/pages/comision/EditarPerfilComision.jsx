import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

const InputField = ({ label, register, name, type = "text", disabled = false, rules, error }) => (
    <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <input 
            type={type} 
            {...register(name, rules)} 
            disabled={disabled}
            className={`w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-300'} rounded-xl outline-none focus:ring-2 transition-shadow ${disabled ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-700' : ''}`} 
        />
        {error && <span className="text-red-500 text-sm mt-1">{error.message}</span>}
    </div>
)

const EditarPerfilComision = () => {
    const { register, handleSubmit, reset } = useForm();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm();
    
    const { user, token, rol, setAuth } = useAuthStore();
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const [fotoPreview, setFotoPreview] = useState(null);
    const [archivoFoto, setArchivoFoto] = useState(null);
    
    const [bannerPreview, setBannerPreview] = useState(null);
    const [archivoBanner, setArchivoBanner] = useState(null);

    const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false);
    const [mostrarPasswordNuevo, setMostrarPasswordNuevo] = useState(false);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get(`/comision/perfil?t=${new Date().getTime()}`);
                reset({
                    ...data,
                    cedula: data.cedula || '',
                    celular: data.celular || '',
                    cargo: data.cargo || ''
                });
                if(data.fotoPerfil) {setFotoPreview(data.fotoPerfil);}
                if(data.bannerPerfil) {setBannerPreview(data.bannerPerfil);}
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
            
            const dataToSend = new FormData();
            dataToSend.append('nombre', dataRestante.nombre);
            dataToSend.append('apellido', dataRestante.apellido);
            dataToSend.append('cedula', dataRestante.cedula);
            dataToSend.append('celular', dataRestante.celular);
            dataToSend.append('cargo', dataRestante.cargo);
            
            if (archivoFoto) {
                dataToSend.append('fotoPerfil', archivoFoto);
            }
            if (archivoBanner) {
                dataToSend.append('bannerPerfil', archivoBanner);
            }
            
            const { data } = await clienteAxios.put(`/comision/perfil/${user?._id}`, dataToSend);
            
            setAuth(token, data, rol);
            toast.success("Perfil actualizado con éxito");
            navigate('/comision/perfil');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el perfil");
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            await clienteAxios.put('/comision/password', data);
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
    );

    return (
        <div className="w-full min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Configuración de Perfil</h2>
                    <p className="text-slate-500 mt-2 font-medium">Actualiza tu información personal, imágenes y ajusta tus preferencias de seguridad.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 rounded-t-xl">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Datos Institucionales
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
                                <div className="flex flex-col gap-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 mb-6">               
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-full md:w-64 h-32 shrink-0 rounded-xl overflow-hidden border-4 border-slate-100 dark:border-slate-900 shadow-md bg-slate-200 relative flex items-center justify-center">
                                            {bannerPreview ? (
                                                <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center">
                                                    <span className="text-white/90 dark:text-slate-200 text-sm font-semibold text-center px-2 drop-shadow-sm">Subir banner</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Banner de Perfil</label>
                                            <input 
                                                type="file" 
                                                accept="image/jpeg, image/png, image/webp" 
                                                onChange={(e) => handleFileChange(e, setArchivoBanner, setBannerPreview)}
                                                className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-violet-50 dark:file:bg-violet-900/30 file:text-violet-700 dark:file:text-violet-400 hover:file:bg-violet-100 dark:hover:file:bg-violet-900/50 cursor-pointer transition-colors"
                                            />
                                            <p className="text-xs text-slate-400 dark:text-slate-300 mt-2 font-medium">Formato horizontal recomendado. Tamaño máximo 2MB.</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-900 shadow-md bg-slate-200 flex items-center justify-center">
                                            {fotoPreview ? (
                                                <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-slate-600 text-sm font-semibold text-center px-2">Subir foto</span>
                                            )}
                                        </div>
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Fotografía de Perfil</label>
                                            <input 
                                                type="file" 
                                                accept="image/jpeg, image/png, image/webp" 
                                                onChange={(e) => handleFileChange(e, setArchivoFoto, setFotoPreview)}
                                                className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-violet-50 dark:file:bg-violet-900/30 file:text-violet-700 dark:file:text-violet-400 hover:file:bg-violet-100 dark:hover:file:bg-violet-900/50 cursor-pointer transition-colors"
                                            />
                                            <p className="text-xs text-slate-400 dark:text-slate-300 mt-2 font-medium">Formatos recomendados: JPG, PNG. Tamaño máximo 2MB.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Nombre" register={register} name="nombre" />
                                    <InputField label="Apellido" register={register} name="apellido" />
                                    <InputField label="Cédula" register={register} name="cedula" rules={{required: "La cédula es obligatoria", pattern: {value: /^[0-9]{10}$/, message: "La cédula debe contener 10 números"}}} error={errors.cedula}/>
                                    <InputField label="Celular" register={register} name="celular" />
                                    <InputField label="Cargo" register={register} name="cargo" disabled={true} />
                                    <InputField label="Correo Electrónico" register={register} name="email" type="email" disabled={true} />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button type="submit" className="flex-1 bg-violet-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-700 transition-colors shadow-md flex items-center justify-center gap-2">
                                        Guardar Cambios
                                    </button>
                                    <button type="button" onClick={() => navigate('/comision/perfil')} 
                                        className="flex-1 font-bold py-3 px-6 bg-slate-800 text-white rounded-xl hover:bg-slate-900 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Seguridad
                                </h3>
                            </div>
                            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Contraseña Actual</label>
                                    <div className="relative">
                                        <input
                                            type={mostrarPasswordActual ? "text" : "password"}
                                            {...registerPassword("passwordactual")}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-300 pr-12"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-violet-600 transition-colors"
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
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nueva Contraseña</label>
                                    <div className="relative">
                                        <input
                                            type={mostrarPasswordNuevo ? "text" : "password"}
                                            {...registerPassword("passwordnuevo")}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-300 pr-12"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-slate-500 hover:text-violet-600 transition-colors"
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
                                <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-700 transition-colors shadow-md flex justify-center items-center gap-2 mt-4">
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

export default EditarPerfilComision;