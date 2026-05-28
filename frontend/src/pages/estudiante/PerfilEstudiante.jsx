import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import clienteAxios from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

// Componente auxiliar para reducir código repetitivo
const InputField = ({ label, register, name, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input 
            type={type} 
            {...register(name)} 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
        />
    </div>
);

const PerfilEstudiante = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm();
    
    const { user, token, rol, setAuth } = useAuthStore();
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get('/estudiante/perfil');
                reset({
                    ...data,
                    intereses: data.intereses?.join(', ') || '',
                    habilidades_tecnicas: data.habilidades_tecnicas?.join(', ') || ''
                });
            } catch (error) {
                toast.error("Error al cargar la información del perfil");
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, [reset]);

    const onSubmit = async (formData) => {
        try {
            const payload = {
                ...formData,
                intereses: typeof formData.intereses === 'string' ? formData.intereses.split(',').map(i => i.trim()).filter(Boolean) : [],
                habilidades_tecnicas: typeof formData.habilidades_tecnicas === 'string' ? formData.habilidades_tecnicas.split(',').map(i => i.trim()).filter(Boolean) : []
            };

            const { data } = await clienteAxios.put(`/estudiante/perfil/${user?._id}`, payload);
            setAuth(token, data, rol);
            toast.success("Perfil técnico actualizado con éxito");
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar el perfil");
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            await clienteAxios.put('/estudiante/password', data);
            toast.success("Contraseña actualizada correctamente");
            resetPassword();
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar contraseña");
        }
    };

    if (cargando) return <div className="text-center mt-10">Cargando información...</div>;

    return (
        <div className="bg-white shadow-md rounded-sm border border-slate-200 p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Mi Perfil Técnico</h2>

            {/* Formulario Perfil */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nombre" register={register} name="nombre" />
                    <InputField label="Apellido" register={register} name="apellido" />
                    <InputField label="Carrera" register={register} name="carrera" />
                    <InputField label="Email" register={register} name="email" type="email" />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Intereses</label>
                        <textarea {...register("intereses")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="IA, IoT, Análisis de datos..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Habilidades Técnicas</label>
                        <textarea {...register("habilidades_tecnicas")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="Python, React, MongoDB..."></textarea>
                    </div>
                </div>

                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors">
                    Guardar Cambios
                </button>
            </form>

            {/* Formulario Seguridad */}
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="mt-10 pt-6 border-t space-y-6">
                <h3 className="text-xl font-bold text-slate-800">Seguridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Password Actual" register={registerPassword} name="passwordactual" type="password" />
                    <InputField label="Nuevo Password" register={registerPassword} name="passwordnuevo" type="password" />
                </div>
                <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-6 rounded hover:bg-slate-900 transition-colors">
                    Actualizar Password
                </button>
            </form>
        </div>
    );
};

export default PerfilEstudiante;