import React, { useRef, useEffect } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import {
  Chart, DoughnutController, ArcElement, TimeScale, Tooltip, Legend
} from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(DoughnutController, ArcElement, TimeScale, Tooltip, Legend);

function DoughnutChart({ data, width, height }) {
  const canvas = useRef(null);
  const legend = useRef(null);
  // CORRECCIÓN CLAVE: Usar useRef en lugar de useState para la instancia del gráfico.
  // Esto previene errores de "ownerDocument" al desmontar el componente.
  const chartRef = useRef(null); 
  const { currentTheme } = useThemeProvider();

  useEffect(() => {
    // Si el elemento canvas aún no existe en el DOM, abortamos.
    if (!canvas.current) return;

    // Destrucción síncrona de la instancia previa si existe
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const newChart = new Chart(canvas.current, {
      type: 'doughnut',
      data: data,
      options: {
        cutout: '78%', 
        layout: {
          padding: 16,
        },
        plugins: {
          legend: {
            display: false, 
          },
          tooltip: {
            padding: 12,
            cornerRadius: 8,
            backgroundColor: '#1e293b', 
            titleColor: '#ffffff',      
            bodyColor: '#cbd5e1',       
            borderColor: '#334155',     
            borderWidth: 1,
            displayColors: true,
            boxPadding: 4,
            callbacks: {
              label: function(context) {
                const value = context.raw || 0;
                const total = context.chart._metasets[context.datasetIndex].total;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                return ` ${context.label}: ${value} solicitudes (${percentage})`;
              }
            }
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: {
          duration: 800, 
          easing: 'easeOutQuart', 
          animateScale: true, 
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
      plugins: [
        {
          id: 'htmlLegend',
          afterUpdate(c) {
            const ul = legend.current;
            if (!ul) return;
            
            while (ul.firstChild) {
              ul.firstChild.remove();
            }
            
            const generateLabels = c?.options?.plugins?.legend?.labels?.generateLabels || Chart.defaults.plugins.legend.labels.generateLabels;
            if (typeof generateLabels !== 'function') return;

            const items = generateLabels(c);
            
            items.forEach((item) => {
              const li = document.createElement('li');
              li.style.margin = '4px 6px';
              
              const button = document.createElement('button');
              button.className = 'flex items-center px-3 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-400 font-semibold text-xs rounded-full border border-slate-200 dark:border-slate-700 transition-colors duration-200 shadow-sm';
              button.style.opacity = item.hidden ? '.4' : '1';
              button.onclick = () => {
                c.toggleDataVisibility(item.index);
                c.update();
              };
              
              const box = document.createElement('span');
              box.style.display = 'block';
              box.style.width = '10px';
              box.style.height = '10px';
              box.style.backgroundColor = item.fillStyle;
              box.style.borderRadius = '50%';
              box.style.marginRight = '8px';
              box.style.pointerEvents = 'none';
              box.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
              
              const label = document.createElement('span');
              const labelText = document.createTextNode(item.text);
              
              label.appendChild(labelText);
              button.appendChild(box);
              button.appendChild(label);
              li.appendChild(button);
              ul.appendChild(li);
            });
          },
        },
      ],
    });
    
    // Guardamos la referencia inmediatamente de forma síncrona
    chartRef.current = newChart;
    
    // Función de limpieza estricta (aquí es donde el bug desaparece)
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]); 

  // Actualización del tema
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.update('none');
  }, [currentTheme]);

  return (
    <div className="grow flex flex-col justify-center h-full">
      <div className="relative flex justify-center items-center grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
      <div className="px-2 pt-4 pb-2">
        <ul ref={legend} className="flex flex-wrap justify-center gap-y-2"></ul>
      </div>
    </div>
  );
}

export default DoughnutChart;