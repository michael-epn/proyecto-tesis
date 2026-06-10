import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';
import { useState } from 'react';

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
    const [mostrarPassword, setMostrarPassword] = useState(false);

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
        <div className="fixed inset-0 z-50 flex bg-white dark:bg-gray-900">
            <div className="hidden md:block md:w-1/2 relative bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1644325349124-d1756b79dd42?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Registro Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-multiply"></div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col p-4 py-8 md:p-12 lg:p-16 overflow-y-auto h-full">
                <div className="w-full max-w-md m-auto">
                    <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-900 dark:text-white mb-6">Crear Cuenta</h1>
                    
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
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    {...register("password", { required: true })}
                                    className="form-input w-full transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
        </div>
    );
};

export default Registro;