import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

const MultiSelectMaterias = ({ 
    value = [], 
    onChange, 
    options = [], 
    placeholder = "Selecciona tus materias..." 
}) => {
    const [open, setOpen] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const inputRef = useRef(null);

    const opcionesFiltradas = useMemo(() => {
        if (!busqueda) return options;
        const lowerBusqueda = busqueda.toLowerCase();
        
        return options.map(grupo => {
            const coincidencias = grupo.options.filter(op => 
                op.label.toLowerCase().includes(lowerBusqueda)
            );
            if (coincidencias.length > 0 || grupo.label.toLowerCase().includes(lowerBusqueda)) {
                return { ...grupo, options: coincidencias.length > 0 ? coincidencias : grupo.options };
            }
            return null;
        }).filter(Boolean);
    }, [options, busqueda]);

    const toggleOption = (option) => {
        const isSelected = value.some(v => v.value === option.value);
        if (isSelected) {
            onChange(value.filter(v => v.value !== option.value));
        } else {
            onChange([...value, option]);
        }
    };

    const removeOption = (e, optionValue) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(value.filter(v => v.value !== optionValue));
    };

    const handleKeyDown = (e, option) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOption(option);
        }
    };

    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 0);
        } else {
            setBusqueda("");
        }
    }, [open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div 
                    tabIndex={0}
                    className={`relative w-full min-h-[46px] p-2 border rounded-xl shadow-sm cursor-pointer bg-white dark:bg-slate-900 flex flex-wrap gap-2 items-center ${open ? 'ring-1 ring-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-700'}`}
                >
                    {value.length > 0 ? (
                        value.map((option) => (
                            <div 
                                key={option.value} 
                                className="flex items-center gap-2 bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-800 text-violet-600 dark:text-violet-400 font-semibold text-sm px-3 py-1.5 rounded-full shadow-sm"
                            >
                                <span>{option.label}</span>
                                <button
                                    type="button"
                                    onClick={(e) => removeOption(e, option.value)}
                                    className="hover:bg-violet-200 dark:hover:bg-violet-800 p-1 rounded-md transition-colors text-violet-500 dark:text-violet-400 hover:text-violet-900"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="text-slate-500 font-medium text-sm ml-2">{placeholder}</span>
                    )}
                </div>
            </PopoverTrigger>

            <PopoverContent 
                className="p-0 w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl mt-2 bg-white dark:bg-slate-900"
                align="start"
                sideOffset={4}
            >
                <div className="sticky top-0 z-10 p-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Buscar materia..."
                            className="w-full pl-9 pr-3 py-2 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-0 focus:ring-violet-500 transition-shadow"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="max-h-[250px] overflow-y-auto pb-2">
                    {opcionesFiltradas.length > 0 ? (
                        opcionesFiltradas.map((grupo, gIdx) => (
                            <div key={gIdx} className="mb-2 last:mb-0">
                                <div className="px-4 py-2.5 text-xs font-bold text-slate-400 dark:text-slate-200 uppercase tracking-wider sticky top-0 bg-white dark:bg-slate-900 z-10 border-b border-slate-50 dark:border-slate-800">
                                    {grupo.label}
                                </div>
                                {grupo.options.map((option) => {
                                    const isSelected = value.some(v => v.value === option.value);
                                    return (
                                        <div
                                            key={option.value}
                                            tabIndex={0}
                                            onClick={() => toggleOption(option)}
                                            onKeyDown={(e) => handleKeyDown(e, option)}
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors outline-none focus:bg-violet-50 dark:focus:bg-violet-900 ${
                                                isSelected ? 'bg-violet-50/50 dark:bg-violet-900/50 text-violet-700 dark:text-violet-400 font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                readOnly
                                                className="w-4 h-4 rounded text-violet-600 border-slate-300 focus:ring-violet-500 checked:bg-violet-600 checked:border-violet-600 cursor-pointer pointer-events-none"
                                            />
                                            <span>{option.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-sm text-slate-500 text-center font-medium">No se encontraron materias</div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default MultiSelectMaterias;