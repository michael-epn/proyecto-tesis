import { useState, useEffect, useRef, useCallback } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuthStore } from '../store/authStore';

const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

export const useChat = () => {
    const { user } = useAuthStore();
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isStreamReady, setIsStreamReady] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [readState, setReadState] = useState({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const checkConnection = setInterval(() => {
            if (client.userID) {
                setIsStreamReady(true);
                clearInterval(checkConnection);
            }
        }, 500);
        return () => clearInterval(checkConnection);
    }, []);

    useEffect(() => {
        if (!isStreamReady || !user?._id) return;
        const fetchChannels = async () => {
            try {
                const filter = { type: 'messaging', members: { $in: [String(user._id)] } };
                const sort = [{ last_message_at: -1 }];
                const queriedChannels = await client.queryChannels(filter, sort, {
                    watch: true,
                    state: true,
                    presence: true,
                });
                
                setChannels(queriedChannels);
            } catch (error) {
                console.error("Error al cargar canales de Stream:", error);
            }
        };
        fetchChannels();
        const handleEvent = () => fetchChannels();
        client.on('message.new', handleEvent);
        client.on('notification.added_to_channel', handleEvent);
        client.on('user.updated', handleEvent);
        client.on('user.presence.changed', handleEvent);
        return () => {
            client.off('message.new', handleEvent);
            client.off('notification.added_to_channel', handleEvent);
            client.off('user.updated', handleEvent);
            client.off('user.presence.changed', handleEvent);
        };
    }, [isStreamReady, user?._id]);

    const updateMessages = (channel) => {
        const formatted = channel.state.messages.map(m => ({
            id: m.id,
            message: m.text,
            senderId: m.user.id,
            senderName: m.user.name,
            senderImage: m.user.image,
            timestamp: m.created_at
        }));
        setMessages(formatted);
    };

    useEffect(() => {
        if (!activeChannel) return;
        const startTyping = (evento) => {
            if (evento.user.id !== user._id) setIsTyping(true);
        };
        const stopTyping = () => setIsTyping(false);
        activeChannel.on('typing.start', startTyping);
        activeChannel.on('typing.stop', stopTyping);
        return () => {
            activeChannel.off('typing.start', startTyping);
            activeChannel.off('typing.stop', stopTyping);
        };
    }, [activeChannel]);

    const joinRoom = useCallback(async (receptorId) => {
        if (!client.userID || !receptorId) return;
        
        setLoading(true);
        try {
            const channel = client.channel('messaging', {
                members: [String(user._id), String(receptorId)],
            });
            await channel.watch(); 
            await channel.show();
            setChannels(prevChannels => {
                const canalYaExiste = prevChannels.some(c => c.id === channel.id);
                if (!canalYaExiste) {
                    return [channel, ...prevChannels];
                }
                return prevChannels;
            });
            setActiveChannel(channel);
            updateMessages(channel);
            await channel.markRead(); 
            scrollToBottom();
        } catch (error) {
            console.error("Error al iniciar chat:", error);
            if (error.message?.includes("don't exist")) {
                toast.warning("Este usuario aún no ha activado su bandeja de mensajes.");
            } else {
                toast.error("Hubo un problema al intentar abrir la conversación.");
            }
            setActiveChannel(null); 
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!activeChannel) return;
        const handleNewMessage = async () => {
            updateMessages(activeChannel);
            await activeChannel.markRead();
            scrollToBottom();
        };
        const handleRead = () => {
            if (activeChannel.state.read) {
                setReadState({ ...activeChannel.state.read });
            }
        };

        activeChannel.on('message.new', handleNewMessage);
        activeChannel.on('message.read', handleRead);
        return () => {
            activeChannel.off('message.new', handleNewMessage);
            activeChannel.off('message.read', handleRead);
        };
    }, [activeChannel]);

    const sendMessage = useCallback(async (text) => {
        if (activeChannel && text.trim()) {
            try {
                await activeChannel.sendMessage({ text });
            } catch (error) {
                console.error("Error al enviar mensaje:", error);
            }
        }
    }, [activeChannel]);

    const hideAllChannels = async () => {
        for (const channel of channels) {
            await channel.hide({ clear_history: true });
        }
        setChannels([]);
        setActiveChannel(null);
        setMessages([]);
    };

    const borrarChatLocal = async (channelId) => {
        const canal = channels.find(c => c.id === channelId);
        if (canal) {
            try {
                await canal.hide(null, true);
                canal.state.messages = [];
                canal.state.read = {};
                setChannels(prev => prev.filter(c => c.id !== channelId));
                if (activeChannel?.id === channelId) {
                    setActiveChannel(null);
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error al limpiar el chat:", error);
            }
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return { 
        channels,
        messages, 
        joinRoom, 
        sendMessage, 
        messagesEndRef, 
        activeChannel, 
        hideAllChannels,
        loading, 
        setActiveChannel,
        borrarChatLocal,
        isTyping,
        readState
    };
};