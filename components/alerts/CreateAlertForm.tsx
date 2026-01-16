// Create alert form component
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Alert } from '@/lib/alerts-store';

type AlertType = Alert['type'];

interface CreateAlertFormProps {
  onSubmit: (alert: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>) => void;
  onCancel: () => void;
}

const alertTypes: { value: AlertType; label: string; description: string }[] = [
  { value: 'whale', label: 'Whale Alert', description: 'Large wallet movements' },
  { value: 'dex', label: 'DEX Trade', description: 'DEX trading activity' },
  { value: 'netflow', label: 'Net Flow', description: 'Token inflow/outflow' },
  { value: 'custom', label: 'Custom', description: 'Custom conditions' },
];

export function CreateAlertForm({ onSubmit, onCancel }: CreateAlertFormProps) {
  const [type, setType] = useState<AlertType>('whale');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wallet, setWallet] = useState('');
  const [token, setToken] = useState('');
  const [threshold, setThreshold] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      type,
      title: title || `${alertTypes.find(t => t.value === type)?.label} Alert`,
      description: description || `Alert for ${type} activity`,
      wallet: wallet || undefined,
      token: token || undefined,
      threshold: threshold ? Number(threshold) : undefined,
      condition: threshold ? condition : undefined,
      enabled: true,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">
          Create New Alert
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Alert Type Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {alertTypes.map((alertType) => (
          <button
            key={alertType.value}
            type="button"
            onClick={() => setType(alertType.value)}
            className={cn(
              'p-4 rounded-lg text-left transition-all border-2',
              type === alertType.value
                ? 'border-primary bg-primary/10'
                : 'border-transparent bg-white/5 hover:bg-white/10'
            )}
          >
            <p className="font-medium text-sm text-text-primary">
              {alertType.label}
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              {alertType.description}
            </p>
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Alert Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My alert"
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What this alert tracks"
        />
        <Input
          label="Wallet Address (optional)"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x..."
        />
        <Input
          label="Token (optional)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ETH, USDC, etc."
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">
            Threshold (optional)
          </label>
          <div className="flex gap-2">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary text-sm"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="Amount in USD"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Alert
        </Button>
      </div>
    </motion.form>
  );
}
