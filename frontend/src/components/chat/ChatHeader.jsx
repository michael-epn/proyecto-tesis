export const ChatHeader = ({ contacto, onBack, isTyping, onDeleteChat }) => (
    <div className="bg-slate-800 px-4 md:px-6 py-4 border-b border-slate-700 rounded-t-2xl md:rounded-tl-none md:rounded-tr-2xl flex justify-between items-center">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="md:hidden text-slate-300 hover:text-white transition-colors relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-600 overflow-hidden flex justify-center items-center">
                    {contacto.fotoPerfil ? <img src={contacto.fotoPerfil} alt="Avatar" className="w-full h-full object-cover"/> : <span className="text-white font-bold">{contacto?.nombre.charAt(0)}{contacto.apellido?.charAt(0)}</span>}
                </div>
            </div>
            <div>
                <h3 className="text-base font-bold text-white">{contacto.nombre} {contacto.apellido}</h3>
                <p className={`text-xs font-medium flex items-center gap-1 ${isTyping ? 'text-green-400' : 'text-violet-300'}`}>
                    {isTyping ? (
                        <span className="italic animate-pulse">Escribiendo...</span>
                    ) : (
                        <>
                            <span className={`w-2 h-2 rounded-full ${contacto.online ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                            {contacto.online ? 'En línea' : 'Desconectado'}
                        </>
                    )}
                </p>
            </div>
        </div>
        
        <button 
            onClick={onDeleteChat}
            title="Eliminar chat"
            className="text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-slate-700 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
);