import { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';

export const ModalNuevoChat = ({ isOpen, onClose, onStartChat }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        
        const fetchUsuariosDisponibles = async () => {
            try {
                setCargando(true);
                const { data } = await clienteAxios.get('/chat/usuarios-disponibles');
                setUsuarios(data);
            } catch (error) {
                toast.error("Error al cargar los usuarios disponibles");
            } finally {
                setCargando(false);
            }
        };

        fetchUsuariosDisponibles();
    }, [isOpen]);

    if (!isOpen) return null;

    const usuariosFiltrados = usuarios.filter(u => 
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || 
        u.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.rol?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Nuevo Mensaje</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <input 
                        type="text"
                        placeholder="Buscar por nombre, apellido o rol..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    />
                </div>

                <div className="max-h-80 overflow-y-auto p-2">
                    {cargando ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                        </div>
                    ) : usuariosFiltrados.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">No se encontraron usuarios.</p>
                    ) : (
                        usuariosFiltrados.map(usuario => (
                            <button
                                key={usuario._id}
                                onClick={() => onStartChat(usuario)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                                    {usuario.fotoPerfil ? (
                                        <img src={usuario.fotoPerfil} alt="Foto" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-slate-500 font-bold">{usuario?.nombre.charAt(0)}{usuario.apellido?.charAt(0)}</span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{usuario.nombre} {usuario.apellido}</h4>
                                    <p className="text-xs text-slate-500 capitalize">{usuario.rol}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};