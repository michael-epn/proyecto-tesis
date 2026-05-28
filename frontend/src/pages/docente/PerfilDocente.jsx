import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import clienteAxios from '../../config/axios'
import { useAuthStore } from '../../store/authStore'

const PerfilDocente = () => {
    // Agregamos 'errors' a la desestructuración de useForm
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    
    const { 
        register: registerPassword, 
        handleSubmit: handleSubmitPassword, 
        reset: resetPassword 
    } = useForm()

    const { user, token, rol, setAuth } = useAuthStore()
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                const { data } = await clienteAxios.get('/docente/perfil')
                const datosFormateados = {
                    ...data,
                    areas_investigacion: data.areas_investigacion?.join(', ') || '',
                    tecnologias_especialidad: data.tecnologias_especialidad?.join(', ') || ''
                }
                reset(datosFormateados)
            } catch (error) {
                toast.error("Error al cargar la configuración del docente")
            } finally {
                setCargando(false)
            }
        }
        cargarPerfil()
    }, [reset])

    const onSubmit = async (formData) => {
        try {
            const payload = { ...formData }
            
            payload.areas_investigacion = typeof payload.areas_investigacion === 'string' 
                ? payload.areas_investigacion.split(',').map(item => item.trim()).filter(Boolean) 
                : payload.areas_investigacion || []
                
            payload.tecnologias_especialidad = typeof payload.tecnologias_especialidad === 'string' 
                ? payload.tecnologias_especialidad.split(',').map(item => item.trim()).filter(Boolean) 
                : payload.tecnologias_especialidad || []
                
            payload.cupos_maximos = Number(payload.cupos_maximos)

            const { data } = await clienteAxios.put(`/docente/perfil/${user?._id}`, payload)
            
            setAuth(token, data, rol)
            toast.success("Parámetros de tutoría actualizados")
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar")
        }
    }

    const onSubmitPassword = async (data) => {
        try {
            await clienteAxios.put('/docente/password', data) 
            toast.success("Contraseña actualizada correctamente")
            resetPassword()
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al actualizar contraseña")
        }
    }

    if (cargando) return <div className="text-center mt-10">Cargando información...</div>

    return (
        <div className="bg-white shadow-md rounded-sm border border-slate-200 p-6 max-w-3xl mx-auto">
            <header className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Gestión de Cupos e Investigación</h2>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cupos Máximos</label>
                        <input type="number" {...register("cupos_maximos", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                    </div>
                    {/* Campo solicitado integrado */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Areas de Investigacion</label>
                        <input
                            type="text"
                            {...register("areas_investigacion", { required: true })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Separadas por comas (IA, Datos)"
                        />
                        {errors.areas_investigacion && <span className="text-xs text-red-500 mt-1 block">Requerido</span>}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700">
                        Guardar Configuración
                    </button>
                </div>
            </form>

            {/* Formulario de Seguridad */}
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6 mt-10 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">Seguridad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password Actual</label>
                        <input type="password" {...registerPassword("passwordactual", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nuevo Password</label>
                        <input type="password" {...registerPassword("passwordnuevo", { required: true })} className="w-full px-3 py-2 border border-slate-300 rounded-md" />
                    </div>
                </div>
                <button type="submit" className="bg-slate-800 text-white font-bold py-2 px-6 rounded hover:bg-slate-900">
                    Actualizar Password
                </button>
            </form>
        </div>
    )
}

export default PerfilDocente