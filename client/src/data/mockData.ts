import { User, Order, Feedback, Payment } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    joinDate: '2024-01-15',
    totalOrders: 12
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    address: '456 Oak Ave, City, State',
    joinDate: '2024-02-20',
    totalOrders: 8
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1234567892',
    address: '789 Pine Rd, City, State',
    joinDate: '2024-03-10',
    totalOrders: 15
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: '1',
    userName: 'John Doe',
    items: [],
    total: 45.67,
    status: 'delivered',
    date: '2024-12-15',
    address: '123 Main St, City, State',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD002',
    userId: '2',
    userName: 'Jane Smith',
    items: [],
    total: 78.90,
    status: 'processing',
    date: '2024-12-18',
    address: '456 Oak Ave, City, State',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD003',
    userId: '3',
    userName: 'Mike Johnson',
    items: [],
    total: 123.45,
    status: 'shipped',
    date: '2024-12-20',
    address: '789 Pine Rd, City, State',
    paymentMethod: 'Credit Card'
  }
];

export const mockFeedbacks: Feedback[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    productId: '1',
    productName: 'Fresh Organic Apples',
    rating: 5,
    comment: 'Amazing quality apples! Very fresh and sweet.',
    date: '2024-12-10'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    productId: '2',
    productName: 'Fresh Milk',
    rating: 4,
    comment: 'Good quality milk, delivered fresh.',
    date: '2024-12-12'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Johnson',
    productId: '3',
    productName: 'Whole Grain Bread',
    rating: 5,
    comment: 'Best bread I\'ve ever tasted! Will order again.',
    date: '2024-12-14'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    orderId: 'ORD001',
    amount: 45.67,
    method: 'Credit Card',
    status: 'completed',
    date: '2024-12-15'
  },
  {
    id: 'PAY002',
    orderId: 'ORD002',
    amount: 78.90,
    method: 'PayPal',
    status: 'completed',
    date: '2024-12-18'
  },
  {
    id: 'PAY003',
    orderId: 'ORD003',
    amount: 123.45,
    method: 'Credit Card',
    status: 'pending',
    date: '2024-12-20'
  }
];