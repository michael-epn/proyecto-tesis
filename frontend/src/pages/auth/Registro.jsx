import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const Registro = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            rol: 'estudiante'
        },
        shouldUnregister: true
    });
    const navigate = useNavigate();
    const rolSeleccionado = watch('rol');

    const onSubmit = async (data) => {
        try {
            const payload = { ...data };

            if (payload.rol === 'docente' && payload.areas_investigacion) {
                payload.areas_investigacion = payload.areas_investigacion.split(',').map(item => item.trim());
            }

            const url = `/${payload.rol}/registro`;
            const respuesta = await clienteAxios.post(url, payload);

            toast.success(respuesta.data.msg);
            navigate('/auth/login');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al procesar el registro");
        }
    };

    return (
        <div 
            className="fixed inset-0 w-full h-full grid place-items-center overflow-auto p-4"
            style={{ 
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1644325349124-d1756b79dd42?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-200">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">Crear Cuenta</h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Tipo de Perfil</label>
                        <select
                            {...register("rol", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700 transition-all appearance-none"
                        >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="direccion">Direccion Academica</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Nombre</label>
                            <input
                                type="text"
                                {...register("nombre", { required: true })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            {errors.nombre && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Apellido</label>
                            <input
                                type="text"
                                {...register("apellido", { required: true })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            {errors.apellido && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Correo Institucional</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="usuario@epn.edu.ec"
                        />
                        {errors.email && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>

                    {rolSeleccionado === 'estudiante' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Carrera</label>
                            <input
                                type="text"
                                {...register("carrera", { required: true })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ej. Desarrollo de Software"
                            />
                            {errors.carrera && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>
                    )}

                    {rolSeleccionado === 'docente' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Areas de Investigacion</label>
                            <input
                                type="text"
                                {...register("areas_investigacion", { required: true })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Separadas por comas (IA, Datos)"
                            />
                            {errors.areas_investigacion && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>
                    )}

                    {rolSeleccionado === 'direccion' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-2">Cargo</label>
                            <input
                                type="text"
                                {...register("cargo", { required: true })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Ej. Coordinador"
                            />
                            {errors.cargo && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        {errors.password && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 mt-2"
                    >
                        Registrarse
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-200 pt-6">
                    <p className="text-sm text-slate-600">
                        Ya tienes una cuenta? <Link to="/auth/login" className="text-blue-600 font-bold hover:underline">Inicia Sesion</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registro;