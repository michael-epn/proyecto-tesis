import { create } from 'zustand'
import { StreamChat } from 'stream-chat'
import clienteAxios from '../config/axios'

// Exportamos la instancia para que useChat.js la consuma sin redeclararla
export const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY)

export const useAuthStore = create((set, get) => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    rol: localStorage.getItem('rol') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isStreamConnected: false, // Bandera para evitar dobles conexiones

    setAuth: (token, user, rol) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('rol', rol)
        set({ token, user, rol, isAuthenticated: true })
    },

    connectStreamChat: async () => {
        const { user, rol, isStreamConnected } = get();
        
        // Evitamos reconexiones si ya está conectado
        if (!user?._id || streamClient.userID || isStreamConnected) return;

        try {
            const { data } = await clienteAxios.get('/chat/token');
            await streamClient.connectUser({
                id: user._id,
                name: `${user.nombre} ${user.apellido || ''}`.trim(),
                image: user.fotoPerfil || undefined,
                rol: rol
            }, data.token);

            set({ isStreamConnected: true });
        } catch (error) {
            console.error("Error al conectar Stream Chat:", error);
        }
    },

    logout: async () => {
        // Desconexión limpia antes de borrar la sesión
        if (streamClient.userID) {
            await streamClient.disconnectUser();
        }

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('rol')
        
        set({ 
            token: null, 
            user: null, 
            rol: null, 
            isAuthenticated: false,
            isStreamConnected: false 
        })
    }
}))