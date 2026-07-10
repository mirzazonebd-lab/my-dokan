'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Address, BANGLADESH_DISTRICTS, DEMO_ADDRESSES } from '@/lib/demo-data';
import AccountLayout from '../AccountShell';
import ClientWrapper from '@/components/ClientWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ADDRESSES_STORAGE_KEY = 'beautydokanbd_addresses';

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    district: 'Dhaka',
    postal_code: '',
  });

  useEffect(() => {
    if (!user) return;

    const storedAddresses = localStorage.getItem(ADDRESSES_STORAGE_KEY);
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    } else {
      setAddresses(DEMO_ADDRESSES);
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(DEMO_ADDRESSES));
    }
    setLoading(false);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingAddress) {
      const updated = addresses.map(a =>
        a.id === editingAddress.id ? { ...a, ...formData } : a
      );
      setAddresses(updated);
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        postal_code: formData.postal_code || null,
        is_default: addresses.length === 0,
        created_at: new Date().toISOString(),
      };
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    }

    setDialogOpen(false);
    setEditingAddress(null);
    setFormData({ name: '', phone: '', address: '', city: '', district: 'Dhaka', postal_code: '' });
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      postal_code: address.postal_code || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
  };

  const setDefault = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      is_default: a.id === id
    }));
    setAddresses(updated);
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <ClientWrapper>
      <AccountLayout activeTab="addresses">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <MapPin size={24} className="text-[#C4818A]" />
            Address Book
          </h1>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAddress(null);
                setFormData({ name: '', phone: '', address: '', city: '', district: 'Dhaka', postal_code: '' });
              }}>
                <Plus size={16} className="mr-1" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <Input
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">District</label>
                    <select
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200"
                    >
                      {BANGLADESH_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <Input
                    value={formData.postal_code}
                    onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-[#C4818A] hover:bg-[#B06E77]">
                  {editingAddress ? 'Save Changes' : 'Add Address'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-[#C4818A] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-500">Add a shipping address for faster checkout.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map(address => (
              <div
                key={address.id}
                className={`border-2 rounded-xl p-4 ${
                  address.is_default ? 'border-[#C4818A] bg-rose-50' : 'border-gray-100'
                }`}
              >
                {address.is_default && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#C4818A] text-white px-2 py-0.5 rounded-full mb-2">
                    <Check size={10} /> Default
                  </span>
                )}

                <p className="font-medium">{address.name}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
                <p className="text-sm text-gray-500">{address.address}</p>
                <p className="text-sm text-gray-500">{address.city}, {address.district}</p>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>
                  {!address.is_default && (
                    <Button variant="outline" size="sm" onClick={() => setDefault(address.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </AccountLayout>
    </ClientWrapper>
  );
}
