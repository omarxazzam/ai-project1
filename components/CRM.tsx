import React from 'react';
import { Ticket, Customer } from '../types';
import { User, Phone, History } from 'lucide-react';

interface CRMProps {
  tickets: Ticket[];
}

const CRM: React.FC<CRMProps> = ({ tickets }) => {
  // Derive unique customers from tickets
  const customersMap = new Map<string, Customer>();

  tickets.forEach(t => {
    if (!customersMap.has(t.phone)) {
      customersMap.set(t.phone, {
        phone: t.phone,
        name: t.customerName,
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: t.createdAt
      });
    }
    const customer = customersMap.get(t.phone)!;
    customer.totalVisits += 1;
    customer.totalSpent += t.cost;
    if (new Date(t.createdAt) > new Date(customer.lastVisit)) {
      customer.lastVisit = t.createdAt;
    }
  });

  const customers = Array.from(customersMap.values());

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">إدارة علاقات العملاء (CRM)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(c => (
          <div key={c.phone} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{c.name}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <Phone size={14} className="ml-1" />
                  {c.phone}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">عدد الزيارات:</span>
                <span className="font-semibold">{c.totalVisits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">إجمالي المدفوعات:</span>
                <span className="font-semibold text-green-600">{c.totalSpent} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">آخر زيارة:</span>
                <span className="text-gray-700">{new Date(c.lastVisit).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRM;
