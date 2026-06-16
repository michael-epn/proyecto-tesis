import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation()
  const { pathname } = location
  const rol = useAuthStore((state) => state.rol)

  const trigger = useRef(null)
  const sidebar = useRef(null)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true')

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded)
    if (sidebarExpanded) {
      document.querySelector('body').classList.add('sidebar-expanded')
    } else {
      document.querySelector('body').classList.add('sidebar-expanded')
    }
  }, [sidebarExpanded])

  return (
    <div className="space-y-8">
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100vh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          <NavLink end to="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-white sidebar-fade">ESFOT Tesis</span>
          </NavLink>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block">Navegación</span>
            </h3>
            <ul className="mt-3">
              
              {rol === 'estudiante' && (
                <>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/estudiante' && 'bg-slate-900'}`}>
                    <NavLink end to="/estudiante" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/estudiante' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Mis Recomendaciones</span>
                      </div>
                    </NavLink>
                  </li>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/estudiante/perfil' && 'bg-slate-900'}`}>
                    <NavLink end to="/estudiante/perfil" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/estudiante/perfil' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Mi Perfil</span>
                      </div>
                    </NavLink>
                  </li>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/estudiante/historial' && 'bg-slate-900'}`}>
                    <NavLink end to="/estudiante/historial" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/estudiante/historial' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Historial de Temas</span>
                      </div>
                    </NavLink>
                  </li>
                </>
              )}

              {rol === 'docente' && (
                <>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/docente' && 'bg-slate-900'}`}>
                    <NavLink end to="/docente" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/docente' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Solicitudes Entrantes</span>
                      </div>
                    </NavLink>
                  </li>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/docente/perfil' && 'bg-slate-900'}`}>
                    <NavLink end to="/docente/perfil" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/docente/perfil' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Mi Perfil</span>
                      </div>
                    </NavLink>
                  </li>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/docente/historial' && 'bg-slate-900'}`}>
                    <NavLink end to="/docente/historial" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/docente/historial' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Historial de Solicitudes</span>
                      </div>
                    </NavLink>
                  </li>
                </>
              )}

              {rol === 'comision' && (
                <>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/comision' && 'bg-slate-900'}`}>
                    <NavLink end to="/comision" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/comision' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Dashboard General</span>
                      </div>
                    </NavLink>
                  </li>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/comision/auditoria' && 'bg-slate-900'}`}>
                    <NavLink end to="/comision/auditoria" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/comision/auditoria' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Auditoria de Tramites</span>
                      </div>
                    </NavLink>
                  </li>
                  <li className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${pathname === '/comision/perfil' && 'bg-slate-900'}`}>
                    <NavLink end to="/comision/perfil" className={`block text-slate-200 truncate transition duration-150 ${pathname === '/comision/perfil' ? 'hover:text-slate-200' : 'hover:text-white'}`}>
                      <div className="flex items-center">
                        <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">Mi Perfil</span>
                      </div>
                    </NavLink>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>

        <div className="pt-3 hidden lg:inline-flex justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="w-6 h-6 fill-current sidebar-expanded:rotate-180" viewBox="0 0 24 24">
                <path className="text-slate-400" d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z" />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar