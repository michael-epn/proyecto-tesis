import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

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
        <div 
            className="fixed inset-0 w-full h-full grid place-items-center overflow-auto p-4"
            style={{ 
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1758073519996-6d3c63b4922c?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-slate-200">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
                    Sistema Predictivo <span className="text-blue-600">ESFOT</span>
                </h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Perfil de Acceso</label>
                        <select
                            {...register("rol", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700 transition-all appearance-none"
                        >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="comision">Comisión Academica</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Correo Institucional</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                            placeholder="usuario@epn.edu.ec"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/auth/recuperarpassword" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                            ¿Olvidaste tu password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
                    >
                        Iniciar Sesion
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-200 pt-6">
                    <p className="text-sm text-slate-600">
                        ¿No tienes una cuenta? <Link to="/auth/registro" className="text-blue-600 font-bold hover:underline">Registrate aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;