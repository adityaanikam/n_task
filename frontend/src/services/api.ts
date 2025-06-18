import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  members: User[];
}

export interface ExpenseSplit {
  id: number;
  expense_id: number;
  user_id: number;
  amount: number;
  percentage?: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  group_id: number;
  paid_by: number;
  split_type: string;
  splits: ExpenseSplit[];
}

export interface Balance {
  user_id: number;
  amount: number;
  user_name: string;
}

export interface UserBalance {
  user_id: number;
  username: string;
  net_balance: number;
  group_balances: Record<string, number>;
}

export interface ChatResponse {
  answer: string;
  context_used: string;
}

export const apiService = {
  // Groups
  getGroups: () => 
    api.get<Group[]>('/groups/'),
    
  createGroup: (data: { 
    name: string; 
    description?: string; 
    users: Array<{ name: string; email: string }> 
  }) => api.post<Group>('/groups', data),

  getGroup: (groupId: number) =>
    api.get<Group>(`/groups/${groupId}`),

  getGroupBalances: (groupId: number) =>
    api.get<Balance[]>(`/groups/${groupId}/balances`),

  // Expenses
  createExpense: (groupId: number, data: {
    description: string;
    amount: number;
    paid_by: number;
    split_type: 'equal' | 'percentage';
    splits: Array<{ user_id: number; amount: number; percentage?: number }>;
  }) => api.post<Expense>(`/groups/${groupId}/expenses`, data),

  getGroupExpenses: (groupId: number) =>
    api.get<Expense[]>(`/groups/${groupId}/expenses`),

  // User Balances
  getUserBalances: (userId: number) =>
    api.get<Balance[]>(`/users/${userId}/balances`),

  // Chat
  askQuestion: (query: string, userId: number, groupId?: number) =>
    api.post<ChatResponse>('/chat/ask', { query, user_id: userId, group_id: groupId }),
}; 