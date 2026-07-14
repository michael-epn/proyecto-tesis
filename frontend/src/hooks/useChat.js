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
                // SOLUCIÓN: Eliminamos hidden: { $ne: true }. Stream ya los oculta por defecto.
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

        activeChannel.on('message.new', handleNewMessage);
        return () => activeChannel.off('message.new', handleNewMessage);
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
        setActiveChannel 
    };
};