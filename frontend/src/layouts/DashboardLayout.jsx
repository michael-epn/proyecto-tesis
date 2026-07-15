import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Sidebar from '../partials/Sidebar'
import Header from '../partials/Header'
import { StreamChat } from 'stream-chat'
import clienteAxios from '../config/axios'
import { useRef } from 'react'

export const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY)

const DashboardLayout = ({ rolesPermitidos }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [streamConnected, setStreamConnected] = useState(false)
    const { isAuthenticated, rol, user } = useAuthStore()
    const isConnecting = useRef(false);

    useEffect(() => {
        const connectStream = async () => {
            if (user?._id && !streamClient.userID && !isConnecting.current) {
                isConnecting.current = true;
                try {
                    const { data } = await clienteAxios.get('/chat/token');
                    await streamClient.connectUser({
                        id: user._id,
                        name: `${user.nombre} ${user.apellido || ''}`.trim(),
                        image: user.fotoPerfil || undefined,
                        rol: rol
                    }, data.token);
                    
                    setStreamConnected(true);
                } catch (error) {
                    console.error("Error:", error);
                    isConnecting.current = false;
                }
            }
        };
        connectStream();
        return () => {
            if (streamClient.userID) {
                streamClient.disconnectUser();
                setStreamConnected(false);
                isConnecting.current = false;
            }
        };
    }, [user, rol]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }
    if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
        return <Navigate to={`/${rol}`} replace />
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout