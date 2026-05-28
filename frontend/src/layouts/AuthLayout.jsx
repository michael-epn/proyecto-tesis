import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const AuthLayout = () => {
    const { isAuthenticated, rol } = useAuthStore()

    if (isAuthenticated) {
        return <Navigate to={`/${rol}`} replace />
    }

    return (
        <main className="bg-white">
            <div className="relative flex">
                <div className="w-full md:w-1/2">
                    <div className="min-h-screen h-full flex flex-col after:flex-1">
                        <div className="flex-1">
                            <div className="flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
                                <div className="w-full max-w-sm">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AuthLayout