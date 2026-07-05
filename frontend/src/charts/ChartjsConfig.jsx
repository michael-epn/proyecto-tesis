import { Chart, Tooltip } from 'chart.js';
import { adjustColorOpacity, getCssVariable } from '../utils/Utils';

Chart.register(Tooltip);

Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = 500;
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 8;

export const chartAreaGradient = (ctx, chartArea, colorStops) => {
  if (!ctx || !chartArea || !colorStops || colorStops.length === 0) {
    return 'transparent';
  }
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  colorStops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });
  return gradient;
};

// Modificado para leer el color de forma dinámica según el tema activo en el DOM
const isDark = () => document.documentElement.classList.contains('dark');

export const getChartColors = () => ({
  textColor: isDark() ? getCssVariable('--color-slate-400') : getCssVariable('--color-slate-500'),
  gridColor: isDark() ? adjustColorOpacity(getCssVariable('--color-slate-700'), 0.6) : getCssVariable('--color-slate-100'),
  backdropColor: isDark() ? getCssVariable('--color-slate-800') : getCssVariable('--color-white'),
  tooltipTitleColor: isDark() ? getCssVariable('--color-slate-100') : getCssVariable('--color-slate-800'),
  tooltipBodyColor: isDark() ? getCssVariable('--color-slate-400') : getCssVariable('--color-slate-500'),
  tooltipBgColor: isDark() ? getCssVariable('--color-slate-700') : getCssVariable('--color-white'),
  tooltipBorderColor: isDark() ? getCssVariable('--color-slate-600') : getCssVariable('--color-slate-200'),
});