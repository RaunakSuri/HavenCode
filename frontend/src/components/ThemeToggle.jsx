import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#263049] bg-[#171B27] hover:bg-[#262A36] text-[#DFE2F2] hover:text-[#5DE6FF] transition-all duration-200 active:scale-95 shadow-xs cursor-pointer ${className}`}
    >
      {theme === 'dark' ? (
        // Sun icon indicating clicking switches to light
        <svg
          className="w-4 h-4 text-amber-400 fill-none stroke-current stroke-2 transition-transform duration-300 hover:rotate-45"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon icon indicating clicking switches to dark
        <svg
          className="w-4 h-4 text-indigo-600 fill-none stroke-current stroke-2 transition-transform duration-300 hover:-rotate-12"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
