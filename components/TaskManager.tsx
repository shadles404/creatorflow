
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Search, 
  X, 
  Calendar, 
  LayoutList,
  CheckSquare,
  Square,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { Task } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, setTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { 
        ...t, 
        title: formData.title, 
        dueDate: formData.dueDate, 
        priority: formData.priority 
      } : t));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        dueDate: formData.dueDate,
        status: 'Not Done',
        priority: formData.priority
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsModalOpen(false);
    setFormData({ title: '', dueDate: new Date().toISOString().split('T')[0], priority: 'Medium' });
  };

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Done' ? 'Not Done' : 'Done' } : t
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this operational task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority
    });
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    pending: tasks.filter(t => t.status === 'Not Done').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter">Task Terminal</h2>
          <p className="text-slate-400 text-sm font-medium">Global operational workflow & milestone tracking</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-cyan-900/40"
        >
          <Plus size={16} />
          <span>New Mission</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-lg flex items-center justify-between">
           <div>
             <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Total Directive</div>
             <div className="text-3xl font-black text-slate-100">{stats.total}</div>
           </div>
           <LayoutList className="text-slate-700" size={32} />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-lg flex items-center justify-between">
           <div>
             <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Completed</div>
             <div className="text-3xl font-black text-emerald-500">{stats.done}</div>
           </div>
           <CheckCircle2 className="text-emerald-500/20" size={32} />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] shadow-lg flex items-center justify-between">
           <div>
             <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">In Queue</div>
             <div className="text-3xl font-black text-amber-500">{stats.pending}</div>
           </div>
           <Clock className="text-amber-500/20" size={32} />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 bg-slate-800/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <h3 className="font-black text-slate-100 uppercase tracking-tighter text-xl">Operation Registry</h3>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-2.5 text-slate-500" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Locate mission by title..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-slate-500 uppercase tracking-widest font-black bg-slate-950/50 border-b border-slate-800">
              <tr>
                <th className="px-8 py-6 w-12 text-center">Status</th>
                <th className="px-8 py-6">Mission Title</th>
                <th className="px-8 py-6">Due Date</th>
                <th className="px-8 py-6">Priority</th>
                <th className="px-8 py-6 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-600 font-bold italic uppercase tracking-widest">Zero active missions in registry.</td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={() => handleToggleStatus(task.id)}
                        className={`transition-all hover:scale-110 ${task.status === 'Done' ? 'text-emerald-500' : 'text-slate-700 hover:text-cyan-400'}`}
                      >
                        {task.status === 'Done' ? <CheckSquare size={22} /> : <Square size={22} />}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`font-bold transition-all ${task.status === 'Done' ? 'text-slate-600 line-through' : 'text-slate-100'}`}>
                        {task.title}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                         <Calendar size={14} className="mr-2 text-cyan-400 opacity-50" />
                         {task.dueDate}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        task.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openEditModal(task)}
                          className="p-2 text-slate-600 hover:text-cyan-400 transition-colors rounded-lg hover:bg-cyan-400/10"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="p-2 text-slate-600 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-3xl font-black text-slate-50 uppercase tracking-tighter">
                {editingTask ? 'Edit Directive' : 'New Directive'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Directive Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Sign contracts with @creatorX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 font-bold focus:border-cyan-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Target Date</label>
                  <input 
                    required
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-slate-200 text-xs focus:border-cyan-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Priority</label>
                  <select 
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-slate-200 text-xs focus:border-cyan-500 outline-none appearance-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cyan-900/40 transition-all transform hover:-translate-y-1"
                >
                  {editingTask ? 'Update Data' : 'Initialize Mission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
