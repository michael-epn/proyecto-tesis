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
                    className={`relative w-full min-h-[46px] p-2 border rounded-xl shadow-sm cursor-pointer transition-all duration-200 bg-white flex flex-wrap gap-2 items-center ${open ? 'ring-1 ring-indigo-500 border-indigo-500' : 'border-slate-300'}`}
                >
                    {value.length > 0 ? (
                        value.map((option) => (
                            <div 
                                key={option.value} 
                                className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-sm px-3 py-1.5 rounded-lg shadow-sm"
                            >
                                <span>{option.label}</span>
                                <button
                                    type="button"
                                    onClick={(e) => removeOption(e, option.value)}
                                    className="hover:bg-indigo-200 p-1 rounded-md transition-colors text-indigo-500 hover:text-indigo-900"
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
                className="p-0 w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-slate-200 shadow-xl mt-2 bg-white"
                align="start"
                sideOffset={4}
            >
                <div className="sticky top-0 z-10 p-2 border-b border-slate-100 bg-white">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Buscar materia..."
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-0 focus:ring-indigo-500 transition-shadow"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="max-h-[250px] overflow-y-auto pb-2">
                    {opcionesFiltradas.length > 0 ? (
                        opcionesFiltradas.map((grupo, gIdx) => (
                            <div key={gIdx} className="mb-2 last:mb-0">
                                <div className="px-4 py-2.5 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-slate-50">
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
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors outline-none focus:bg-indigo-50 ${
                                                isSelected ? 'bg-indigo-50/50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                readOnly
                                                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 checked:bg-indigo-600 checked:border-indigo-600 cursor-pointer pointer-events-none"
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