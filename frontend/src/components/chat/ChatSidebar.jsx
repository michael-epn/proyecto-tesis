import { ChatSearch } from './ChatSearch';
import { Menu } from '@headlessui/react';

export const ChatSidebar = ({ contactos, chatActivo, onSelectChat, onOpenNewChat, onLimpiarHistorial, searchTerm, onSearch }) => (
    <div className="relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl md:rounded-l-2xl md:rounded-r-none overflow-hidden shadow-xl">
        <div className="bg-slate-800 px-6 py-[17px] border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Chat
            </h3>
            
            <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 outline-none overflow-hidden">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={onOpenNewChat}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors ${active ? 'bg-violet-50 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}
                            >
                                Nuevo Chat
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={onLimpiarHistorial}
                                className={`w-full text-left px-4 py-3 text-sm border-t border-slate-100 dark:border-slate-700 transition-colors ${active ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-red-600'}`}
                            >
                                Limpiar Historial
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>
        </div>
        
        <ChatSearch searchTerm={searchTerm} onSearch={onSearch} />

        <div className="flex-1 overflow-y-auto">
            {contactos.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm mt-4">
                    No tienes conversaciones activas. Haz clic en los tres puntos para iniciar un chat.
                </div>
            ) : (
                contactos.map((contacto) => (
                    <div 
                        key={contacto.id}
                        onClick={() => onSelectChat(contacto)}
                        className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-100 dark:border-slate-800/50 ${
                            chatActivo?.id === contacto.id 
                                ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-l-violet-600 dark:border-l-violet-500' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 dark:border-l-slate-900 dark:hover:border-l-slate-900/20 border-l-transparent'
                        }`}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex justify-center items-center">
                                {contacto.fotoPerfil ? <img src={contacto.fotoPerfil} className="w-full h-full object-cover" /> : <span className="font-bold dark:text-white">{contacto?.nombre.charAt(0)}{contacto.apellido?.charAt(0)}</span>}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${contacto.online ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{contacto.nombre} {contacto.apellido}</h4>
                            <p className="text-xs text-slate-500 truncate capitalize">{contacto.rol}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);