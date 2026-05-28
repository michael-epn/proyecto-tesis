import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteAxios from '../../config/axios';

const ConfirmarCuenta = () => {
    const { token } = useParams();
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
    const [cargando, setCargando] = useState(true);
    const intentoRealizado = useRef(false);

    useEffect(() => {
        if (intentoRealizado.current) return;
        intentoRealizado.current = true;

        const confirmarCuenta = async () => {
            let exito = false;
            const roles = ['estudiante', 'docente', 'direccion'];

            for (const rol of roles) {
                try {
                    await clienteAxios.get(`/${rol}/confirmar/${token}`);
                    setCuentaConfirmada(true);
                    break;
                } catch (error) {
                    continue;
                }
            }
            
            setCargando(false);
        };

        confirmarCuenta();
    }, [token]);

    return (
        <div 
            className="fixed inset-0 w-full h-full grid place-items-center overflow-auto p-4"
            style={{ 
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1778319301228-43a825a40667?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-slate-200 text-center">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Verificación de Cuenta</h1>
                
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-slate-600 font-medium">Validando token con el servidor...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {cuentaConfirmada ? (
                            <div>
                                <p className="text-emerald-600 font-semibold mb-8">Tu perfil ha sido activado. Ya puedes ingresar al sistema.</p>
                                <Link 
                                    to="/auth/login" 
                                    className="block w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
                                >
                                    Iniciar Sesión
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <p className="text-red-600 font-semibold mb-8">El enlace de confirmación ha expirado o es incorrecto.</p>
                                <Link 
                                    to="/auth/registro" 
                                    className="block w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 active:scale-[0.98] transition-all"
                                >
                                    Crear Nueva Cuenta
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmarCuenta;