import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../types';
import { Plus, Search, Printer, Edit, Trash2 } from 'lucide-react';

interface ReceptionProps {
  tickets: Ticket[];
  onAddTicket: (ticket: Ticket) => void;
  onUpdateTicket: (ticket: Ticket) => void;
  onDeleteTicket: (id: string) => void;
}

const Reception: React.FC<ReceptionProps> = ({ tickets, onAddTicket, onUpdateTicket, onDeleteTicket }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Ticket>>({
    customerName: '',
    phone: '',
    model: '',
    imei: '',
    issue: '',
    cost: 0,
    technician: '',
    notes: []
  });

  const resetForm = () => {
    setFormData({
        customerName: '',
        phone: '',
        model: '',
        imei: '',
        issue: '',
        cost: 0,
        technician: '',
        notes: []
    });
    setEditingTicket(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket) {
      onUpdateTicket({ ...editingTicket, ...formData } as Ticket);
    } else {
      const newTicket: Ticket = {
        id: Date.now().toString(),
        status: TicketStatus.RECEIVED,
        paid: false,
        createdAt: new Date().toISOString(),
        customerName: formData.customerName!,
        phone: formData.phone!,
        model: formData.model!,
        imei: formData.imei!,
        issue: formData.issue!,
        cost: formData.cost || 0,
        technician: formData.technician || '',
        notes: formData.notes || []
      };
      onAddTicket(newTicket);
    }
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setFormData(ticket);
    setShowModal(true);
  };

  const filteredTickets = tickets.filter(t => 
    t.customerName.includes(searchTerm) || 
    t.phone.includes(searchTerm) ||
    t.id.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الاستقبال وتسليم الأجهزة</h2>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          تذكرة جديدة
        </button>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="بحث برقم الجوال، اسم العميل، أو رقم التذكرة..." 
          className="w-full p-3 pr-10 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم التذكرة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العميل</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجهاز</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشكلة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{ticket.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.customerName}<br/>
                  <span className="text-xs text-gray-400">{ticket.phone}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.model}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ticket.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${ticket.status === TicketStatus.READY ? 'bg-green-100 text-green-800' : 
                      ticket.status === TicketStatus.DELIVERED ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                  <button onClick={() => handleEdit(ticket)} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                  <button onClick={() => onDeleteTicket(ticket.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  <button className="text-gray-600 hover:text-gray-900"><Printer size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">{editingTicket ? 'تعديل تذكرة' : 'تذكرة صيانة جديدة'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <input 
                required
                placeholder="اسم العميل"
                className="p-2 border rounded"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
              />
              <input 
                required
                placeholder="رقم الجوال"
                className="p-2 border rounded"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
              <input 
                required
                placeholder="موديل الجهاز"
                className="p-2 border rounded"
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})}
              />
              <input 
                placeholder="الرقم التسلسلي / IMEI"
                className="p-2 border rounded"
                value={formData.imei}
                onChange={e => setFormData({...formData, imei: e.target.value})}
              />
              <textarea 
                required
                placeholder="وصف المشكلة"
                className="p-2 border rounded col-span-2"
                rows={3}
                value={formData.issue}
                onChange={e => setFormData({...formData, issue: e.target.value})}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700">التكلفة المتوقعة</label>
                <input 
                  type="number"
                  className="p-2 border rounded w-full"
                  value={formData.cost}
                  onChange={e => setFormData({...formData, cost: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">الفني المسؤول</label>
                <input 
                  placeholder="اسم الفني"
                  className="p-2 border rounded w-full"
                  value={formData.technician}
                  onChange={e => setFormData({...formData, technician: e.target.value})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">حالة الجهاز</label>
                <select 
                  className="p-2 border rounded w-full"
                  value={formData.status || TicketStatus.RECEIVED}
                  onChange={e => setFormData({...formData, status: e.target.value as TicketStatus})}
                >
                  {Object.values(TicketStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reception;
