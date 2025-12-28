export enum TicketStatus {
  RECEIVED = 'تم الاستلام',
  ASSIGNED = 'تم التعيين للفني',
  IN_PROGRESS = 'قيد العمل',
  WAITING_PARTS = 'بانتظار قطع',
  READY = 'جاهز للاستلام',
  DELIVERED = 'تم التسليم'
}

export interface Ticket {
  id: string;
  customerName: string;
  phone: string;
  model: string;
  imei: string;
  issue: string;
  status: TicketStatus;
  technician?: string;
  cost: number;
  paid: boolean;
  notes: string[];
  createdAt: string;
}

export interface Part {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  date: string;
  ticketId?: string;
}

export interface Customer {
  phone: string;
  name: string;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
}
