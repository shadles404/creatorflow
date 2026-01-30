
import { Influencer, Transaction, Delivery } from './types';

export const INITIAL_INFLUENCERS: Influencer[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    handle: '@alex_tech_tips',
    followers: 1250000,
    engagementRate: 8.4,
    avgViews: 450000,
    niche: 'Technology',
    avatar: 'https://picsum.photos/id/64/150/150',
    status: 'active',
    phone: '611681991',
    salary: 500,
    contractType: '6 Months',
    targetVideos: 10,
    completedVideos: 4,
    adTypes: ['Technology', 'Software'],
    platform: 'TikTok',
    notes: 'Primary tech reviewer'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    handle: '@sarahstyle',
    followers: 890000,
    engagementRate: 12.2,
    avgViews: 670000,
    niche: 'Fashion',
    avatar: 'https://picsum.photos/id/65/150/150',
    status: 'active',
    phone: '611681992',
    salary: 400,
    contractType: '3 Months',
    targetVideos: 5,
    completedVideos: 2,
    adTypes: ['Makeup', 'Skincare'],
    platform: 'TikTok',
    notes: 'High engagement in beauty niche'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    influencerId: '1',
    amount: 2500,
    date: '2023-10-12',
    category: 'commission',
    status: 'paid',
    description: 'Q4 Gadget Review Series'
  },
  {
    id: 'tx2',
    influencerId: '2',
    amount: 1800,
    date: '2023-11-05',
    category: 'ad_spend',
    status: 'pending',
    description: 'Winter Collection Promo'
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'del1',
    influencerId: '1',
    influencerName: 'Alex Rivera',
    productName: 'Tech Hub Pro',
    quantity: 1,
    dateSent: '2024-01-20',
    status: 'Delivered',
    paymentStatus: 'Paid',
    price: 45.00,
    notes: 'Standard review unit'
  },
  {
    id: 'del2',
    influencerId: '2',
    influencerName: 'Sarah Chen',
    productName: 'Glow Cream',
    quantity: 3,
    dateSent: '2024-01-25',
    status: 'Sent',
    paymentStatus: 'Unpaid',
    price: 15.50,
    notes: 'PR package for winter campaign'
  }
];
