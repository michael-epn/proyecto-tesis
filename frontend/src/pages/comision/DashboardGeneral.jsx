import React, { useState, useEffect, useRef } from 'react';
import clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import DoughnutChart from '../../charts/DoughnutChart';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip as ChartTooltip } from 'chart.js';
import { useThemeProvider } from '../../utils/ThemeContext';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, ChartTooltip);

function DashboardGeneral() {
    const [cargando, setCargando] = useState(true);
    const [metricas, setMetricas] = useState({
        totalActivos: 0,
        estados: [],
        tecnologias: [],
        cargaDocente: [],
        capacidadGlobal: { totalOcupados: 0, totalMaximos: 0, promedioCarga: 0 }
    });
    const { currentTheme } = useThemeProvider();
    const isDark = currentTheme === 'dark';
    const techCanvasRef = useRef(null);
    const techChartInstanceRef = useRef(null);

    useEffect(() => {
        cargarMetricas();
    }, []);

    useEffect(() => {
        if (cargando || metricas.tecnologias.length === 0 || !techCanvasRef.current) return;
        const ctx = techCanvasRef.current;
        if (!ctx) return;
        
        techChartInstanceRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: metricas.tecnologias.map(t => t._id),
                datasets: [{
                    label: 'Proyectos',
                    data: metricas.tecnologias.map(t => t.count),
                    backgroundColor: '#8b5cf6',
                    hoverBackgroundColor: '#6d28d9',
                    borderRadius: 6,
                    barPercentage: 0.5,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: isDark ? '#334155' : '#f1f5f9' },
                        ticks: { stepSize: 1, color: isDark ? '#94a3b8' : '#64748b' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: isDark ? '#f8fafc' : '#1e293b', font: { weight: 600 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        padding: 10,
                        cornerRadius: 6,
                        backgroundColor: isDark ? '#0f172a' : '#1e293b'
                    }
                }
            }
        });

        return () => {
            if (techChartInstanceRef.current) techChartInstanceRef.current.destroy();
        };
    }, [cargando, metricas.tecnologias, currentTheme]);

    const cargarMetricas = async () => {
        try {
            const { data } = await clienteAxios.get('/comision/metricas');
            const total = data.estados.reduce((acc, curr) => acc + curr.total, 0);
            
            setMetricas({
                totalActivos: total,
                estados: data.estados,
                tecnologias: data.tecnologias,
                cargaDocente: data.cargaDocente,
                capacidadGlobal: data.capacidadGlobal || { totalOcupados: 0, totalMaximos: 0, promedioCarga: 0 }
            });
        } catch (error) {
            toast.error("Error al cargar las métricas institucionales");
        } finally {
            setCargando(false);
        }
    };
    const mapeoColoresEstados = {
        'enviada': '#94a3b8',             
        'aceptada': '#0ea5e9',            
        'en_comision': '#f59e0b',         
        'en_revision': '#f97316',         
        'aprobado_final': '#10b981',      
        'rechazada': '#e11d48',           
        'rechazado_comision': '#b91c1c',
        'finalizado': '#3b82f6' 
    };

    const totalSolicitudesCentro = metricas.totalActivos;

    const doughnutChartData = {
        labels: metricas.estados.map(e => e._id.replace('_', ' ').toUpperCase()),
        datasets: [{
            label: 'Total',
            data: metricas.estados.map(e => e.total),
            backgroundColor: metricas.estados.map(e => mapeoColoresEstados[e._id] || '#6366f1'),
            borderWidth: 2,
            borderColor: '#ffffff'
        }],
    };
    const tramitesEnComision = metricas.estados.find(e => e._id === 'en_comision')?.total || 0;
    const tramitesEnRevision = metricas.estados.find(e => e._id === 'en_revision')?.total || 0;
    const totalPendientesAtencion = tramitesEnComision + tramitesEnRevision;

    const totalAprobados = metricas.estados.find(e => e._id === 'aprobado_final')?.total || 0;
    const totalFinalizados = metricas.estados.find(e => e._id === 'finalizado')?.total || 0;
    const tasaExito = totalSolicitudesCentro > 0 
        ? (((totalAprobados + totalFinalizados) / totalSolicitudesCentro) * 100).toFixed(1) 
        : 0;

    const globalOcupados = metricas.capacidadGlobal.totalOcupados;
    const globalMaximos = metricas.capacidadGlobal.totalMaximos;
    const porcentajeGlobalCapacidad = globalMaximos > 0 ? ((globalOcupados / globalMaximos) * 100).toFixed(1) : 0;
    const getCount = (estado) => metricas.estados.find(e => e._id === estado)?.total || 0;

    if (cargando) {
        return (
            <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center gap-4">
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-semibold text-slate-600 animate-pulse">Cargando ecosistema de datos ESFOT...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen">
            <div className="max-w-[1600px] mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-700 pb-5 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Panel de Control General</h2>
                        <p className="text-slate-500 font-medium text-sm mt-1">Métricas analíticas institucionales para la gestión de titulación y comisiones.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 self-start md:self-auto">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sincronizado en tiempo real</span>
                    </div>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-bl-full -z-0 group-hover:bg-slate-100/70"></div>
                        <div className="z-10">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historial de Trámites</h3>
                            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-2 tracking-tight">{totalSolicitudesCentro}</div>
                        </div>
                        <div className="text-xs text-slate-500 font-semibold mt-4 flex items-center gap-1">
                            <span className="text-slate-400">•</span> Total de solicitudes registradas
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-bl-full -z-0"></div>
                        <div className="z-10">
                            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pendientes Comisión</h3>
                            <div className="text-4xl font-black text-amber-600 mt-2 tracking-tight">{totalPendientesAtencion}</div>
                        </div>
                        <div className="text-xs text-slate-500 font-semibold mt-4 flex items-center gap-1">
                            <span className="text-amber-500 font-bold">↑</span> {tramitesEnComision} en pool global y {tramitesEnRevision} en revisión
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md  rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-bl-full -z-0"></div>
                        <div className="z-10">
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Tasa de Aprobación</h3>
                            <div className="text-4xl font-black text-emerald-600 mt-2 tracking-tight">{tasaExito}%</div>
                        </div>
                        <div className="text-xs text-slate-500 font-semibold mt-4 flex items-center gap-1">
                            <span className="text-emerald-500 font-bold">✓</span> Proyectos aprobados y finalizados
                        </div>
                    </div>
                    <div className="bg-violet-700 shadow-md hover:shadow-xl  rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-600/50 rounded-full"></div>
                        <div>
                            <h3 className="text-xs font-bold text-violet-200 uppercase tracking-widest">Capacidad de Carga Global</h3>
                            <div className="text-4xl font-black mt-2 tracking-tight">{porcentajeGlobalCapacidad}%</div>
                        </div>
                        <div className="text-xs text-violet-100 font-semibold mt-4 flex items-center gap-1">
                            <span>•</span> {globalOcupados} de {globalMaximos} cupos totales institucionales
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs">
                    <div className="mb-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Embudo del Flujo de Solicitudes</h3>
                        <p className="text-xs text-slate-400 font-medium">Distribución volumétrica actual en cada etapa del proceso de titulación.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 relative">
                        {[
                            { label: 'Enviada', key: 'enviada', color: 'bg-slate-400' },
                            { label: 'Aceptada', key: 'aceptada', color: 'bg-sky-500' },
                            { label: 'En Comisión', key: 'en_comision', color: 'bg-amber-500' },
                            { label: 'En Revisión', key: 'en_revision', color: 'bg-orange-500' },
                            { label: 'Aprobada', key: 'aprobado_final', color: 'bg-emerald-500' },
                            { label: 'Finalizada', key: 'finalizado', color: 'bg-blue-500' },
                        ].map((step, index) => (
                            <div key={index} className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">{step.label}</span>
                                    <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{getCount(step.key)}</span>
                                </div>
                                <span className={`w-3 h-3 ${step.color} rounded-full flex-shrink-0`}></span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-full xl:col-span-7 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col">
                        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Top 5: Carga por Tutor</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Balance de cupos asignados y disponibilidad institucional.</p>
                        </header>
                        
                        <div className="p-6 flex-grow flex flex-col justify-center space-y-5">
                            {metricas.cargaDocente.length === 0 ? (
                                <p className="text-center text-sm text-slate-400 font-semibold py-8">No existen datos suficientes.</p>
                            ) : (
                                metricas.cargaDocente.map((docente, idx) => {
                                    const pct = docente.cupos_maximos > 0 ? ((docente.cupos_ocupados / docente.cupos_maximos) * 100).toFixed(0) : 0;
                                    const estaLleno = pct >= 100;
                                    return (
                                        <div key={docente._id || idx} className="space-y-1.5 group">
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                                                        {docente.nombre} {docente.apellido}
                                                    </span>
                                                    {estaLleno && (
                                                        <span className="text-[10px] bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-black px-2 py-0.5 rounded-md uppercase border border-rose-200 dark:border-rose-800/50 animate-pulse">
                                                            Capacidad Máxima
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 font-semibold text-slate-500">
                                                    <span className="text-xs text-slate-400">{docente.cupos_ocupados} / {docente.cupos_maximos} Cupos</span>
                                                    <span className={`text-xs font-bold ${estaLleno ? 'text-rose-600' : 'text-violet-600'}`}>{pct}%</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/40 relative">
                                                <div 
                                                    className={`h-full rounded-full ${estaLleno ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-violet-500 to-violet-600'}`}
                                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                    <div className="col-span-full xl:col-span-5 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col">
                        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Estado Global de Solicitudes</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Distribución proporcional en tiempo real.</p>
                        </header>
                        <div className="p-6 flex-grow flex flex-col justify-center items-center relative min-h-[320px]">
                            {metricas.estados.length === 0 ? (
                                <p className="text-sm text-slate-400 font-semibold">No existen datos suficientes.</p>
                            ) : (
                                <>
                                    <div className="absolute flex flex-col items-center justify-center top-[30%] pointer-events-none">
                                        <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{totalSolicitudesCentro}</span>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Trámites</span>
                                    </div>
                                    <div className="w-full h-full max-h-[250px]">
                                        <DoughnutChart data={doughnutChartData} width={300} height={220} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col">
                        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Tecnologías más Utilizadas</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Top de stacks y lenguajes sugeridos por la Inteligencia Artificial.</p>
                        </header>
                        <div className="p-6 flex-grow min-h-[280px] relative">
                            {metricas.tecnologias.length === 0 ? (
                                <p className="text-center text-sm text-slate-400 font-semibold py-12">No existen datos suficientes.</p>
                            ) : (
                                <canvas ref={techCanvasRef}></canvas>
                            )}
                        </div>
                    </div>
                    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col">
                        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Capacidad Docente y Ocupación</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Balance operativo interno de tutorías de la institución.</p>
                        </header>
                        <div className="p-6 flex-grow flex flex-col justify-around space-y-6">
                            <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Promedio de Carga Actual</h4>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">Estudiantes asignados promedio por docente.</p>
                                </div>
                                <div className="text-2xl font-black text-violet-700">
                                    {Number(metricas.capacidadGlobal.promedioCarga || 0).toFixed(1)}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mapeo de Disponibilidad Total</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                                        <span className="text-[11px] font-bold text-slate-400 block uppercase">Cupos Utilizados</span>
                                        <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">{globalOcupados}</span>
                                    </div>
                                    <div className="border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40">
                                        <span className="text-[11px] font-bold text-slate-400 block uppercase">Cupos Disponibles</span>
                                        <span className="text-2xl font-extrabold text-emerald-600">
                                            {Math.max(0, globalMaximos - globalOcupados)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardGeneral;