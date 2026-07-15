import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Sidebar from '../partials/Sidebar'
import Header from '../partials/Header'

const DashboardLayout = ({ rolesPermitidos }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { isAuthenticated, rol, connectStreamChat } = useAuthStore()

    // Solo pide la conexión, el Store decide si es necesaria.
    useEffect(() => {
        if (isAuthenticated) {
            connectStreamChat();
        }
    }, [isAuthenticated, connectStreamChat]);

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