import React, { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import { toast } from 'react-toastify';
import BarChart from '../../charts/BarChart01';
import DoughnutChart from '../../charts/DoughnutChart';

function DashboardGeneral() {
    const [cargando, setCargando] = useState(true);
    const [metricas, setMetricas] = useState({
        totalActivos: 0,
        estados: [],
        tecnologias: [],
        cargaDocente: []
    });

    useEffect(() => {
        cargarMetricas();
    }, []);

    const cargarMetricas = async () => {
        try {
            const { data } = await clienteAxios.get('/comision/metricas');
            const total = data.estados.reduce((acc, curr) => acc + curr.total, 0);
            
            setMetricas({
                totalActivos: total,
                estados: data.estados,
                tecnologias: data.tecnologias,
                cargaDocente: data.cargaDocente
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
        'rechazada': '#f43f5e',           
        'rechazado_comision': '#dc2626'   
    };

    const doughnutChartData = {
        labels: metricas.estados.map(e => e._id.replace('_', ' ').toUpperCase()),
        datasets: [{
            label: 'Distribución de Trámites',
            data: metricas.estados.map(e => e.total),
            backgroundColor: metricas.estados.map(e => mapeoColoresEstados[e._id] || '#6366f1'),
            hoverBackgroundColor: metricas.estados.map(e => mapeoColoresEstados[e._id] || '#4f46e5'),
            borderWidth: 0,
        }],
    };

    const barChartData = {
        labels: metricas.cargaDocente.map(d => `${d.nombre} ${d.apellido}`),
        datasets: [{
            label: 'Cupos Ocupados',
            data: metricas.cargaDocente.map(d => d.cupos_ocupados),
            backgroundColor: '#6366f1', // Tus colores originales
            hoverBackgroundColor: '#4f46e5',
            barPercentage: 0.66,
            categoryPercentage: 0.66,
        }],
    };

    if (cargando) return <div className="p-8 text-center font-bold text-slate-500">Analizando datos académicos...</div>;

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Panel de Control ESFOT</h2>
                    <p className="text-slate-500 mt-2 font-medium">Métricas en tiempo real del ecosistema de titulación y asignación de tutores.</p>
                </header>

                <div className="grid grid-cols-12 gap-6">
                    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-xl rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Trámites Históricos</h3>
                        <div className="text-4xl font-extrabold text-slate-800">{metricas.totalActivos}</div>
                        <div className="text-sm text-slate-500 font-medium mt-2">Registrados en el sistema</div>
                    </div>

                    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-xl rounded-2xl border border-slate-200 p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Tecnología Dominante</h3>
                        <div className="text-2xl font-extrabold text-slate-800 truncate">
                            {metricas.tecnologias.length > 0 ? metricas.tecnologias[0]._id : 'N/A'}
                        </div>
                        <div className="text-sm text-slate-500 font-medium mt-2">Herramienta más sugerida por la IA</div>
                    </div>

                    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-4 bg-indigo-600 shadow-xl rounded-2xl border border-indigo-700 p-6 text-white">
                        <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-2">Atención Comisión</h3>
                        <div className="text-4xl font-extrabold">
                            {metricas.estados.find(e => e._id === 'en_comision')?.total || 0}
                        </div>
                        <div className="text-sm text-indigo-100 font-medium mt-2">Trámites esperando revisión final</div>
                    </div>

                    <div className="flex flex-col col-span-full xl:col-span-5 bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                        <header className="bg-slate-800 px-6 py-4 border-b border-slate-700">
                            <h3 className="text-lg font-bold text-white">Estado Global de Solicitudes</h3>
                        </header>
                        <div className="p-5 flex-grow">
                            <DoughnutChart data={doughnutChartData} width={389} height={260} />
                        </div>
                    </div>

                    <div className="flex flex-col col-span-full xl:col-span-7 bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
                        <header className="bg-slate-800 px-6 py-4 border-b border-slate-700">
                            <h3 className="text-lg font-bold text-white">Top 5: Carga por Tutor</h3>
                        </header>
                        <div className="p-5 flex-grow">
                            <BarChart data={barChartData} width={595} height={248} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardGeneral;