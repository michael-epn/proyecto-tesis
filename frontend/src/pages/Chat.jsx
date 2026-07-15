import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatConversation } from '../components/chat/ChatConversation';
import { ChatInput } from '../components/chat/ChatInput';
import { ModalNuevoChat } from '../components/chat/ModalNuevoChat';

const Chat = () => {
    const { user } = useAuthStore();
    const { 
        messages, joinRoom, sendMessage, messagesEndRef, 
        channels, presence, activeChannel, hideAllChannels, setActiveChannel,
        borrarChatLocal, isTyping, readState 
    } = useChat();
    
    const [chatActivoVisual, setChatActivoVisual] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleIniciarNuevoChat = (usuarioSeleccionado) => {
        setIsModalOpen(false); 
        joinRoom(usuarioSeleccionado._id);
        setChatActivoVisual({ 
            id: usuarioSeleccionado._id, 
            nombre: `${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellido || ''}`.trim(),
            rol: usuarioSeleccionado.rol,
            fotoPerfil: usuarioSeleccionado.fotoPerfil
        });
    };

    const handleSelectChat = (contacto) => {
        setChatActivoVisual(contacto);
        joinRoom(contacto.receptorId);
    };

    const handleLimpiarHistorial = () => {
        if(window.confirm("¿Estás seguro de limpiar tu panel? (Tus chats volverán a aparecer cuando envíes o recibas un mensaje nuevo)")) {
            hideAllChannels();
            setChatActivoVisual(null);
        }
    };

    const handleDeleteCurrentChat = () => {
        if(window.confirm("¿Deseas eliminar esta conversación de tu vista?")) {
            borrarChatLocal(activeChannel.id);
            setChatActivoVisual(null);
        }
    };

    const contactosMapeados = channels        
        .filter(channel => {
            if (channel?.state?.messages?.length > 0) return true;
            if (activeChannel && activeChannel.id === channel?.id) return true;
            return false;
        })
        .map(channel => {
            const members = Object.values(channel?.state?.members || {});
            const otherMember = members.find(m => m.user?.id !== String(user?._id))?.user || members[0]?.user;
            const messagesArray = channel?.state?.messages || [];
            const lastMessage = messagesArray[messagesArray.length - 1];
            const isOnline = presence[otherMember?.id] ?? otherMember?.online ?? false;

            return {
                id: channel?.id,
                receptorId: otherMember?.id,
                nombre: otherMember?.name || 'Usuario',
                rol: otherMember?.rol || 'Rol',
                fotoPerfil: otherMember?.image,
                online: isOnline, 
                unread: typeof channel?.countUnread === 'function' ? channel.countUnread() : 0,
                ultimoMensaje: lastMessage ? lastMessage.text : 'Conversación iniciada'
            };
        }).filter(contacto => 
            (contacto.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contacto.rol || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    const contactoBase = contactosMapeados.find(c => c.receptorId === chatActivoVisual?.id) || chatActivoVisual;
    const otherMember = activeChannel ? Object.values(activeChannel.state.members).find(m => m.user.id !== String(user?._id))?.user : null;

    const contactoSeleccionado = otherMember ? {
        ...contactoBase,
        online: presence[otherMember.id] ?? otherMember.online ?? false,
        fotoPerfil: otherMember?.image,
        rol: otherMember.rol || contactoBase?.rol
    } : contactoBase;

    return (
        <div className="w-full min-h-[calc(100vh-8rem)] relative">
            <div className="max-w-7xl mx-auto h-[800px] max-h-[85vh]">
                <div className="mb-4">
                    <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Mensajes</h2>
                    <p className="text-slate-500 mt-1 font-medium">Comunícate de forma instantánea con la comunidad.</p>
                </div>

                <div className="flex h-[calc(100%-4rem)] shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
                    
                    <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 md:border-r border-slate-200 dark:border-slate-700 ${activeChannel ? 'hidden md:block' : 'block'}`}>
                        <ChatSidebar 
                            contactos={contactosMapeados} 
                            chatActivo={contactoSeleccionado}
                            onSelectChat={handleSelectChat}
                            onOpenNewChat={() => setIsModalOpen(true)}
                            onLimpiarHistorial={handleLimpiarHistorial}
                            searchTerm={searchTerm}
                            onSearch={setSearchTerm}
                        />
                    </div>

                    <div className={`flex-1 flex-col h-full bg-white dark:bg-slate-900 ${activeChannel ? 'flex' : 'hidden md:flex'}`}>
                        {activeChannel && contactoSeleccionado ? (
                            <>
                                <ChatHeader 
                                    contacto={contactoSeleccionado} 
                                    onBack={() => setActiveChannel(null)} 
                                    isTyping={isTyping}
                                    onDeleteChat={handleDeleteCurrentChat}
                                />
                                <ChatConversation 
                                    messages={messages} 
                                    messagesEndRef={messagesEndRef} 
                                    activeChannel={activeChannel}
                                    readState={readState}
                                />
                                <ChatInput onSendMessage={sendMessage} activeChannel={activeChannel} />
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/50">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">Tus Mensajes</h3>
                                <p className="text-sm mt-2 text-slate-500">Selecciona o crea una nueva conversación para empezar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <ModalNuevoChat 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onStartChat={handleIniciarNuevoChat} 
            />
        </div>
    );
};

export default Chat;