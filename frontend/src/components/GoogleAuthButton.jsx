import { FcGoogle } from 'react-icons/fc';
import { VscLoading } from 'react-icons/vsc';

const GoogleAuthButton = ({ isLoading, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
            {isLoading ? (
                <VscLoading className="animate-spin text-xl text-slate-500" />
            ) : (
                <FcGoogle className="text-xl" />
            )}
            <span>{isLoading ? 'Conectando...' : 'Continuar con Google'}</span>
        </button>
    );
};

export default GoogleAuthButton;