import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Paginas Publicas
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Registro from './pages/auth/Registro'
import ConfirmarCuenta from './pages/auth/ConfirmarCuenta'
import RecuperarPassword from './pages/auth/RecuperarPassword'
import NuevoPassword from './pages/auth/NuevoPassword'

// Paginas Privadas
import Recomendaciones from './pages/estudiante/Recomendaciones'
import PerfilEstudiante from './pages/estudiante/PerfilEstudiante'
import SolicitudesEntrantes from './pages/docente/SolicitudesEntrantes'
import PerfilDocente from './pages/docente/PerfilDocente'
import DashboardGeneral from './pages/direccion/DashboardGeneral'
import AuditoriaTramites from './pages/direccion/AuditoriaTramites'
import PerfilDireccion from './pages/direccion/PerfilDireccion'

const App = () => {
    return (
        <Routes>
            {/* 1. Landing Page */}
            <Route path="/" element={<Landing />} />

            {/* 2. Rutas Publicas (Login, Registro, Correos) */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="registro" element={<Registro />} />
                <Route path="confirmar/:token" element={<ConfirmarCuenta />} />
                <Route path="recuperarpassword" element={<RecuperarPassword />} />
                <Route path="nuevopassword/:token" element={<NuevoPassword />} />
            </Route>

            {/* 3. Rutas Privadas por Rol */}
            <Route path="/estudiante" element={<DashboardLayout rolesPermitidos={['estudiante']} />}>
                <Route index element={<Recomendaciones />} />
                <Route path="perfil" element={<PerfilEstudiante />} />
            </Route>

            <Route path="/docente" element={<DashboardLayout rolesPermitidos={['docente']} />}>
                <Route index element={<SolicitudesEntrantes />} />
                <Route path="perfil" element={<PerfilDocente />} />
            </Route>

            <Route path="/direccion" element={<DashboardLayout rolesPermitidos={['direccion']} />}>
                <Route index element={<DashboardGeneral />} />
                <Route path="auditoria" element={<AuditoriaTramites />} />
                <Route path="perfil" element={<PerfilDireccion />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App