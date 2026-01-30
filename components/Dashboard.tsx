
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Eye } from 'lucide-react';
import { Influencer, Transaction } from '../types';

interface DashboardProps {
  influencers: Influencer[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ influencers, transactions }) => {
  const totalFollowers = influencers.reduce((acc, curr) => acc + curr.followers, 0);
  const totalSpent = transactions.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.amount : 0), 0);
  const totalPending = transactions.reduce((acc, curr) => acc + (curr.status === 'pending' ? curr.amount : 0), 0);
  const avgEngagement = (influencers.reduce((acc, curr) => acc + curr.engagementRate, 0) / influencers.length).toFixed(1);

  // Mock chart data
  const reachData = [
    { name: 'Mon', views: 40000 },
    { name: 'Tue', views: 30000 },
    { name: 'Wed', views: 20000 },
    { name: 'Thu', views: 27800 },
    { name: 'Fri', views: 18900 },
    { name: 'Sat', views: 23900 },
    { name: 'Sun', views: 34900 },
  ];

  const expenseData = [
    { name: 'Sep', amount: 4000 },
    { name: 'Oct', amount: 3000 },
    { name: 'Nov', amount: 7500 },
    { name: 'Dec', amount: 5000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Account Overview</h2>
        <div className="text-sm text-slate-400">Real-time sync active</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Reach" 
          value={(totalFollowers / 1000000).toFixed(1) + 'M'} 
          sub="Potential followers" 
          icon={Users} 
          color="cyan"
        />
        <StatCard 
          title="Avg Engagement" 
          value={avgEngagement + '%'} 
          sub="Across all creators" 
          icon={TrendingUp} 
          color="pink"
        />
        <StatCard 
          title="Monthly Spend" 
          value={`$${totalSpent.toLocaleString()}`} 
          sub="Paid transactions" 
          icon={DollarSign} 
          color="emerald"
        />
        <StatCard 
          title="Est. Views" 
          value="4.2M" 
          sub="Last 30 days" 
          icon={Eye} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h3 className="text-lg font-semibold mb-6">Views Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reachData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area type="monotone" dataKey="views" stroke="#22d3ee" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h3 className="text-lg font-semibold mb-6">Expense Flow (Quarterly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="amount" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: any;
  color: 'cyan' | 'pink' | 'emerald' | 'blue';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, sub, icon: Icon, color }) => {
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg border ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
      <div className="text-sm font-medium text-slate-400 mt-1">{title}</div>
      <div className="text-xs text-slate-500 mt-2">{sub}</div>
    </div>
  );
};

export default Dashboard;
