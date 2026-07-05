import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const NuevoPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const [cargando, setCargando] = useState(true);
    const [tokenValido, setTokenValido] = useState(false);
    const [rolDetectado, setRolDetectado] = useState('');
    const intentoRealizado = useRef(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    useEffect(() => {
        if (intentoRealizado.current) return;
        intentoRealizado.current = true;

        const comprobarToken = async () => {
            setCargando(true);
            const roles = ['estudiante', 'docente', 'comision'];
            for (const rol of roles) {
                try {
                    await clienteAxios.get(`/${rol}/recuperarpassword/${token}`);
                    setTokenValido(true);
                    setRolDetectado(rol);
                    break;
                } catch (error) {
                    continue;
                }
            }
            setCargando(false);
        };
        comprobarToken();
    }, [token]);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmpassword) {
            toast.error("Los passwords no coinciden");
            return;
        }
        try {
            const url = `/${rolDetectado}/nuevopassword/${token}`;
            const respuesta = await clienteAxios.post(url, {
                password: data.password,
                confirmpassword: data.confirmpassword
            });
            toast.success(respuesta.data.msg);
            navigate('/auth/login');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el password");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-white dark:bg-slate-900 dark:bg-slate-900">
            <div className="w-full md:w-1/2 flex flex-col p-4 py-8 md:p-12 lg:p-16 overflow-y-auto h-full">
                <div className="w-full max-w-md m-auto">
                    <h1 className="text-2xl md:text-3xl text-center font-bold text-slate-900 dark:text-slate-100 dark:text-white mb-6">Crear Nuevo Password</h1>
                    
                    {cargando ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
                            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300 font-medium">Verificando enlace...</p>
                        </div>
                    ) : tokenValido ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={mostrarPassword ? "text" : "password"}
                                        {...register("password", { required: true })}
                                        className="w-full px-4 py-3 rounded-xl form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none" 
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => setMostrarPassword(!mostrarPassword)}
                                    >
                                        {mostrarPassword ? (
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
                                {errors.password && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirmar Password</label>
                                <div className="relative">
                                    <input
                                        type={mostrarConfirmar ? "text" : "password"}
                                        {...register("confirmpassword", { required: true })}
                                        className="w-full rounded-xl px-4 py-3 form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                        onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                                    >
                                        {mostrarConfirmar ? (
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
                                {errors.confirmpassword && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-lg rounded-xl w-full bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98] mt-4 shadow-sm"
                            >
                                Guardar Nuevo Password
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-slate-600 dark:text-slate-400 dark:text-slate-300 mb-6">El enlace de recuperación no es válido o ya expiró.</p>
                            <Link 
                                to="/auth/recuperarpassword" 
                                className="btn btn-lg rounded-xl w-full bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-700 text-white active:scale-[0.98] transition-all"
                            >
                                Solicitar uno nuevo
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="hidden md:block md:w-1/2 relative bg-slate-900">
                <img 
                    src="https://images.unsplash.com/photo-1554228422-b8d4e6b3fa1e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Nuevo Password Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-multiply"></div>
            </div>
        </div>
        
    );
};

export default NuevoPassword;