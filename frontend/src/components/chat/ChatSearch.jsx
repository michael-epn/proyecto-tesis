export const ChatSearch = ({ searchTerm, onSearch }) => (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-3 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
                type="text"
                value={searchTerm}
                placeholder="Buscar por nombre o rol..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-300 outline-none transition-shadow text-sm"
            />
        </div>
    </div>
);