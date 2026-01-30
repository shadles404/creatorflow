
import React, { useState } from 'react';
import { Plus, X, Phone, DollarSign, Target, Globe, Briefcase, FileText, CheckCircle2 } from 'lucide-react';
import { Advertiser } from '../types';

interface AdvertiserManagerProps {
  advertisers: Advertiser[];
  onAddAdvertiser: (advertiser: Advertiser) => void;
}

const AD_TYPE_OPTIONS = ['Milk', 'Makeup', 'Perfume', 'Cream', 'Skincare', 'Other'];

const AdvertiserManager: React.FC<AdvertiserManagerProps> = ({ advertisers, onAddAdvertiser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    salary: '0',
    targetVideos: '1',
    platform: 'TikTok',
    contractType: 'Freelance',
    adTypes: [] as string[],
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAdType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      adTypes: prev.adTypes.includes(type)
        ? prev.adTypes.filter(t => t !== type)
        : [...prev.adTypes, type]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdvertiser: Advertiser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      phone: formData.phone,
      salary: parseFloat(formData.salary) || 0,
      targetVideos: parseInt(formData.targetVideos) || 0,
      completedVideos: 0,
      platform: formData.platform,
      contractType: formData.contractType,
      adTypes: formData.adTypes,
      notes: formData.notes,
      avatar: `https://picsum.photos/seed/${Math.random()}/150/150`
    };
    onAddAdvertiser(newAdvertiser);
    setIsModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      salary: '0',
      targetVideos: '1',
      platform: 'TikTok',
      contractType: 'Freelance',
      adTypes: [],
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advertising Team</h2>
          <p className="text-slate-400 text-sm">Managing {advertisers.length} specialized advertisers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-pink-900/20"
        >
          <Plus size={18} />
          <span>Register Advertiser</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {advertisers.map((adv) => (
          <div key={adv.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img src={adv.avatar} alt={adv.name} className="w-14 h-14 rounded-full border-2 border-slate-800 object-cover" />
                <div>
                  <h4 className="text-lg font-bold text-slate-100">{adv.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{adv.platform} • {adv.contractType}</p>
                </div>
              </div>
              <div className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded-md border border-cyan-500/20 uppercase">
                Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Target Videos</div>
                <div className="text-lg font-bold text-slate-200">{adv.targetVideos}</div>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Monthly Salary</div>
                <div className="text-lg font-bold text-emerald-400">${adv.salary.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-xs text-slate-400">
                <Phone size={12} className="mr-2" />
                {adv.phone}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {adv.adTypes.map(type => (
                  <span key={type} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Advertiser Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-800/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                  <Briefcase className="text-pink-400" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Register Advertiser</h3>
                  <p className="text-xs text-slate-400">Add a new team member to your TikTok advertising team</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    Name <span className="text-pink-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Advertiser name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-600" size={14} />
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors text-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    Salary ($) <span className="text-pink-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 text-slate-600" size={14} />
                    <input 
                      required
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                    Target Videos <span className="text-pink-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Target className="absolute left-4 top-3.5 text-slate-600" size={14} />
                    <input 
                      required
                      type="number"
                      name="targetVideos"
                      value={formData.targetVideos}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors text-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-3.5 text-slate-600" size={14} />
                    <select 
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors text-slate-200 appearance-none"
                    >
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contract Type</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-4 top-3.5 text-slate-600" size={14} />
                    <select 
                      name="contractType"
                      value={formData.contractType}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors text-slate-200 appearance-none"
                    >
                      <option value="Freelance">Freelance</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Commission-only">Commission-only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advertisement Types</label>
                <div className="flex flex-wrap gap-2">
                  {AD_TYPE_OPTIONS.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleAdType(type)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-medium border transition-all
                        ${formData.adTypes.includes(type)
                          ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-900/20'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}
                      `}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 text-slate-600" size={14} />
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about the advertiser..."
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-colors text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-xl text-sm font-bold shadow-xl shadow-pink-900/40 transition-all transform hover:-translate-y-0.5"
                >
                  Register Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiserManager;
