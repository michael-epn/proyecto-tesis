import { useState, useEffect, useRef, useCallback } from 'react';
import { streamClient, useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

export const useChat = () => {
    const { user, isStreamConnected } = useAuthStore();
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [presence, setPresence] = useState({}); // Mapa inmutable O(1)
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [readState, setReadState] = useState({});
    
    const messagesEndRef = useRef(null);
    const isInitialized = useRef(false);

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
                console.error("Error en queryChannels:", error);
            }
        };

        initChat();

        const updatePresence = (e) => {
            if (e.user?.id) setPresence(prev => ({ ...prev, [e.user.id]: e.user.online }));
        };

        const handleStructureChange = (e) => {
            if (e.type === 'message.new' || e.type === 'notification.added_to_channel') {
                setChannels(prevChannels => {
                    const idx = prevChannels.findIndex(c => c.cid === e.cid);
                    if (idx > -1) {
                        const updated = [...prevChannels];
                        const [moved] = updated.splice(idx, 1);
                        return [moved, ...updated];
                    }
                    if (e.channel) return [e.channel, ...prevChannels];
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
            
            setChannels(prev => prev.some(c => c.id === channel.id) ? prev : [channel, ...prev]);
            setActiveChannel(channel);
            await channel.markRead(); 
            scrollToBottom();
        } catch (error) {
            toast.error("Error al abrir conversación.");
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
            setChannels(prev => prev.filter(c => c.id !== channelId));
            if (activeChannel?.id === channelId) {
                setActiveChannel(null);
                setMessages([]);
            }
        }
    };

    return { 
        channels, messages, presence, activeChannel,
        loading, isTyping, readState, messagesEndRef,
        joinRoom, sendMessage, hideAllChannels, setActiveChannel, borrarChatLocal
    };
};