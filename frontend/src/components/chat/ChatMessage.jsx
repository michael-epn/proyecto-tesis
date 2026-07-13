// Ya no necesitamos recibir 'contacto'
export const ChatMessage = ({ msg, isOwn }) => (
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
            <span className={`text-[10px] text-slate-400 mt-1 block ${isOwn ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
        </div>
    </div>
);