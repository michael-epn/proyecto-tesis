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
            const roles = ['estudiante', 'docente', 'comision'];

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
        <div className="fixed inset-0 z-50 flex bg-white dark:bg-gray-900">
            <div className="w-full md:w-1/2 flex flex-col p-4 py-8 md:p-12 lg:p-16 overflow-y-auto h-full">
                <div className="w-full max-w-md m-auto">
                    <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-900 dark:text-white mb-6">Verificación de Cuenta</h1>
                    
                    {cargando ? (
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">Validando token con el servidor...</p>
                        </div>
                    ) : (
                        <div className="space-y-6 text-center">
                            {cuentaConfirmada ? (
                                <div>
                                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-6">Tu perfil ha sido activado. Ya puedes ingresar al sistema.</p>
                                    <Link 
                                        to="/auth/login" 
                                        className="btn btn-lg w-full bg-violet-600 hover:bg-violet-700 text-white active:scale-[0.98] transition-all shadow-sm"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-red-600 dark:text-red-400 font-semibold mb-6">El enlace de confirmación ha expirado o es incorrecto.</p>
                                    <Link 
                                        to="/auth/registro" 
                                        className="btn btn-lg w-full bg-gray-800 hover:bg-gray-900 text-white active:scale-[0.98] transition-all"
                                    >
                                        Crear Nueva Cuenta
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="hidden md:block md:w-1/2 relative bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1778319301228-43a825a40667?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Confirmar Cuenta Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-multiply"></div>
            </div>
        </div>
    );
};

export default ConfirmarCuenta;