import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';
import { streamClient } from '../layouts/DashboardLayout';
import { useAuthStore } from '../store/authStore';

function DropdownNotifications({ align }) {
  const { user, rol } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    const handleNewMessage = (event) => {
        if (event.message.user.id !== streamClient.userID) {
            setUnreadCount(prev => prev + 1);
            
            setRecentMessages(prev => [
                {
                    id: event.message.id,
                    sender: event.message.user.name,
                    text: event.message.text,
                    date: new Date(event.message.created_at).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' })
                },
                ...prev
            ].slice(0, 4));
        }
    };

    if (streamClient) {
        streamClient.on('message.new', handleNewMessage);
    }

    return () => {
        if (streamClient) {
            streamClient.off('message.new', handleNewMessage);
        }
    };
  }, []);

  const handleToggle = () => {
      setDropdownOpen(!dropdownOpen);
      if (!dropdownOpen) {
          setUnreadCount(0);
      }
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:bg-slate-800 lg:hover:bg-slate-200 dark:hover:bg-slate-700/50 dark:lg:hover:bg-slate-800 rounded-full ${dropdownOpen && 'bg-slate-200 dark:bg-slate-800'}`}
        aria-haspopup="true"
        onClick={handleToggle}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notificaciones</span>
        <svg
          className="fill-current text-slate-500 dark:text-slate-400/80 dark:text-slate-400/80"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 0a7 7 0 0 0-7 7c0 1.202.308 2.33.84 3.316l-.789 2.368a1 1 0 0 0 1.265 1.265l2.595-.865a1 1 0 0 0-.632-1.898l-.698.233.3-.9a1 1 0 0 0-.104-.85A4.97 4.97 0 0 1 2 7a5 5 0 0 1 5-5 4.99 4.99 0 0 1 4.093 2.135 1 1 0 1 0 1.638-1.148A6.99 6.99 0 0 0 7 0Z" />
          <path d="M11 6a5 5 0 0 0 0 10c.807 0 1.567-.194 2.24-.533l1.444.482a1 1 0 0 0 1.265-1.265l-.482-1.444A4.962 4.962 0 0 0 16 11a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0c0 .588-.171 1.134-.466 1.6a1 1 0 0 0-.115.82 1 1 0 0 0-.82.114A2.973 2.973 0 0 1 11 14a3 3 0 0 1-3-3Z" />
        </svg>
        {unreadCount > 0 && (
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
        )}
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown} onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)}>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-4">
            Mensajes Nuevos
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {recentMessages.length === 0 ? (
                <li className="py-4 px-4 text-center text-sm text-slate-500">
                    No tienes mensajes nuevos.
                </li>
            ) : (
                recentMessages.map((msg) => (
                    <li key={msg.id} className="border-b border-slate-200 dark:border-slate-700/60 last:border-0">
                        <Link
                            className="block py-2 px-4 hover:bg-slate-50 dark:hover:bg-slate-700/20"
                            to={`/${rol}/chat`}
                            onClick={() => setDropdownOpen(false)}
                        >
                            <span className="block text-sm mb-1">
                                💬 <span className="font-medium text-slate-800 dark:text-slate-100">{msg.sender}:</span> {msg.text.substring(0, 50)}{msg.text.length > 50 ? '...' : ''}
                            </span>
                            <span className="block text-xs font-medium text-slate-400">{msg.date}</span>
                        </Link>
                    </li>
                ))
            )}
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownNotifications;