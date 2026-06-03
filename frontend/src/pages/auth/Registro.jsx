import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const Registro = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            rol: 'estudiante',
            carrera: ''
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
        <div className="flex min-h-screen bg-white dark:bg-gray-900">
            {/* Lado Izquierdo: Formulario */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-md">
                    <h1 className="h2 text-center text-gray-900 dark:text-white mb-8">Crear Cuenta</h1>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Tipo de Perfil */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipo de Perfil</label>
                            <select
                                {...register("rol", { required: true })}
                                className="form-select w-full transition-all"
                            >
                                <option value="estudiante">Estudiante</option>
                                <option value="docente">Docente</option>
                                <option value="comision">Comisión Académica</option>
                            </select>
                        </div>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    {...register("nombre", { required: true })}
                                    className="form-input w-full transition-all"
                                />
                                {errors.nombre && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Apellido</label>
                                <input
                                    type="text"
                                    {...register("apellido", { required: true })}
                                    className="form-input w-full transition-all"
                                />
                                {errors.apellido && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        </div>

                        {/* Correo Institucional */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="form-input w-full transition-all"
                                placeholder="usuario@email.com"
                            />
                            {errors.email && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>

                        {/* Carrera (Solo Estudiantes) */}
                        {rolSeleccionado === 'estudiante' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Carrera</label>
                                <select
                                    {...register("carrera", { required: true })}
                                    className="form-select w-full transition-all"
                                >
                                    <option value="">Selecciona tu carrera</option>
                                    <option value="Tecnología Superior en Agua y Saneamiento Ambiental">Tecnología Superior en Agua y Saneamiento Ambiental</option>
                                    <option value="Tecnología Superior en Desarrollo de Software">Tecnología Superior en Desarrollo de Software</option>
                                    <option value="Tecnología Superior en Electromecánica">Tecnología Superior en Electromecánica</option>
                                    <option value="Tecnología Superior en Redes y Telecomunicaciones">Tecnología Superior en Redes y Telecomunicaciones</option>
                                    <option value="Tecnología Superior en Procesamiento de Alimentos">Tecnología Superior en Procesamiento de Alimentos</option>
                                    <option value="Tecnología Superior en Procesamiento Industrial de la Madera">Tecnología Superior en Procesamiento Industrial de la Madera</option>
                                </select>
                                {errors.carrera && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        )}

                        {/* Áreas de Investigación (Solo Docentes) */}
                        {rolSeleccionado === 'docente' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Áreas de Investigación</label>
                                <input
                                    type="text"
                                    {...register("areas_investigacion", { required: true })}
                                    className="form-input w-full transition-all"
                                    placeholder="Separadas por comas (IA, Datos)"
                                />
                                {errors.areas_investigacion && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        )}

                        {/* Cargo (Solo Comisión) */}
                        {rolSeleccionado === 'comision' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cargo</label>
                                <input
                                    type="text"
                                    {...register("cargo", { required: true })}
                                    className="form-input w-full transition-all"
                                    placeholder="Ej. Coordinador"
                                />
                                {errors.cargo && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
                            <input
                                type="password"
                                {...register("password", { required: true })}
                                className="form-input w-full transition-all"
                            />
                            {errors.password && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-lg w-full bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98] mt-4 shadow-sm"
                        >
                            Registrarse
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            ¿Ya tienes una cuenta? <Link to="/auth/login" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Lado Derecho: Imagen */}
            <div className="hidden md:block md:w-1/2 relative bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1644325349124-d1756b79dd42?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Registro Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                {/* Overlay opcional para darle un tinte alineado a los colores violeta de tu theme */}
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-multiply"></div>
            </div>
        </div>
    );
};

export default Registro;