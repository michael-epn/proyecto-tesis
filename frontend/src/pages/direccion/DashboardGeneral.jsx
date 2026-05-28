import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import BarChart from '../../charts/BarChart01';
import DoughnutChart from '../../charts/DoughnutChart';
import RealtimeChart from '../../charts/RealtimeChart';
import { getCssVariable } from '../../utils/Utils';

function DashboardGeneral() {
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Simulacion de carga de datos estadisticos desde el backend
        setTimeout(() => {
            setCargando(false);
        }, 1000);
    }, []);

    // Datos estaticos simulados para los graficos
    const barChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Tesis Aprobadas',
                data: [12, 19, 15, 25, 22, 30],
                backgroundColor: getCssVariable('--color-violet-500'),
                hoverBackgroundColor: getCssVariable('--color-violet-600'),
                barPercentage: 0.66,
                categoryPercentage: 0.66,
            },
        ],
    };

    const doughnutChartData = {
        labels: ['Desarrollo de Software', 'IoT', 'Inteligencia Artificial'],
        datasets: [
            {
                label: 'Distribucion por Carrera',
                data: [45, 30, 25],
                backgroundColor: [
                    getCssVariable('--color-violet-500'),
                    getCssVariable('--color-sky-500'),
                    getCssVariable('--color-emerald-500'),
                ],
                hoverBackgroundColor: [
                    getCssVariable('--color-violet-600'),
                    getCssVariable('--color-sky-600'),
                    getCssVariable('--color-emerald-600'),
                ],
                borderWidth: 0,
            },
        ],
    };

    if (cargando) return <div className="text-center mt-10">Cargando dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Panel de Control de Direccion</h1>
                <p className="text-gray-500 mt-2">Vision general del sistema de recomendacion de tesis en la ESFOT.</p>
            </header>

            <div className="grid grid-cols-12 gap-6">
                
                {/* Tarjeta de Resumen 1 */}
                <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-200 dark:border-gray-700/60 p-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Total Solicitudes</h2>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">142</div>
                    <div className="text-sm text-emerald-500 font-medium mt-2">+12% desde el mes pasado</div>
                </div>

                {/* Tarjeta de Resumen 2 */}
                <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-200 dark:border-gray-700/60 p-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Afinidad Promedio IA</h2>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">89%</div>
                    <div className="text-sm text-gray-500 font-medium mt-2">Nivel de precision del algoritmo</div>
                </div>

                {/* Tarjeta de Resumen 3 */}
                <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-200 dark:border-gray-700/60 p-5">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Docentes Activos</h2>
                    <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">24</div>
                    <div className="text-sm text-gray-500 font-medium mt-2">Con cupos disponibles para tutoria</div>
                </div>

                {/* Grafico de Barras */}
                <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-200 dark:border-gray-700/60">
                    <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Tesis Aprobadas por Mes</h2>
                    </header>
                    <BarChart data={barChartData} width={595} height={248} />
                </div>

                {/* Grafico de Anillo */}
                <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-200 dark:border-gray-700/60">
                    <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
                        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Distribucion por Carrera</h2>
                    </header>
                    <DoughnutChart data={doughnutChartData} width={389} height={260} />
                </div>

            </div>
        </div>
    );
}

export default DashboardGeneral;