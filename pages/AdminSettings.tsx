
import React, { useEffect, useState } from 'react';
import { DB } from '../store';
import { Input, Button, Field } from '../components/ui-components';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    contactPhone: '',
    contactEmail: '',
    shippingInner: 70,
    shippingOuter: 120,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSettings(DB.getSettings());
  }, []);

  const handleSave = () => {
    setLoading(true);
    DB.saveSettings(settings);
    setTimeout(() => {
      setLoading(false);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#1C2434] uppercase tracking-tight">Store Settings</h2>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Configure your global shop rules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3C50E0] border-b pb-3">General Details</h3>
          <div className="space-y-4">
            <Field label="Store Name">
              <Input 
                value={settings.storeName}
                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
              />
            </Field>
            <Field label="Contact Phone">
              <Input 
                value={settings.contactPhone}
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </Field>
            <Field label="Support Email">
              <Input 
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#3C50E0] border-b pb-3">Shipping Fees (Tk)</h3>
          <div className="space-y-4">
            <Field label="Inside Dhaka">
              <Input 
                type="number"
                value={settings.shippingInner}
                onChange={e => setSettings({ ...settings, shippingInner: Number(e.target.value) })}
              />
            </Field>
            <Field label="Outside Dhaka">
              <Input 
                type="number"
                value={settings.shippingOuter}
                onChange={e => setSettings({ ...settings, shippingOuter: Number(e.target.value) })}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <Button 
          onClick={handleSave}
          disabled={loading}
          className="h-12 px-10 rounded-xl shadow-lg bg-[#1C2434] hover:bg-[#3C50E0]"
        >
          {loading ? 'Processing...' : 'Save Global Changes'}
        </Button>
        {message && <span className="text-green-600 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-left duration-300">{message}</span>}
      </div>
    </div>
  );
};

export default AdminSettings;
