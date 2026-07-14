export const ChatMessage = ({ msg, isOwn, isRead }) => (
    <div className={`flex w-full mt-4 space-x-3 max-w-md ${isOwn ? 'ml-auto justify-end' : ''}`}>
        
        {!isOwn && (
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 overflow-hidden">
                {msg.senderImage ? (
                    <img src={msg.senderImage} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                    <span className="font-bold text-slate-500 dark:text-slate-300">
                        {msg.senderName?.charAt(0) || 'U'}
                    </span>
                )}
            </div>
        )}
        
        <div>
            <div className={`p-3 rounded-2xl shadow-sm ${
                isOwn 
                    ? 'bg-violet-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-none'
            }`}>
                <p className="text-sm">{msg.message}</p>
            </div>
            
            <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                
                {isOwn && (
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-3 w-3 ${isRead ? 'text-blue-500' : 'text-slate-400'}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        {isRead ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /> // (Puedes cambiar este SVG por un check doble real si tienes librerías de iconos como lucide-react o heroicons. Abajo uso un check doble dibujado)
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        )}
                    </svg>
                )}
            </div>
        </div>
    </div>
);