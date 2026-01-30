
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Calendar, 
  Truck, 
  DollarSign, 
  Trash2, 
  Edit3,
  CheckCircle,
  Clock,
  Send,
  XCircle,
  X,
  CheckSquare,
  Square,
  Wallet,
  CreditCard,
  Ban
} from 'lucide-react';
import { Delivery, Influencer } from '../types';

interface DeliveryManagerProps {
  deliveries: Delivery[];
  influencers: Influencer[];
  onAddDelivery: (delivery: Delivery) => void;
  onUpdateDelivery: (delivery: Delivery) => void;
  onDeleteDelivery: (id: string) => void;
  onBulkUpdateDeliveries?: (ids: string[], updates: Partial<Delivery>) => Promise<void>;
  onBulkDeleteDeliveries?: (ids: string[]) => Promise<void>;
}

type PaymentFilter = 'All' | 'Paid' | 'Unpaid';

const DeliveryManager: React.FC<DeliveryManagerProps> = ({ 
  deliveries, 
  influencers, 
  onAddDelivery, 
  onUpdateDelivery,
  onDeleteDelivery,
  onBulkUpdateDeliveries,
  onBulkDeleteDeliveries
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'records'>('records');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    influencerId: '',
    productName: '',
    quantity: '1',
    dateSent: new Date().toISOString().split('T')[0],
    status: 'Pending',
    paymentStatus: 'Unpaid' as 'Paid' | 'Unpaid',
    price: '0',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!editingDelivery) return;
    
    setEditingDelivery(prev => {
      if (!prev) return null;
      if (name === 'influencerId') {
        const inf = influencers.find(i => i.id === value);
        return { ...prev, influencerId: value, influencerName: inf?.name || 'Unknown' };
      }
      return { 
        ...prev, 
        [name]: name === 'quantity' ? parseInt(value) || 0 : name === 'price' ? parseFloat(value) || 0 : value 
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.influencerId || !formData.productName) return;

    const influencer = influencers.find(i => i.id === formData.influencerId);
    
    const newDelivery: Delivery = {
      id: Math.random().toString(36).substr(2, 9),
      influencerId: formData.influencerId,
      influencerName: influencer?.name || 'Unknown',
      productName: formData.productName,
      quantity: parseInt(formData.quantity) || 1,
      dateSent: formData.dateSent,
      status: formData.status as any,
      paymentStatus: formData.paymentStatus,
      price: parseFloat(formData.price) || 0,
      notes: formData.notes
    };

    onAddDelivery(newDelivery);
    setActiveTab('records');
    setFormData({
      influencerId: '',
      productName: '',
      quantity: '1',
      dateSent: new Date().toISOString().split('T')[0],
      status: 'Pending',
      paymentStatus: 'Unpaid',
      price: '0',
      notes: ''
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDelivery) {
      onUpdateDelivery(editingDelivery);
      setEditingDelivery(null);
    }
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(d => {
      const matchesSearch = d.influencerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPayment = paymentFilter === 'All' || d.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    });
  }, [deliveries, searchTerm, paymentFilter]);

  const stats = useMemo(() => {
    const unpaid = deliveries.filter(d => d.paymentStatus === 'Unpaid').reduce((acc, curr) => acc + curr.price, 0);
    const paid = deliveries.filter(d => d.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.price, 0);
    return { unpaid, paid, total: unpaid + paid };
  }, [deliveries]);

  // Bulk Actions
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDeliveries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDeliveries.map(d => d.id)));
    }
  };

  const handleBulkMarkDelivered = async () => {
    if (!onBulkUpdateDeliveries) return;
    await onBulkUpdateDeliveries(Array.from(selectedIds), { status: 'Delivered' });
    setSelectedIds(new Set());
  };

  const handleBulkMarkPaid = async () => {
    if (!onBulkUpdateDeliveries) return;
    await onBulkUpdateDeliveries(Array.from(selectedIds), { paymentStatus: 'Paid' });
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (!onBulkDeleteDeliveries) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} deliveries?`)) {
      await onBulkDeleteDeliveries(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Logistics Command</h2>
          <p className="text-slate-400 text-sm">Monitor shipments and financial clearance for physical seeding</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
        <button 
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'records' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-slate-200'}`}
        >
          Delivery Records
        </button>
        <button 
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-900/40' : 'text-slate-500 hover:text-slate-200'}`}
        >
          New Shipment
        </button>
      </div>

      {activeTab === 'form' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-cyan-500/20 rounded-2xl">
              <Package className="text-cyan-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Provision Shipment</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Register outgoing asset</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipient Influencer *</label>
                <select 
                  required
                  name="influencerId"
                  value={formData.influencerId}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
                >
                  <option value="">Select partner...</option>
                  {influencers.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.handle})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product SKU/Name *</label>
                <div className="relative">
                   <Package className="absolute left-4 top-3.5 text-slate-600" size={14} />
                   <input 
                    required
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="e.g. Creator Kit Pro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantity *</label>
                <input 
                  required
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dispatch Date *</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-3.5 text-slate-600" size={14} />
                   <input 
                    required
                    type="date"
                    name="dateSent"
                    value={formData.dateSent}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transit Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="Sent">Sent</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Finance Status</label>
                <select 
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit Value ($)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mission Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Logistics details or tracking codes..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-cyan-900/40 transition-all transform hover:-translate-y-0.5"
              >
                Log Dispatch Mission
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-lg flex items-center justify-between group">
               <div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Total Assets Out</div>
                 <div className="text-3xl font-black text-slate-100">${stats.total.toLocaleString()}</div>
               </div>
               <Package className="text-slate-800 group-hover:text-cyan-500/20 transition-colors" size={48} />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-lg border-l-4 border-l-amber-500/50 flex items-center justify-between group">
               <div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1 text-amber-500">Unpaid Pipeline</div>
                 <div className="text-3xl font-black text-slate-100">${stats.unpaid.toLocaleString()}</div>
               </div>
               <Ban className="text-amber-500/10 group-hover:text-amber-500/20 transition-colors" size={48} />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-lg border-l-4 border-l-emerald-500/50 flex items-center justify-between group">
               <div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1 text-emerald-500">Cleared (Paid)</div>
                 <div className="text-3xl font-black text-slate-100">${stats.paid.toLocaleString()}</div>
               </div>
               <CheckCircle className="text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors" size={48} />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 bg-slate-800/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                 <h3 className="font-black text-slate-100 uppercase tracking-tighter text-xl">Operational Records</h3>
                 <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {['All', 'Unpaid', 'Paid'].map((f) => (
                      <button 
                        key={f}
                        onClick={() => setPaymentFilter(f as PaymentFilter)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${paymentFilter === f ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {f}
                      </button>
                    ))}
                 </div>
               </div>
               <div className="relative w-full lg:w-96">
                  <Search className="absolute left-4 top-3 text-slate-500" size={16} />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs by partner or product..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-cyan-500 transition-colors text-slate-200"
                  />
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-[10px] text-slate-500 uppercase tracking-widest font-black bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    <th className="px-8 py-6 w-12 text-center">
                      <button 
                        onClick={toggleSelectAll}
                        className="text-slate-500 hover:text-cyan-400"
                      >
                        {selectedIds.size === filteredDeliveries.length && filteredDeliveries.length > 0 ? (
                          <CheckSquare size={18} className="text-cyan-400" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </th>
                    <th className="px-8 py-6">Mission Partner</th>
                    <th className="px-8 py-6">Asset Dispatched</th>
                    <th className="px-8 py-6 text-center">Units</th>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6">Finance Status</th>
                    <th className="px-8 py-6">Logistics Status</th>
                    <th className="px-8 py-6 text-right">Value</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-8 py-20 text-center text-slate-600 font-bold italic uppercase tracking-widest">Registry empty for selected criteria.</td>
                    </tr>
                  ) : (
                    filteredDeliveries.map((del) => (
                      <tr 
                        key={del.id} 
                        className={`hover:bg-slate-800/30 transition-colors group cursor-pointer ${selectedIds.has(del.id) ? 'bg-cyan-500/5' : ''}`}
                        onClick={() => toggleSelect(del.id)}
                      >
                        <td className="px-8 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(del.id)}>
                            {selectedIds.has(del.id) ? <CheckSquare size={18} className="text-cyan-400" /> : <Square size={18} className="text-slate-700" />}
                          </button>
                        </td>
                        <td className="px-8 py-4 font-black text-slate-100">{del.influencerName}</td>
                        <td className="px-8 py-4">
                           <div className="flex items-center text-slate-400 font-medium">
                             <Package size={14} className="mr-3 text-cyan-500/50" />
                             {del.productName}
                           </div>
                        </td>
                        <td className="px-8 py-4 text-center font-black text-slate-500">{del.quantity}</td>
                        <td className="px-8 py-4 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                          {new Date(del.dateSent).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-4">
                           <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                             del.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                           }`}>
                             {del.paymentStatus}
                           </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border flex items-center w-fit ${getStatusStyle(del.status)}`}>
                            <Truck size={10} className="mr-2" />
                            {del.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right font-black text-slate-100">
                          ${del.price.toLocaleString()}
                        </td>
                        <td className="px-8 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                           <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => setEditingDelivery(del)} className="p-2 text-slate-600 hover:text-cyan-400 transition-colors"><Edit3 size={16} /></button>
                            <button onClick={() => onDeleteDelivery(del.id)} className="p-2 text-slate-600 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bulk Actions Floating Bar */}
          {selectedIds.size > 0 && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10">
              <div className="bg-slate-950/90 backdrop-blur-xl border border-cyan-500/30 rounded-[32px] p-4 shadow-2xl flex items-center space-x-4">
                <div className="px-6 border-r border-slate-800">
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Matrix Selection</div>
                  <div className="text-xl font-black text-cyan-400">{selectedIds.size} Units</div>
                </div>
                <div className="flex items-center space-x-2 pr-2">
                  <button onClick={handleBulkMarkPaid} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <Wallet size={14} /> <span>Mark Paid</span>
                  </button>
                  <button onClick={handleBulkMarkDelivered} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <Truck size={14} /> <span>Mark Delivered</span>
                  </button>
                  <button onClick={handleBulkDelete} className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/20">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Overlay */}
      {editingDelivery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setEditingDelivery(null)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-800 bg-slate-800/20">
              <h3 className="text-3xl font-black text-slate-50 uppercase tracking-tighter">Update Log</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Mission Ref: {editingDelivery.id}</p>
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Partner</label>
                  <select name="influencerId" value={editingDelivery.influencerId} onChange={handleEditInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:border-cyan-500 outline-none">
                    {influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</label>
                  <select name="status" value={editingDelivery.status} onChange={handleEditInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:border-cyan-500 outline-none">
                    <option value="Pending">Pending</option>
                    <option value="Sent">Sent</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Finance Status</label>
                  <select name="paymentStatus" value={editingDelivery.paymentStatus} onChange={handleEditInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:border-cyan-500 outline-none">
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Value ($)</label>
                  <input type="number" name="price" value={editingDelivery.price} onChange={handleEditInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 font-black focus:border-cyan-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-4 pt-10">
                <button type="button" onClick={() => setEditingDelivery(null)} className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Abort</button>
                <button type="submit" className="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Apply Updates</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManager;
