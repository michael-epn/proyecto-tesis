import { Controller, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import CustomSelect from '../../components/CustomSelect';

const opcionesRoles = [
    { value: "estudiante", label: "Estudiante" },
    { value: "docente", label: "Docente" },
    { value: "comision", label: "Comisión Académica" },
];
const Login = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            
            const url = `/${data.rol}/login`;
            const respuesta = await clienteAxios.post(url, {
                email: data.email,
                password: data.password
            });
            const { token, rol, ...user } = respuesta.data;
            setAuth(token, user, rol);
            navigate(`/${rol}`);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al iniciar sesion");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-white dark:bg-slate-900 dark:bg-slate-900">
            <div className="w-full md:w-1/2 flex flex-col p-4 py-8 md:p-12 lg:p-16 overflow-y-auto h-full">
                <div className="w-full max-w-md m-auto">
                    <h1 className="text-2xl md:text-3xl text-center font-bold text-slate-900 dark:text-slate-100 dark:text-white mb-6">
                        Sistema Predictivo <span className="text-violet-600 dark:text-violet-400">ESFOT</span>
                    </h1>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Perfil de Acceso</label>
                            <Controller
                                name="rol"
                                control={control}
                                rules={{ required: "El perfil es obligatorio" }}
                                render={({ field: { value, onChange } }) => (
                                    <CustomSelect
                                        value={value}
                                        onChange={onChange}
                                        options={opcionesRoles}
                                        placeholder="Selecciona un perfil..."
                                        error={!!errors.rol}
                                    />
                                )}
                            />
                            {errors.rol && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="w-full rounded-xl form-input px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none" 
                                placeholder="usuario@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    {...register("password", { required: true })}
                                    className="w-full rounded-xl px-4 py-3 form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none" 
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

                        <div className="text-right">
                            <Link to="/auth/recuperarpassword" className="text-sm text-violet-600 dark:text-violet-400 font-bold hover:underline">
                                ¿Olvidaste tu password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-lg rounded-xl w-full bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98] mt-4 shadow-sm"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-700 dark:border-slate-700 pt-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400">
                            ¿No tienes una cuenta? <Link to="/auth/registro" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">Registrate aquí</Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden md:block md:w-1/2 relative bg-slate-900">
                <img 
                    src="https://images.unsplash.com/photo-1758073519996-6d3c63b4922c?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Login Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-multiply"></div>
            </div>
        </div>
    );
};

export default Login;