
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  FileText, 
  Edit3, 
  X, 
  DollarSign, 
  Calendar, 
  ChevronRight,
  PlusCircle,
  CreditCard,
  Printer,
  Share2,
  Tag,
  Image as ImageIcon,
  BookOpen,
  Settings2,
  ListFilter
} from 'lucide-react';
import { Project, ExpenseItem } from '../types';

interface ExpenseFlowProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const ExpenseFlow: React.FC<ExpenseFlowProps> = ({ projects, setProjects, categories, setCategories }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectBudget, setNewProjectBudget] = useState('0');
  const [paymentAmount, setPaymentAmount] = useState('0');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Invoice States
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    clientName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    discountAmount: '0',
    logoUrl: 'https://cdn-icons-png.flaticon.com/512/1177/1177568.png',
    paymentTerms: 'Please pay within 30 days. Payment can be made via wire transfer to Account #123456789.'
  });

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId), 
    [projects, selectedProjectId]
  );

  useEffect(() => {
    if (selectedProject && isInvoiceModalOpen) {
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: prev.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        dueDate: prev.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
    }
  }, [isInvoiceModalOpen, selectedProject]);

  const handleCreateProject = () => {
    if (!newProjectTitle.trim()) return;
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProjectTitle,
      budget: parseFloat(newProjectBudget) || 0,
      paidAmount: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Unpaid',
      expenses: []
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setIsModalOpen(false);
    setNewProjectTitle('');
    setNewProjectBudget('0');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert('Category already exists');
      return;
    }
    setCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (catToDelete === 'Other') return; 
    setCategories(categories.filter(c => c !== catToDelete));
  };

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount) || 0;
    if (amount <= 0 || !selectedProjectId) return;

    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        const currentTotal = p.expenses.reduce((sum, item) => sum + (item.qty * item.price), 0);
        const newPaidAmount = p.paidAmount + amount;
        return {
          ...p,
          paidAmount: newPaidAmount,
          status: newPaidAmount >= currentTotal ? 'Paid' : 'Unpaid'
        };
      }
      return p;
    }));
    setIsPaymentModalOpen(false);
    setPaymentAmount('0');
  };

  const addExpenseItem = (projectId: string) => {
    const newItem: ExpenseItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      category: 'Other',
      qty: 1,
      price: 0
    };
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, expenses: [...p.expenses, newItem] } : p
    ));
  };

  const updateExpenseItem = (projectId: string, itemId: string, updates: Partial<ExpenseItem>) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? {
        ...p,
        expenses: p.expenses.map(item => item.id === itemId ? { ...item, ...updates } : item)
      } : p
    ));
  };

  const deleteExpenseItem = (projectId: string, itemId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId ? {
        ...p,
        expenses: p.expenses.filter(item => item.id !== itemId)
      } : p
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) setSelectedProjectId(null);
  };

  const totalCost = selectedProject?.expenses.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0;
  const balance = totalCost - (selectedProject?.paidAmount || 0);
  const percentUsed = selectedProject?.budget ? (totalCost / selectedProject.budget) * 100 : 0;
  
  const grandTotal = useMemo(() => {
    const discount = parseFloat(invoiceData.discountAmount) || 0;
    return Math.max(0, totalCost - discount);
  }, [totalCost, invoiceData.discountAmount]);

  const handlePrint = () => { window.print(); };

  const handleShare = async () => {
    const shareText = `Invoice ${invoiceData.invoiceNumber} for ${selectedProject?.title}\nTotal: $${grandTotal.toLocaleString()}`;
    if (navigator.share) {
      try { await navigator.share({ title: `Invoice ${invoiceData.invoiceNumber}`, text: shareText, url: window.location.href }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Invoice details copied to clipboard.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-50 uppercase">Financial Expense Flow</h2>
          <p className="text-slate-400 text-sm font-medium">Real-time budget tracking & professional invoicing system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-5 py-3 rounded-2xl font-black uppercase text-[10px] transition-all border border-slate-800 shadow-xl"
          >
            <Settings2 size={16} className="text-cyan-400" />
            <span>Manage Categories</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] transition-all shadow-xl shadow-emerald-900/40"
          >
            <PlusCircle size={16} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {!selectedProjectId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-500 bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[40px] animate-in fade-in duration-500">
              <PlusCircle size={64} className="mb-6 opacity-10 text-emerald-500" />
              <p className="font-bold text-lg">No active expense projects.</p>
              <p className="text-sm opacity-50">Create your first project to start tracking line items.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs"
              >
                Get Started
              </button>
            </div>
          ) : (
            projects.map(project => {
              const projectTotal = project.expenses.reduce((sum, item) => sum + (item.qty * item.price), 0);
              return (
                <button 
                  key={project.id}
                  onClick={() => setSelectedProjectId(project.id)}
                  className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-left hover:border-emerald-500/50 transition-all group relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <ChevronRight size={24} className="text-emerald-500" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{project.status}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-100 mb-2 tracking-tighter group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                  <p className="text-[10px] text-slate-500 mb-6 tracking-widest uppercase font-black opacity-60">Created {project.createdAt}</p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-black text-slate-100">${projectTotal.toLocaleString()}</div>
                      <div className="text-xs font-bold text-slate-500">of ${project.budget.toLocaleString()}</div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ${projectTotal > project.budget ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min((projectTotal / project.budget) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedProjectId(null)}
              className="text-slate-400 hover:text-slate-100 flex items-center text-xs font-black uppercase tracking-widest transition-all hover:-translate-x-1"
            >
              <ChevronRight size={14} className="rotate-180 mr-2" /> Project Index
            </button>
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-[10px] font-black text-slate-500 hover:text-cyan-400 uppercase tracking-widest flex items-center transition-colors"
            >
              <ListFilter size={14} className="mr-2" /> Configure Categories
            </button>
          </div>

          {/* Project View Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
              <div>
                <h1 className="text-4xl font-black text-slate-50 mb-3 tracking-tighter uppercase">{selectedProject?.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Calendar size={14} className="mr-2 text-cyan-500" /> {selectedProject?.createdAt}
                  </span>
                  <span className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <DollarSign size={14} className="mr-1 text-emerald-500" /> Budget: ${selectedProject?.budget.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase transition-all shadow-xl shadow-emerald-900/40"
                >
                  <CreditCard size={14} className="mr-2" /> Record Payment
                </button>
                <button 
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-2xl text-[10px] font-black uppercase transition-all"
                >
                  <FileText size={14} className="mr-2 text-cyan-400" /> Build Invoice
                </button>
                <button 
                  onClick={() => deleteProject(selectedProject!.id)}
                  className="flex items-center px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase transition-all border border-rose-500/20"
                >
                  <Trash2 size={14} className="mr-2" /> Terminate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-[32px] shadow-inner">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Execution Progress</h4>
                <div className="flex items-end justify-between mb-4">
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-slate-100">${totalCost.toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Actual Expenses Reported</div>
                  </div>
                  <div className={`text-2xl font-black ${percentUsed > 100 ? 'text-rose-500' : 'text-emerald-400'}`}>{percentUsed.toFixed(1)}%</div>
                </div>
                <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full transition-all duration-1000 ${percentUsed > 100 ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`} style={{ width: `${Math.min(percentUsed, 100)}%` }} />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-8 rounded-[32px] shadow-inner">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Finance Liquidity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-900">
                    <span className="text-slate-500 text-[10px] font-black uppercase">Total Accrued</span>
                    <span className="text-slate-100 font-bold">${totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-900">
                    <span className="text-slate-500 text-[10px] font-black uppercase">Cleared Payments</span>
                    <span className="text-emerald-500 font-bold">${(selectedProject?.paidAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-slate-100 font-black text-[10px] uppercase tracking-widest">Net Payable</span>
                    <span className={`text-2xl font-black ${balance > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>${Math.max(0, balance).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-700">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-800/10">
               <h3 className="text-xl font-black text-slate-100 tracking-tighter uppercase">Project Breakdown</h3>
               <button 
                onClick={() => addExpenseItem(selectedProject!.id)} 
                className="px-6 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 flex items-center"
               >
                 <Plus size={16} className="mr-2" /> Insert Line Item
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] text-slate-500 uppercase tracking-widest font-black border-b border-slate-800 bg-slate-950/40">
                  <tr>
                    <th className="px-8 py-6">Detailed Description</th>
                    <th className="px-8 py-6 w-48">Expense Cohort</th>
                    <th className="px-8 py-6 w-24 text-center">Qty</th>
                    <th className="px-8 py-6 w-32">Unit Rate</th>
                    <th className="px-8 py-6 w-32">Amount</th>
                    <th className="px-8 py-6 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {selectedProject?.expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/10 transition-colors group/row">
                      <td className="px-8 py-5">
                        <input 
                          value={item.description}
                          onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { description: e.target.value })}
                          placeholder="Line item description (e.g. Creator Fee, Production Cost)"
                          className="bg-transparent border-none focus:ring-0 w-full p-0 text-slate-200 placeholder:text-slate-800 font-bold text-sm"
                        />
                      </td>
                      <td className="px-8 py-5">
                        <select 
                          value={item.category} 
                          onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { category: e.target.value })} 
                          className="bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase px-3 py-2 outline-none text-slate-400 w-full focus:border-cyan-500 transition-all cursor-pointer"
                        >
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className="px-8 py-5">
                        <input type="number" value={item.qty} onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { qty: parseInt(e.target.value) || 0 })} className="bg-slate-950/40 border-none rounded-lg text-center w-16 py-1 focus:ring-1 focus:ring-cyan-500 text-slate-200 font-black" />
                      </td>
                      <td className="px-8 py-5">
                        <div className="relative">
                          <span className="absolute left-0 top-1.5 text-slate-600 text-[10px]">$</span>
                          <input type="number" value={item.price} onChange={(e) => updateExpenseItem(selectedProject!.id, item.id, { price: parseFloat(e.target.value) || 0 })} className="bg-transparent border-none focus:ring-0 w-full pl-3 p-0 text-slate-200 font-bold" />
                        </div>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-100">
                        ${(item.qty * item.price).toLocaleString()}
                      </td>
                      <td className="px-8 py-5">
                        <button onClick={() => deleteExpenseItem(selectedProject!.id, item.id)} className="text-slate-700 hover:text-rose-500 p-2 rounded-xl transition-all hover:bg-rose-500/10 opacity-0 group-row-hover:opacity-100"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {selectedProject?.expenses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center text-slate-600 font-bold italic">No line items recorded for this project yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-12 bg-slate-950/50 border-t border-slate-800 text-right">
              <div className="text-[10px] text-slate-600 uppercase tracking-widest font-black mb-2">Total Project Liquidity Requirement</div>
              <div className="text-5xl font-black text-slate-50 tracking-tighter">${totalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Modals (Invoice, Payment, Categories) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-50 tracking-tighter uppercase flex items-center"><Settings2 className="mr-3 text-cyan-400" size={24} /> Cohort Management</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddCategory} className="mb-8">
              <label className="text-[10px] font-black text-slate-600 uppercase mb-3 block tracking-widest">Create New Cohort</label>
              <div className="flex space-x-2">
                <input autoFocus value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Travel, Tech, Gear..." className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all" />
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 rounded-2xl transition-all shadow-lg shadow-cyan-900/20"><Plus size={24} /></button>
              </div>
            </form>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Active Expense Cohorts</label>
              {categories.map((cat) => (
                <div key={cat} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-2xl group transition-all hover:bg-slate-950 hover:border-slate-700">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}</span>
                  {cat !== 'Other' && (
                    <button 
                      onClick={() => handleDeleteCategory(cat)} 
                      className="text-slate-700 hover:text-rose-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800">
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-full py-4 bg-slate-800 text-slate-300 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsInvoiceModalOpen(false)} />
          <div id="invoice-print-area" className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row min-h-[700px] my-auto overflow-hidden">
            <div className="w-full md:w-1/3 p-10 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col space-y-8 invoice-inputs bg-slate-900/50">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-50 uppercase tracking-tighter">Invoice Engine</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Configure document branding</p>
              </div>
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase flex items-center tracking-widest"><ImageIcon size={12} className="mr-2 text-cyan-400" /> Organization Logo URL</label>
                  <input value={invoiceData.logoUrl} onChange={(e) => setInvoiceData({...invoiceData, logoUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Client Identity</label>
                  <input placeholder="Client or Business Name" value={invoiceData.clientName} onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Payment Instructions</label>
                  <textarea rows={5} value={invoiceData.paymentTerms} onChange={(e) => setInvoiceData({...invoiceData, paymentTerms: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 custom-scrollbar" />
                </div>
              </div>
              <div className="space-y-3 invoice-actions">
                <button onClick={handlePrint} className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center hover:bg-slate-200"><Printer size={18} className="mr-2" /> Print / Save PDF</button>
                <button onClick={handleShare} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center shadow-lg shadow-cyan-900/40"><Share2 size={18} className="mr-2" /> Distribute Link</button>
              </div>
            </div>

            <div className="w-full md:w-2/3 p-16 bg-white text-slate-900 flex flex-col summary-card">
              <div className="flex justify-between items-start mb-20">
                <div>
                  <div className="h-20 w-auto mb-8 flex items-center">
                    <img src={invoiceData.logoUrl} alt="Organization Logo" className="h-full w-auto object-contain transition-all duration-700 hover:scale-105" />
                  </div>
                  <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-950 leading-none">Invoice</h2>
                  <p className="text-sm font-black text-slate-400 mt-4 tracking-widest">{invoiceData.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Recipient</p>
                  <h4 className="text-3xl font-black text-slate-950 tracking-tighter">{invoiceData.clientName || 'General Client'}</h4>
                  <p className="text-xs text-slate-500 max-w-[250px] ml-auto font-bold mt-2 uppercase tracking-tight">Project: {selectedProject?.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-16 py-10 border-y-4 border-slate-950">
                <div><p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Origination Date</p><p className="text-lg font-black text-slate-950">{invoiceData.invoiceDate}</p></div>
                <div><p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Liquidation Deadline</p><p className="text-lg font-black text-slate-950">{invoiceData.dueDate}</p></div>
              </div>

              <div className="flex-1">
                <table className="w-full text-left text-sm">
                  <thead className="border-b-[6px] border-slate-950">
                    <tr>
                      <th className="py-5 font-black text-slate-950 uppercase text-[10px] tracking-widest">Line Item Description</th>
                      <th className="py-5 font-black text-slate-950 uppercase text-[10px] tracking-widest text-center">Qty</th>
                      <th className="py-5 font-black text-slate-950 uppercase text-[10px] tracking-widest text-right">Unit Rate</th>
                      <th className="py-5 font-black text-slate-950 uppercase text-[10px] tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedProject?.expenses.map((item) => (
                      <tr key={item.id}>
                        <td className="py-6">
                          <p className="font-black text-slate-950 text-base">{item.description || 'Campaign Expense'}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{item.category}</p>
                        </td>
                        <td className="py-6 text-center font-black text-slate-600">{item.qty}</td>
                        <td className="py-6 text-right font-black text-slate-600">${item.price.toLocaleString()}</td>
                        <td className="py-6 text-right font-black text-slate-950 text-base">${(item.qty * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-16 pt-12 border-t-[6px] border-slate-950 flex flex-col sm:flex-row justify-between items-end sm:items-start gap-12">
                <div className="max-w-[350px] w-full">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 flex items-center tracking-widest"><BookOpen size={12} className="mr-2" /> Legal & Compliance</p>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold italic border-l-4 border-slate-100 pl-4">{invoiceData.paymentTerms}</p>
                </div>
                <div className="w-72 space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Gross Value</span><span className="font-black text-slate-950">${totalCost.toLocaleString()}</span></div>
                  <div className="flex justify-between items-end pt-6 border-t-[2px] border-slate-200"><span className="text-xs font-black uppercase text-slate-950 tracking-widest">Total Due</span><span className="text-5xl font-black text-slate-950 tracking-tighter">${grandTotal.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
            <button onClick={() => setIsInvoiceModalOpen(false)} className="absolute top-6 right-6 md:-top-16 md:-right-16 p-5 text-white hover:text-cyan-400 transition-all z-[120]"><X size={48} /></button>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPaymentModalOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black text-slate-50 mb-8 tracking-tighter uppercase">Clear Payment</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-slate-600 font-black">$</span>
                  <input autoFocus type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-5 py-4 text-slate-200 text-lg font-black focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Remaining Balance</div>
                <div className="text-2xl font-black text-emerald-400 tracking-tight">${Math.max(0, balance).toLocaleString()}</div>
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
              <button onClick={handleRecordPayment} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-900/20">Clear Funds</button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black text-slate-50 mb-8 tracking-tighter uppercase">New Project</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Project Title</label>
                <input autoFocus value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} placeholder="e.g. Q4 TikTok Launch" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 font-bold focus:border-cyan-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Capital Budget ($)</label>
                <input type="number" value={newProjectBudget} onChange={(e) => setNewProjectBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-slate-200 font-black text-xl focus:border-cyan-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
              <button onClick={handleCreateProject} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-900/20">Launch Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseFlow;
