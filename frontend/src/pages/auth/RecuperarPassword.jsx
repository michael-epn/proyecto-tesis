import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';

const RecuperarPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

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
        <div 
            className="fixed inset-0 w-full h-full grid place-items-center overflow-auto p-4"
            style={{ 
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1569150219201-a51caac04011?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-slate-200">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Restablecer Password</h1>
                <p className="text-sm text-center text-slate-600 mb-8">
                    Ingresa tu correo institucional y te enviaremos las instrucciones.
                </p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Perfil de Acceso</label>
                        <select
                            {...register("rol", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700 transition-all appearance-none"
                        >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="comision">Comisión Académica</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="usuario@email.com"
                        />
                        {errors.email && <span className="text-xs text-red-500 mt-1 block">Campo requerido</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 mt-2"
                    >
                        Enviar Instrucciones
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-200 pt-6">
                    <Link to="/auth/login" className="text-sm text-blue-600 font-bold hover:underline">
                        Volver al Inicio de Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword;