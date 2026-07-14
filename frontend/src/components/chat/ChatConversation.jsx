import { ChatMessage } from './ChatMessage';
import { useAuthStore } from '../../store/authStore';

export const ChatConversation = ({ messages, messagesEndRef, activeChannel, readState }) => {
    const { user } = useAuthStore();
    const getOtherUserLastRead = () => {
        if (!readState) return new Date(0);
        const otherUserId = Object.keys(readState).find(id => String(id) !== String(user?._id));
        if (otherUserId && readState[otherUserId]) {
            return new Date(readState[otherUserId].last_read);
        }
        return new Date(0);
    };

    const lastReadDate = getOtherUserLastRead();

    return (
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
            <div className="flex justify-center mb-6">
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs px-3 py-1 rounded-full font-medium">Hoy</span>
            </div>
            
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm font-medium">Envía un mensaje para iniciar la conversación</p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === String(user?._id);
                    const isRead = isOwnMessage && new Date(msg.timestamp) <= lastReadDate;

                    return (
                        <ChatMessage 
                            key={msg.id || index} 
                            msg={msg} 
                            isOwn={isOwnMessage}
                            isRead={isRead}
                        />
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};