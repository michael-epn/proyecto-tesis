import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';
import CustomSelect from '../../components/CustomSelect';

const opcionesRoles = [
    { value: "estudiante", label: "Estudiante" },
    { value: "docente", label: "Docente" },
    { value: "comision", label: "Comisión Académica" },
];

const RecuperarPassword = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const url = `/${data.rol}/recuperarpassword`;
            const respuesta = await clienteAxios.post(url, { email: data.email });
            toast.success(respuesta.data.msg);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al procesar la solicitud");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-white dark:bg-slate-900 dark:bg-slate-900">
            <div className="hidden md:block md:w-1/2 relative bg-slate-900">
                <img 
                    src="https://images.unsplash.com/photo-1569150219201-a51caac04011?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Recuperar Password Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-multiply"></div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col p-4 py-8 md:p-12 lg:p-16 overflow-y-auto h-full">
                <div className="w-full max-w-md m-auto">
                    <h1 className="text-2xl md:text-3xl text-center font-bold text-slate-900 dark:text-slate-100 dark:text-white mb-2">Restablecer Password</h1>
                    <p className="text-sm text-center text-slate-600 dark:text-slate-400 dark:text-slate-400 mb-6">
                        Ingresa tu correo electrónico y te enviaremos las instrucciones.
                    </p>
                    
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
                                className="w-full px-4 py-3 rounded-xl form-input bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-shadow resize-none" 
                                placeholder="usuario@email.com"
                            />
                            {errors.email && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-lg rounded-xl w-full bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98] mt-4 shadow-sm"
                        >
                            Enviar Instrucciones
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-700 dark:border-slate-700 pt-6">
                        <Link to="/auth/login" className="text-sm text-violet-600 dark:text-violet-400 font-bold hover:underline">
                            Volver al Inicio de Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword;