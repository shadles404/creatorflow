
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InfluencerManager from './components/InfluencerManager';
import TrackingInfluencer from './components/TrackingInfluencer';
import DeliveryManager from './components/DeliveryManager';
import ExpenseFlow from './components/ExpenseFlow';
import Reports from './components/Reports';
import Login from './components/Login';
import TaskManager from './components/TaskManager';
import { Influencer, Transaction, Delivery, Project, Task } from './types';
import { Shield, LogOut, Loader2, Database } from 'lucide-react';
import { INITIAL_INFLUENCERS, INITIAL_TRANSACTIONS, INITIAL_DELIVERIES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Local Data State
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(['Other', 'Production', 'Commission', 'Ad Spend', 'Gift', 'Software']);

  // Load Data from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('creatorflow_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const loadLocal = (key: string, initial: any) => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : initial;
    };

    setInfluencers(loadLocal('cf_influencers', INITIAL_INFLUENCERS));
    setTransactions(loadLocal('cf_transactions', INITIAL_TRANSACTIONS));
    setDeliveries(loadLocal('cf_deliveries', INITIAL_DELIVERIES));
    setProjects(loadLocal('cf_projects', []));
    setTasks(loadLocal('cf_tasks', []));
    setCategories(loadLocal('cf_categories', ['Other', 'Production', 'Commission', 'Ad Spend', 'Gift', 'Software']));

    setLoading(false);
  }, []);

  // Persistence Helpers
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cf_influencers', JSON.stringify(influencers));
      localStorage.setItem('cf_transactions', JSON.stringify(transactions));
      localStorage.setItem('cf_deliveries', JSON.stringify(deliveries));
      localStorage.setItem('cf_projects', JSON.stringify(projects));
      localStorage.setItem('cf_tasks', JSON.stringify(tasks));
      localStorage.setItem('cf_categories', JSON.stringify(categories));
    }
  }, [influencers, transactions, deliveries, projects, tasks, categories, loading]);

  const handleLogout = () => {
    localStorage.removeItem('creatorflow_user');
    setUser(null);
  };

  const handleLogin = (userData: any) => {
    localStorage.setItem('creatorflow_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleAddInfluencer = (inf: Influencer) => setInfluencers(prev => [...prev, inf]);
  const handleUpdateInfluencer = (updated: Influencer) => setInfluencers(prev => prev.map(i => i.id === updated.id ? updated : i));
  const handleDeleteInfluencer = (id: string) => setInfluencers(prev => prev.filter(i => i.id !== id));

  const handleAddDelivery = (del: Delivery) => setDeliveries(prev => [...prev, del]);
  const handleUpdateDelivery = (updated: Delivery) => setDeliveries(prev => prev.map(d => d.id === updated.id ? updated : d));
  const handleDeleteDelivery = (id: string) => setDeliveries(prev => prev.filter(d => d.id !== id));

  const handleBulkUpdateDeliveries = async (ids: string[], updates: Partial<Delivery>) => {
    setDeliveries(prev => prev.map(d => ids.includes(d.id) ? { ...d, ...updates } : d));
  };

  const handleBulkDeleteDeliveries = async (ids: string[]) => {
    setDeliveries(prev => prev.filter(d => !ids.includes(d.id)));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard influencers={influencers} transactions={transactions} />;
      case 'influencers':
        return <InfluencerManager influencers={influencers} onAddInfluencer={handleAddInfluencer} />;
      case 'tracker':
        return (
          <TrackingInfluencer 
            influencers={influencers} 
            onUpdateInfluencer={handleUpdateInfluencer} 
            onDeleteInfluencer={handleDeleteInfluencer} 
          />
        );
      case 'deliveries':
        return (
          <DeliveryManager 
            deliveries={deliveries} 
            influencers={influencers} 
            onAddDelivery={handleAddDelivery} 
            onUpdateDelivery={handleUpdateDelivery} 
            onDeleteDelivery={handleDeleteDelivery}
            onBulkUpdateDeliveries={handleBulkUpdateDeliveries}
            onBulkDeleteDeliveries={handleBulkDeleteDeliveries}
          />
        );
      case 'expenses':
        return (
          <ExpenseFlow 
            projects={projects} 
            setProjects={setProjects} 
            categories={categories} 
            setCategories={setCategories} 
          />
        );
      case 'tasks':
        return <TaskManager tasks={tasks} setTasks={setTasks} />;
      case 'reports':
        return <Reports influencers={influencers} deliveries={deliveries} projects={projects} transactions={transactions} />;
      default:
        return <Dashboard influencers={influencers} transactions={transactions} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Initializing Local Memory...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-cyan-500">
            <Database size={10} />
            <span>Local Storage Active</span>
            <span className="text-slate-700 ml-2">SESSION: {user.email}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
          >
            <LogOut size={12} />
            <span>Lock Console</span>
          </button>
        </div>
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
