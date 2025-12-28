import { Ticket, Part, Transaction, TicketStatus } from '../types';

const KEYS = {
  TICKETS: 'repair_tickets',
  PARTS: 'repair_parts',
  TRANSACTIONS: 'repair_transactions'
};

export const getTickets = (): Ticket[] => {
  const data = localStorage.getItem(KEYS.TICKETS);
  return data ? JSON.parse(data) : [];
};

export const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets));
};

export const getParts = (): Part[] => {
  const data = localStorage.getItem(KEYS.PARTS);
  return data ? JSON.parse(data) : [];
};

export const saveParts = (parts: Part[]) => {
  localStorage.setItem(KEYS.PARTS, JSON.stringify(parts));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Seed initial data if empty
export const seedData = () => {
  if (!localStorage.getItem(KEYS.TICKETS)) {
    const initialTickets: Ticket[] = [
      {
        id: '1001',
        customerName: 'أحمد محمد',
        phone: '0501234567',
        model: 'iPhone 13 Pro',
        imei: '356789123456789',
        issue: 'كسر في الشاشة',
        status: TicketStatus.IN_PROGRESS,
        technician: 'علي',
        cost: 450,
        paid: false,
        notes: ['يحتاج شاشة أصلية'],
        createdAt: new Date().toISOString()
      },
      {
        id: '1002',
        customerName: 'سارة خالد',
        phone: '0559876543',
        model: 'Samsung S21',
        imei: '359876543210987',
        issue: 'مشكلة في البطارية',
        status: TicketStatus.READY,
        technician: 'محمد',
        cost: 200,
        paid: false,
        notes: [],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    saveTickets(initialTickets);
  }

  if (!localStorage.getItem(KEYS.PARTS)) {
    const initialParts: Part[] = [
      { id: '1', name: 'شاشة iPhone 13 Pro', quantity: 5, price: 300 },
      { id: '2', name: 'بطارية Samsung S21', quantity: 10, price: 100 },
      { id: '3', name: 'مدخل شحن Type-C', quantity: 20, price: 25 }
    ];
    saveParts(initialParts);
  }
};
