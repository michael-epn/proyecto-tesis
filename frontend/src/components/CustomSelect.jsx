import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

const CustomSelect = ({ 
    value, 
    onChange, 
    options = [], 
    placeholder = "Selecciona una opción...",
    error = false
}) => {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find(op => op.value === value);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={`relative w-full min-h-[46px] px-4 py-2.5 border rounded-xl shadow-sm bg-white dark:bg-slate-900 flex items-center justify-between outline-none text-sm
                        ${open ? 'ring-2 ring-violet-500 border-violet-500' : ''} 
                        ${error ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'}
                    `}
                >
                    <span className={`truncate ${selectedOption ? 'text-slate-900 dark:text-slate-100 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="currentColor" 
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-violet-500' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </PopoverTrigger>

            <PopoverContent 
                className="p-1 w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl mt-1.5 bg-white dark:bg-slate-900"
                align="start"
                sideOffset={4}
            >
                <div className="max-h-[250px] overflow-y-auto">
                    {options.length > 0 ? (
                        options.map((option) => {
                            const isSelected = value === option.value;
                            const isDisabled = option.disabled;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors outline-none text-left
                                        ${isDisabled 
                                            ? 'bg-slate-50 dark:bg-slate-900 cursor-not-allowed opacity-60 text-slate-500' // Estilo si está deshabilitado
                                            : isSelected 
                                                ? 'bg-violet-50 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 font-semibold rounded-lg' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg'
                                        }
                                    `}
                                >
                                    <span className="truncate">{option.label}</span>
                                    <div className="flex items-center gap-2">
                                        {option.helperText && (
                                            <span className={`text-xs font-medium ${option.helperColor || 'text-slate-500'}`}>
                                                • {option.helperText}
                                            </span>
                                        )}
                                        {isSelected && !isDisabled && (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-violet-600 dark:text-violet-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-4 text-sm text-slate-500 text-center font-medium">No hay opciones disponibles</div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default CustomSelect;