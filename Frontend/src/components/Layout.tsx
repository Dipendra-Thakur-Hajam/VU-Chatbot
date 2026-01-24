import { useState } from "react";
import { MessageSquare, Menu, X, Settings, LogOut, Moon, Sun, Plus } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
  toggleTheme?: () => void;
  isDarkMode?: boolean;
};

export default function Layout({ children, toggleTheme, isDarkMode }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? 'dark bg-[#343541]' : 'bg-gray-50'}`}>
      
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative z-40 flex flex-col h-full w-[260px] bg-black text-gray-100 transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        {/* New Chat Button */}
        <div className="p-3">
          <button className="flex items-center gap-2 w-full px-3 py-3 border border-white/20 rounded-md hover:bg-white/10 transition-colors text-sm text-white">
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        {/* History List (Mock) */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="mb-4">
                <div className="text-xs text-gray-500 font-medium mb-2 px-3">Today</div>
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm truncate">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    Admission Requirements
                </button>
                 <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm truncate">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    BCA Course Fees
                </button>
            </div>
             <div className="mb-4">
                <div className="text-xs text-gray-500 font-medium mb-2 px-3">Previous 7 Days</div>
                <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm truncate">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    Hostel Facilities
                </button>
            </div>
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-white/20 p-3 space-y-1">
           {toggleTheme && (
            <button
                onClick={toggleTheme}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm"
            >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          )}

          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm">
            <Settings className="w-4 h-4" />
            Settings
          </button>
           <button className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-[#2A2B32] transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
        
         {/* Close Mobile Sidebar */}
        <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute top-2 right-[-40px] p-2 text-white bg-black/50 rounded-r"
        >
            <X className="w-6 h-6" />
        </button>

      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
