import { useState, useEffect, useRef, useCallback } from 'react';
import { streamClient, useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

export const useChat = () => {
    const { user, isStreamConnected } = useAuthStore();
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [presence, setPresence] = useState({}); // ESTADO INDEPENDIENTE PARA ONLINE/OFFLINE
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [readState, setReadState] = useState({});
    
    const messagesEndRef = useRef(null);
    const isInitialized = useRef(false);

    // 1. INICIALIZACIÓN GLOBAL (Una sola vez)
    useEffect(() => {
        if (!isStreamConnected || !user?._id || isInitialized.current) return;

        const initChat = async () => {
            try {
                const filter = { type: 'messaging', members: { $in: [String(user._id)] } };
                const sort = [{ last_message_at: -1 }];
                const queriedChannels = await streamClient.queryChannels(filter, sort, {
                    watch: true, state: true, presence: true,
                });
                
                setChannels(queriedChannels);

                // Llenar estado inicial de presencia
                const initialPresence = {};
                queriedChannels.forEach(channel => {
                    Object.values(channel.state.members).forEach(member => {
                        if (member.user.id !== String(user._id)) {
                            initialPresence[member.user.id] = member.user.online;
                        }
                    });
                });
                setPresence(initialPresence);
                isInitialized.current = true;
            } catch (error) {
                console.error("Error al cargar canales:", error);
            }
        };

        initChat();

        // Actualizar solo el estado presence
        const updatePresence = (event) => {
            if (event.user?.id) {
                setPresence(prev => ({ ...prev, [event.user.id]: event.user.online }));
            }
        };

        // Reordenar sidebar en caso de un mensaje nuevo
        const handleStructureChange = (event) => {
            if (event.type === 'message.new' || event.type === 'notification.added_to_channel') {
                setChannels(prevChannels => {
                    const channelIndex = prevChannels.findIndex(c => c.cid === event.cid);
                    if (channelIndex > -1) {
                        const updated = [...prevChannels];
                        const [canalMovido] = updated.splice(channelIndex, 1);
                        return [canalMovido, ...updated]; // Lo subimos al top
                    }
                    if (event.channel) return [event.channel, ...prevChannels];
                    return prevChannels;
                });
            }
        };

        streamClient.on('user.presence.changed', updatePresence);
        streamClient.on('message.new', handleStructureChange);
        streamClient.on('notification.added_to_channel', handleStructureChange);

        return () => {
            streamClient.off('user.presence.changed', updatePresence);
            streamClient.off('message.new', handleStructureChange);
            streamClient.off('notification.added_to_channel', handleStructureChange);
        };
    }, [isStreamConnected, user?._id]);

    const scrollToBottom = () => {
        setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
    };

    const updateMessages = useCallback((channel) => {
        const formatted = channel.state.messages.map(m => ({
            id: m.id, message: m.text, senderId: m.user.id,
            senderName: m.user.name, senderImage: m.user.image, timestamp: m.created_at
        }));
        setMessages(formatted);
    }, []);

    // 2. EVENTOS ESPECÍFICOS DEL CANAL ACTIVO
    useEffect(() => {
        if (!activeChannel) return;

        updateMessages(activeChannel);
        activeChannel.markRead();
        if (activeChannel.state.read) setReadState({ ...activeChannel.state.read });

        const handleNewMessageActive = async () => {
            updateMessages(activeChannel);
            await activeChannel.markRead();
            scrollToBottom();
        };

        const handleRead = () => {
            if (activeChannel.state.read) setReadState({ ...activeChannel.state.read });
        };

        const startTyping = (e) => { if (e.user.id !== user._id) setIsTyping(true); };
        const stopTyping = () => setIsTyping(false);

        activeChannel.on('message.new', handleNewMessageActive);
        activeChannel.on('message.read', handleRead);
        activeChannel.on('typing.start', startTyping);
        activeChannel.on('typing.stop', stopTyping);

        return () => {
            activeChannel.off('message.new', handleNewMessageActive);
            activeChannel.off('message.read', handleRead);
            activeChannel.off('typing.start', startTyping);
            activeChannel.off('typing.stop', stopTyping);
        };
    }, [activeChannel, user?._id, updateMessages]);

    const joinRoom = useCallback(async (receptorId) => {
        if (!streamClient.userID || !receptorId) return;
        setLoading(true);
        try {
            const channel = streamClient.channel('messaging', { members: [String(user._id), String(receptorId)] });
            await channel.watch(); 
            await channel.show(); 
            
            setChannels(prev => prev.some(c => c.id === channel.id) ? prev : [channel, ...prev]);
            setActiveChannel(channel);
            await channel.markRead(); 
            scrollToBottom();
        } catch (error) {
            toast.error("Hubo un problema al abrir la conversación.");
            setActiveChannel(null); 
        } finally {
            setLoading(false);
        }
    }, [user]);

    const sendMessage = useCallback(async (text) => {
        if (activeChannel && text.trim()) await activeChannel.sendMessage({ text });
    }, [activeChannel]);

    const hideAllChannels = async () => {
        for (const channel of channels) await channel.hide({ clear_history: true });
        setChannels([]);
        setActiveChannel(null);
        setMessages([]);
    };

    const borrarChatLocal = async (channelId) => {
        const canal = channels.find(c => c.id === channelId);
        if (canal) {
            await canal.hide(null, true);
            canal.state.messages = [];
            canal.state.read = {};
            setChannels(prev => prev.filter(c => c.id !== channelId));
            if (activeChannel?.id === channelId) {
                setActiveChannel(null);
                setMessages([]);
            }
        }
    };

    return { 
        channels, messages, presence, activeChannel, // <- presencia exportada aquí
        loading, isTyping, readState, messagesEndRef,
        joinRoom, sendMessage, hideAllChannels, setActiveChannel, borrarChatLocal
    };
};