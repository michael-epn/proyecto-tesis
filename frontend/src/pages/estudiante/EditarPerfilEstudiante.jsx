import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { useAuthStore } from '../../store/authStore';

const InputField = ({ label, register, name, type = "text", disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input 
            type={type} 
            {...register(name)} 
            disabled={disabled}
            className={`w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`} 
        />
    </div>
);

const EditarPerfilEstudiante = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword } = useForm();
    
    const { user, token, rol, setAuth } = useAuthStore();
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const [fotoPreview, setFotoPreview] = useState(null);
    const [archivoFoto, setArchivoFoto] = useState(null);

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get('/estudiante/perfil');
                reset({
                    ...data,
                    intereses: data.intereses?.join(', ') || '',
                    habilidades_tecnicas: data.habilidades_tecnicas?.join(', ') || ''
                });
                if(data.fotoPerfil) {
                    setFotoPreview(data.fotoPerfil);
                }
            } catch (error) {
                toast.error("Error al cargar la información del perfil");
            } finally {
                setCargando(false);
            }
        };
        cargarPerfil();
    }, [reset]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setArchivoFoto(file);
            const objectUrl = URL.createObjectURL(file);
            setFotoPreview(objectUrl);
        }
    };

    const onSubmit = async (formData) => {
        try {
            const { email, ...dataRestante } = formData;

            const interesesArray = typeof dataRestante.intereses === 'string' ? dataRestante.intereses.split(',').map(i => i.trim()).filter(Boolean) : [];
            const habilidadesArray = typeof dataRestante.habilidades_tecnicas === 'string' ? dataRestante.habilidades_tecnicas.split(',').map(i => i.trim()).filter(Boolean) : [];

            const dataToSend = new FormData();
            dataToSend.append('nombre', dataRestante.nombre);
            dataToSend.append('apellido', dataRestante.apellido);
            dataToSend.append('carrera', dataRestante.carrera);
            dataToSend.append('intereses', JSON.stringify(interesesArray));
            dataToSend.append('habilidades_tecnicas', JSON.stringify(habilidadesArray));
            
            if (archivoFoto) {
                dataToSend.append('fotoPerfil', archivoFoto);
            }

            const { data } = await clienteAxios.put(`/estudiante/perfil/${user?._id}`, dataToSend);
            setAuth(token, data, rol);
            toast.success("Perfil técnico actualizado con éxito");
            navigate('/estudiante/perfil');
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
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Configurar Mi Perfil</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center">
                        {fotoPreview ? (
                            <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-400 text-xs text-center px-2">Sin foto</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Foto de Perfil</label>
                        <input 
                            type="file" 
                            accept="image/jpeg, image/png, image/webp" 
                            onChange={handleImageChange}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        />
                        <p className="text-xs text-slate-400 mt-1">Formatos recomendados: JPG, PNG. Max 2MB.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nombre" register={register} name="nombre" />
                    <InputField label="Apellido" register={register} name="apellido" />
                    <InputField label="Carrera" register={register} name="carrera" disabled={true} />
                    <InputField label="Email" register={register} name="email" type="email" disabled={true} />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Intereses (separados por coma)</label>
                        <textarea {...register("intereses")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="IA, IoT, Análisis de datos..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Habilidades Técnicas (separadas por coma)</label>
                        <textarea {...register("habilidades_tecnicas")} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-md" placeholder="Python, React, MongoDB..."></textarea>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors">
                        Guardar Cambios
                    </button>
                    <button type="button" onClick={() => navigate('/estudiante/perfil')} className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded hover:bg-slate-300 transition-colors">
                        Cancelar
                    </button>
                </div>
            </form>

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

export default EditarPerfilEstudiante;