
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Settings, 
  Menu, 
  Bell,
  ClipboardCheck,
  Package,
  FileBarChart,
  ShieldCheck,
  LogOut,
  ListTodo
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'tracker', label: 'Tracking', icon: ClipboardCheck },
    { id: 'deliveries', label: 'Deliveries', icon: Package },
    { id: 'expenses', label: 'Expense Flow', icon: DollarSign },
    { id: 'tasks', label: 'Task Terminal', icon: ListTodo },
    { id: 'reports', label: 'Full Reports', icon: FileBarChart },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-900 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-emerald-500 bg-clip-text text-transparent uppercase tracking-tighter">
              CreatorFlow
            </h1>
            <div className="mt-2 flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded text-[8px] font-black uppercase tracking-widest">
                Admin Console
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all
                  ${activeTab === item.id 
                    ? 'bg-slate-900 text-cyan-400 shadow-xl shadow-cyan-900/10' 
                    : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-200'}
                `}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-cyan-400' : 'text-slate-600'} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-900 space-y-4">
             <div className="flex items-center space-x-3 text-slate-500 hover:text-slate-200 cursor-pointer transition-colors group">
               <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition-colors">
                  <ShieldCheck size={20} className="text-emerald-500" />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase text-slate-100 truncate">Administrator</p>
                  <p className="text-[8px] font-bold text-slate-600 truncate uppercase tracking-tighter">Level 4 Clearance</p>
               </div>
             </div>
             <button 
               onClick={onLogout}
               className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-rose-500/20"
             >
               <LogOut size={14} />
               <span>Log Out</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-900 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <button 
            className="lg:hidden text-slate-400 p-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 px-4 max-w-xl hidden md:block" />

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-slate-200 relative group">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:animate-ping"></span>
            </button>
            <div className="h-8 w-px bg-slate-900" />
            <div className="flex items-center space-x-3 pl-2">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-[10px] text-slate-400 shadow-lg">AD</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#020617]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
