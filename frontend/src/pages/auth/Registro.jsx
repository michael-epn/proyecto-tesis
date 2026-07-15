import { Controller, useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';
import { useState } from 'react';
import CustomSelect from '../../components/CustomSelect';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import GoogleAuthButton from '../../components/GoogleAuthButton';

const opcionesRoles = [
    { value: "estudiante", label: "Estudiante" },
    { value: "docente", label: "Docente" },
    { value: "comision", label: "Comisión Académica" },
];

const opcionesCarreras = [
    { value: "Tecnología Superior en Agua y Saneamiento Ambiental", label: "Tecnología Superior en Agua y Saneamiento Ambiental" },
    { value: "Tecnología Superior en Desarrollo de Software", label: "Tecnología Superior en Desarrollo de Software" },
    { value: "Tecnología Superior en Electromecánica", label: "Tecnología Superior en Electromecánica" },
    { value: "Tecnología Superior en Redes y Telecomunicaciones", label: "Tecnología Superior en Redes y Telecomunicaciones" },
    { value: "Tecnología Superior en Procesamiento de Alimentos", label: "Tecnología Superior en Procesamiento de Alimentos" },
    { value: "Tecnología Superior en Procesamiento Industrial de la Madera", label: "Tecnología Superior en Procesamiento Industrial de la Madera" }
];

const Registro = () => {
    const { register, handleSubmit, watch, control, getValues, trigger, clearErrors, formState: { errors } } = useForm({
        defaultValues: {rol: '', carrera: ''},
        mode: 'onChange',
        shouldUnregister: true
    });
    const navigate = useNavigate();
    const rolSeleccionado = watch('rol');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const registerConGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsGoogleLoading(true);
            try {
                // 1. Obtenemos los valores del formulario (Rol y Carrera)
                const formData = getValues();

                // 2. Obtenemos el perfil de Google
                const { data: googleProfile } = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                );

                // 3. Enviamos AMBAS cosas al backend
                await clienteAxios.post('/auth/google', {
                    email: googleProfile.email,
                    nombre: googleProfile.given_name,
                    apellido: googleProfile.family_name,
                    picture: googleProfile.picture,
                    carrera: formData.carrera,
                    rolEsperado: formData.rol,
                    action: 'register'
                });

                toast.success('Cuenta creada exitosamente con Google');
                navigate('/auth/login');
            } catch (error) {
                toast.error(error.response?.data?.msg || 'Error al registrarse con Google');
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: () => toast.error('Registro cancelado')
    });

    const handleGoogleClick = async () => {
        // Validamos que elijan el rol y la carrera ANTES de abrir Google
        const isRolValid = await trigger('rol');
        if (!isRolValid) return;

        if (rolSeleccionado === 'estudiante') {
            const isCarreraValid = await trigger('carrera');
            if (!isCarreraValid) return;
        }

        // Si pasaron la validación, abrimos Google
        registerConGoogle();
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false); // Desbloquea el botón al finalizar (éxito o error)
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-white dark:bg-slate-900 dark:bg-slate-900">
            <div className="hidden md:block md:w-1/2 relative bg-slate-900">
                <img 
                    src="https://images.unsplash.com/photo-1644325349124-d1756b79dd42?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Registro Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-multiply"></div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col p-4 py-8 md:p-12 lg:p-16 overflow-y-auto h-full">
                <div className="w-full max-w-md m-auto">
                    <h1 className="text-2xl md:text-3xl text-center font-bold text-slate-900 dark:text-slate-100 dark:text-white mb-6">Crear Cuenta</h1>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipo de Perfil</label>
                            <Controller
                                name="rol"
                                control={control}
                                rules={{ required: "El perfil es obligatorio" }}
                                render={({ field: { value, onChange } }) => (
                                    <CustomSelect
                                        value={value}
                                        onChange={(val) => {
                                            onChange(val);
                                            clearErrors("rol");
                                        }}
                                        options={opcionesRoles}
                                        placeholder="Selecciona un perfil..."
                                        error={!!errors.rol}
                                    />
                                )}
                            />
                            {errors.rol && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    {...register("nombre", { required: true })}
                                    className="w-full px-4 rounded-xl py-3 form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none" 
                                />
                                {errors.nombre && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Apellido</label>
                                <input
                                    type="text"
                                    {...register("apellido", { required: true })}
                                    className="w-full px-4 py-3 rounded-xl form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none" 
                                />
                                {errors.apellido && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="w-full rounded-xl px-4 py-3 form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none"
                                placeholder="usuario@email.com"
                            />
                            {errors.email && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>

                        {rolSeleccionado === 'estudiante' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Carrera</label>
                                <Controller
                                    name="carrera"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomSelect
                                            value={value}
                                            onChange={(val) => {
                                                onChange(val);
                                                clearErrors("carrera");
                                            }}
                                            
                                            options={opcionesCarreras}
                                            placeholder="Selecciona tu carrera..."
                                            error={!!errors.carrera}
                                        />
                                    )}
                                />
                                {errors.carrera && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        )}

                        {rolSeleccionado === 'docente' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Áreas de Investigación</label>
                                <input
                                    type="text"
                                    {...register("areas_investigacion", { required: true })}
                                    className="w-full px-4 py-3 rounded-xl form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none" 
                                    placeholder="Separadas por comas"
                                />
                                {errors.areas_investigacion && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        )}

                        {rolSeleccionado === 'comision' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cargo</label>
                                <input
                                    type="text"
                                    {...register("cargo", { required: true })}
                                    className="w-full rounded-xl px-4 py-3 form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none"
                                    placeholder="Ej. Coordinador"
                                />
                                {errors.cargo && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                            </div>
                        )}

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

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn btn-lg rounded-xl w-full bg-violet-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-700'} text-white active:scale-[0.98] mt-4 shadow-sm`}
                        >
                            {isSubmitting ? 'Procesando...' : 'Registrarse'}
                        </button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">O</span>
                            <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                        </div>

                        {/* Nuevo botón de Google */}
                        <GoogleAuthButton 
                            isLoading={isGoogleLoading}
                            onClick={handleGoogleClick}
                        />
                    </form>

                    <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-700 dark:border-slate-700 pt-6">
                        <p className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400">
                            ¿Ya tienes una cuenta? <Link to="/auth/login" className="text-violet-600 dark:text-violet-400 font-bold hover:underline">Inicia Sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;