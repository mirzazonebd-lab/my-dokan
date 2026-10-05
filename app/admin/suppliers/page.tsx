'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Search, Trash2, UserRound, Phone, Mail, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import AdminLayout from '../AdminShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { readLocalStorage, writeLocalStorage, type SupplierRecord } from '@/lib/admin-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const STORAGE_KEY = 'beautydokanbd_suppliers';

const defaultSuppliers: SupplierRecord[] = [
  {
    id: 'supplier-1',
    name: 'Dhaka Beauty Imports',
    contact_person: 'Nusrat Islam',
    phone: '+8801700000001',
    whatsapp: '+8801700000001',
    email: 'import@beautybd.com',
    address: 'Nikunja, Dhaka',
    notes: 'Preferred K-beauty supplier',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'supplier-2',
    name: 'Urban Glow Co.',
    contact_person: 'Rafi Karim',
    phone: '+8801800000002',
    whatsapp: '+8801800000002',
    email: 'sales@urbanglowbd.com',
    address: 'Chattogram',
    notes: 'Skincare and body care',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const emptySupplier: Omit<SupplierRecord, 'id' | 'created_at' | 'updated_at'> & { id?: string } = {
  name: '',
  contact_person: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  notes: '',
  active: true,
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(defaultSuppliers);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptySupplier);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const loadSuppliers = async () => {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false });
        if (!error && data?.length) {
          const mapped = data.map((supplier: any) => ({
            ...supplier,
            id: String(supplier.id),
            active: supplier.is_active ?? supplier.active ?? true,
            phone: supplier.phone ?? '',
            whatsapp: supplier.whatsapp ?? '',
            email: supplier.email ?? '',
            address: supplier.address ?? '',
            notes: supplier.notes ?? '',
            contact_person: supplier.contact_person ?? '',
          })) as SupplierRecord[];

          setSuppliers(mapped);
          writeLocalStorage(STORAGE_KEY, mapped);
          return;
        }
      }

      const data = readLocalStorage<SupplierRecord[]>(STORAGE_KEY, defaultSuppliers);
      setSuppliers(data.length ? data : defaultSuppliers);
    };

    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const q = search.toLowerCase();
    return suppliers.filter((supplier) => {
      const haystack = `${supplier.name} ${supplier.contact_person} ${supplier.email} ${supplier.phone}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [suppliers, search]);

  const persistSuppliers = (next: SupplierRecord[]) => {
    setSuppliers(next);
    writeLocalStorage(STORAGE_KEY, next);
  };

  const saveSupplierToDatabase = async (payload: Partial<SupplierRecord>) => {
    if (!isSupabaseConfigured) return null;

    const dbPayload = {
      id: payload.id || crypto.randomUUID(),
      name: payload.name,
      contact_person: payload.contact_person ?? null,
      phone: payload.phone ?? null,
      whatsapp: payload.whatsapp ?? null,
      email: payload.email ?? null,
      address: payload.address ?? null,
      notes: payload.notes ?? null,
      is_active: Boolean(payload.active),
      updated_at: new Date().toISOString(),
      created_at: payload.created_at ?? new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('suppliers')
      .upsert(dbPayload, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Unable to save supplier to Supabase', error.message);
      return null;
    }

    const row = data?.[0];
    return row ? { ...row, active: Boolean(row.is_active), id: String(row.id) } as SupplierRecord : null;
  };

  const resetForm = () => {
    setForm(emptySupplier);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const trimmed = {
      ...form,
      name: form.name.trim(),
      contact_person: form.contact_person.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
    };

    if (!trimmed.name || !trimmed.phone) {
      return;
    }

    if (editingId) {
      const next = suppliers.map((supplier) =>
        supplier.id === editingId
          ? { ...supplier, ...trimmed, updated_at: new Date().toISOString() }
          : supplier
      );
      const saved = await saveSupplierToDatabase({ ...trimmed, id: editingId, active: trimmed.active });
      persistSuppliers(saved ? next.map((supplier) => supplier.id === editingId ? { ...supplier, ...saved } : supplier) : next);
    } else {
      const newId = crypto.randomUUID();
      const nextSupplier: SupplierRecord = {
        id: newId,
        ...trimmed,
        active: trimmed.active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const saved = await saveSupplierToDatabase({ ...nextSupplier, id: newId, active: trimmed.active });
      persistSuppliers(saved ? [saved as SupplierRecord, ...suppliers] : [nextSupplier, ...suppliers]);
    }

    resetForm();
  };

  const handleEdit = (supplier: SupplierRecord) => {
    setForm({
      id: supplier.id,
      name: supplier.name,
      contact_person: supplier.contact_person,
      phone: supplier.phone,
      whatsapp: supplier.whatsapp,
      email: supplier.email,
      address: supplier.address,
      notes: supplier.notes,
      active: supplier.active,
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('suppliers').delete().eq('id', id);
      if (error) {
        console.error('Unable to delete supplier from Supabase', error.message);
      }
    }

    persistSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    resetForm();
  };

  const toggleActive = async (id: string) => {
    const nextState = suppliers.map((supplier) =>
      supplier.id === id ? { ...supplier, active: !supplier.active, updated_at: new Date().toISOString() } : supplier
    );
    persistSuppliers(nextState);

    if (isSupabaseConfigured) {
      const target = nextState.find((supplier) => supplier.id === id);
      if (target) {
        await supabase.from('suppliers').update({ is_active: target.active, updated_at: new Date().toISOString() }).eq('id', id);
      }
    }
  };

  return (
    <AdminLayout activeTab="suppliers">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-500">Manage supplier profiles and supplier-product relationships</p>
          </div>
          <Button className="bg-[#C4818A] hover:bg-[#B06E77]" onClick={() => resetForm()}>
            <Plus size={16} className="mr-2" />
            Add Supplier
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search supplier, phone, email"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-xs text-gray-500">{supplier.address || 'No address'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-700"><UserRound size={14} /> {supplier.contact_person || '—'}</div>
                        <div className="flex items-center gap-2 text-gray-500"><Phone size={14} /> {supplier.phone || '—'}</div>
                        <div className="flex items-center gap-2 text-gray-500"><Mail size={14} /> {supplier.email || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(supplier.id)}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                            supplier.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {supplier.active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {supplier.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => handleEdit(supplier)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <Pencil size={16} className="text-gray-600" />
                          </button>
                          <button type="button" onClick={() => handleDelete(supplier.id)} className="p-2 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingId ? 'Edit supplier' : 'Add supplier'}</h2>
            <div className="space-y-3">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Supplier name" />
              <Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} placeholder="Contact person" />
              <div className="grid grid-cols-2 gap-3">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
                <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp" />
              </div>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" />
              <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14} /> Address</div>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" />
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Notes"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Active supplier
              </label>
              <div className="flex gap-3 pt-2">
                <Button className="bg-[#C4818A] hover:bg-[#B06E77]" onClick={handleSubmit}>
                  {editingId ? 'Save changes' : 'Create supplier'}
                </Button>
                <Button variant="outline" onClick={resetForm}>Clear</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
