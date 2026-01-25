import { Moon, Sun } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
};

export default function Layout({ children, toggleTheme, isDarkMode }: LayoutProps) {
  return (
    <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? 'dark bg-[#1A1A2E]' : 'bg-gray-50'}`}>
      
      {/* Theme Toggle - Floating Button */}
      {toggleTheme && (
        <button
          onClick={toggleTheme}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-full shadow-lg hover:from-orange-600 hover:to-blue-700 transition-all z-50"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        {children}
      </main>
    </div>
  );
}
