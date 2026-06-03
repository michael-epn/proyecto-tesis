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
        <div 
            className="fixed inset-0 w-full h-full grid place-items-center overflow-auto p-4"
            style={{ 
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1554228422-b8d4e6b3fa1e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-slate-200">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">Crear Nuevo Password</h1>
                
                {cargando ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 font-medium">Verificando enlace...</p>
                    </div>
                ) : tokenValido ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Nuevo Password</label>
                            <input
                                type="password"
                                {...register("password", { required: true })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                            />
                            {errors.password && <span className="text-xs text-red-500 mt-1 block">Este campo es requerido</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Confirmar Password</label>
                            <input
                                type="password"
                                {...register("confirmpassword", { required: true })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                            />
                            {errors.confirmpassword && <span className="text-xs text-red-500 mt-1 block">Este campo es requerido</span>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 mt-2"
                        >
                            Guardar Nuevo Password
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-slate-600 mb-6">El enlace de recuperación no es válido o ya expiró.</p>
                        <Link 
                            to="/auth/recuperarpassword" 
                            className="block w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition-all"
                        >
                            Solicitar uno nuevo
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NuevoPassword;