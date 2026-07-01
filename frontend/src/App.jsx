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
import SolicitudesEntrantes from './pages/docente/SolicitudesEntrantes'
import DashboardGeneral from './pages/comision/DashboardGeneral'
import AuditoriaTramites from './pages/comision/AuditoriaTramites'
import Recomendaciones from './pages/estudiante/Recomendaciones'
import VerPerfilEstudiante from './pages/estudiante/VerPerfilEstudiante'
import EditarPerfilEstudiante from './pages/estudiante/EditarPerfilEstudiante'
import EditarPerfilDocente from './pages/docente/EditarPerfilDocente'
import VerPerfilDocente from './pages/docente/VerPerfilDocente'
import HistorialDocente from './pages/docente/HistorialDocente'
import HistorialEstudiante from './pages/estudiante/HistorialEstudiante'
import EstudiantesAceptados from './pages/docente/EstudiantesAceptados'
import VerPerfilComision from './pages/comision/VerPerfilComision'
import EditarPerfilComision from './pages/comision/EditarPerfilComision'
import HistorialComision from './pages/comision/HistorialComision'

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
                <Route path="perfil" element={<VerPerfilEstudiante />} /> 
                <Route path="configuracion" element={<EditarPerfilEstudiante />} />
                <Route path="historial" element={<HistorialEstudiante />} /> 
            </Route>

            <Route path="/docente" element={<DashboardLayout rolesPermitidos={['docente']} />}>
                <Route index element={<SolicitudesEntrantes />} />
                <Route path="perfil" element={<VerPerfilDocente />} />
                <Route path="configuracion" element={<EditarPerfilDocente />} />
                <Route path="historial" element={<HistorialDocente />} />
                <Route path="listado" element={<EstudiantesAceptados />} />
            </Route>

            <Route path="/comision" element={<DashboardLayout rolesPermitidos={['comision']} />}>
                <Route index element={<DashboardGeneral />} />
                <Route path="auditoria" element={<AuditoriaTramites />} />
                <Route path="perfil" element={<VerPerfilComision />} />
                <Route path="configuracion" element={<EditarPerfilComision />} />
                <Route path="historial" element={<HistorialComision />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App