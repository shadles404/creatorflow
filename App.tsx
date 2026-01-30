
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
import { db } from './lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Firestore Data State
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(['Other', 'Production', 'Commission', 'Ad Spend', 'Gift', 'Software']);

  // Load Data from Firebase
  useEffect(() => {
    const storedUser = localStorage.getItem('creatorflow_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(true);

    const unsubscribers = [
      onSnapshot(collection(db, 'influencers'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Influencer));
        setInfluencers(data);
      }),
      onSnapshot(collection(db, 'transactions'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
        setTransactions(data);
      }),
      onSnapshot(collection(db, 'deliveries'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Delivery));
        setDeliveries(data);
      }),
      onSnapshot(collection(db, 'projects'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(data);
      }),
      onSnapshot(collection(db, 'tasks'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(data);
      }),
      onSnapshot(collection(db, 'categories'), (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data().name);
        if (data.length > 0) {
            setCategories(data);
        }
      }),
    ];

    setLoading(false);

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('creatorflow_user');
    setUser(null);
  };

  const handleLogin = (userData: any) => {
    localStorage.setItem('creatorflow_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleAddInfluencer = async (inf: Omit<Influencer, 'id'>) => {
    try {
      await addDoc(collection(db, 'influencers'), inf);
    } catch (error) {
      console.error("Error adding influencer: ", error);
    }
  };
  const handleUpdateInfluencer = async (updated: Influencer) => {
    try {
      const docRef = doc(db, 'influencers', updated.id);
      await updateDoc(docRef, updated as any);
    } catch (error) {
      console.error("Error updating influencer: ", error);
    }
  };
  const handleDeleteInfluencer = async (id: string) => {
    try {
      const docRef = doc(db, 'influencers', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting influencer: ", error);
    }
  };

  const handleAddDelivery = async (del: Omit<Delivery, 'id'>) => {
    try {
      await addDoc(collection(db, 'deliveries'), del);
    } catch (error) {
      console.error("Error adding delivery: ", error);
    }
  };
  const handleUpdateDelivery = async (updated: Delivery) => {
    try {
      const docRef = doc(db, 'deliveries', updated.id);
      await updateDoc(docRef, updated as any);
    } catch (error) {
      console.error("Error updating delivery: ", error);
    }
  };
  const handleDeleteDelivery = async (id: string) => {
    try {
      const docRef = doc(db, 'deliveries', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting delivery: ", error);
    }
  };

  const handleBulkUpdateDeliveries = async (ids: string[], updates: Partial<Delivery>) => {
    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
        const docRef = doc(db, 'deliveries', id);
        batch.update(docRef, updates);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error bulk updating deliveries: ", error);
    }
  };

  const handleBulkDeleteDeliveries = async (ids: string[]) => {
    try {
      const batch = writeBatch(db);
      ids.forEach(id => {
        const docRef = doc(db, 'deliveries', id);
        batch.delete(docRef);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error bulk deleting deliveries: ", error);
    }
  };

  const handleAddProject = async (project: Omit<Project, 'id'>) => {
    try {
      await addDoc(collection(db, 'projects'), project);
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  const handleUpdateProject = async (updated: Project) => {
    try {
      const docRef = doc(db, 'projects', updated.id);
      await updateDoc(docRef, updated as any);
    } catch (error) {
      console.error("Error updating project: ", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  const handleAddCategory = async (category: string) => {
    try {
      await addDoc(collection(db, 'categories'), { name: category });
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    try {
      await addDoc(collection(db, 'tasks'), task);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const handleUpdateTask = async (updated: Task) => {
    try {
      const docRef = doc(db, 'tasks', updated.id);
      await updateDoc(docRef, updated as any);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const docRef = doc(db, 'tasks', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
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
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            categories={categories} 
            onAddCategory={handleAddCategory} 
          />
        );
      case 'tasks':
        return <TaskManager 
                    tasks={tasks} 
                    onAddTask={handleAddTask}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                />;
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
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Connecting to Firebase...</p>
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
            <span>Firebase Connected</span>
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
