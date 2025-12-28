import React, { useState } from 'react';
import { Part } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface InventoryProps {
  parts: Part[];
  onAddPart: (part: Part) => void;
  onUpdatePart: (part: Part) => void;
  onDeletePart: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ parts, onAddPart, onUpdatePart, onDeletePart }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<Partial<Part>>({ name: '', quantity: 0, price: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPart) {
      onUpdatePart({ ...editingPart, ...formData } as Part);
    } else {
      onAddPart({
        id: Date.now().toString(),
        name: formData.name!,
        quantity: formData.quantity || 0,
        price: formData.price || 0
      });
    }
    setShowModal(false);
    setEditingPart(null);
    setFormData({ name: '', quantity: 0, price: 0 });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المخزن وقطع الغيار</h2>
        <button 
          onClick={() => { setEditingPart(null); setFormData({name: '', quantity: 0, price: 0}); setShowModal(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={20} />
          إضافة قطعة
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم القطعة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية المتوفرة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">سعر البيع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {parts.map(part => (
              <tr key={part.id}>
                <td className="px-6 py-4">{part.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${part.quantity < 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {part.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">{part.price} ر.س</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => { setEditingPart(part); setFormData(part); setShowModal(true); }} className="text-blue-600"><Edit size={18}/></button>
                  <button onClick={() => onDeletePart(part.id)} className="text-red-600"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingPart ? 'تعديل قطعة' : 'إضافة قطعة جديدة'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                required
                placeholder="اسم القطعة"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm">الكمية</label>
                    <input 
                        type="number"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                    />
                </div>
                <div>
                    <label className="text-sm">السعر</label>
                    <input 
                        type="number"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
