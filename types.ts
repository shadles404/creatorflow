
export type UserRole = 'admin' | 'staff' | 'delivery';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  followers: number;
  engagementRate: number;
  avgViews: number;
  niche: string;
  avatar: string;
  status: 'active' | 'negotiating' | 'archived';
  phone: string;
  salary: number;
  contractType: string;
  targetVideos: number;
  completedVideos: number;
  adTypes: string[];
  platform: string;
  notes: string;
}

export interface Advertiser {
  id: string;
  name: string;
  phone: string;
  salary: number;
  targetVideos: number;
  completedVideos: number;
  platform: string;
  contractType: string;
  adTypes: string[];
  notes: string;
  avatar: string;
}

export interface Transaction {
  id: string;
  influencerId: string;
  amount: number;
  date: string;
  category: 'commission' | 'ad_spend' | 'production' | 'gift';
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

export interface Delivery {
  id: string;
  influencerId: string;
  influencerName: string;
  productName: string;
  quantity: number;
  dateSent: string;
  status: 'Pending' | 'Sent' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid';
  price: number;
  notes: string;
}

export interface ExpenseItem {
  id: string;
  description: string;
  category: string;
  qty: number;
  price: number;
}

export interface Project {
  id: string;
  title: string;
  budget: number;
  paidAmount: number;
  createdAt: string;
  status: 'Unpaid' | 'Paid';
  expenses: ExpenseItem[];
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'Done' | 'Not Done';
  priority: 'High' | 'Medium' | 'Low';
}
