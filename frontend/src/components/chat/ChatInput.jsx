import { useState } from 'react';

export const ChatInput = ({ onSendMessage, activeChannel }) => {
    const [mensaje, setMensaje] = useState("");
    const handleChange = (e) => {
        setMensaje(e.target.value);
        if (activeChannel) {
            activeChannel.keystroke(); 
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(mensaje.trim()) {
            onSendMessage(mensaje);
            setMensaje("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
            <div className="flex gap-2 items-center">
                <input 
                    type="text" 
                    value={mensaje}
                    onChange={handleChange}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-300 transition-shadow text-sm"
                />
                <button type="submit" disabled={!mensaje.trim()} className="bg-violet-600 text-white p-3 rounded-xl hover:bg-violet-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </div>
        </form>
    );
};