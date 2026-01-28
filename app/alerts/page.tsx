// Alerts page - rebuilt with new components
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, BellOff } from 'lucide-react';
import { AlertCard, CreateAlertForm } from '@/components/alerts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { useAlertsStore, Alert } from '@/lib/alerts-store';

type AlertFilter = 'all' | 'whale' | 'dex' | 'netflow' | 'custom';

export default function AlertsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState<AlertFilter>('all');
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  
  const { 
    alerts, 
    addAlert, 
    updateAlert, 
    removeAlert, 
    toggleAlert 
  } = useAlertsStore();

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter);

  const enabledCount = alerts.filter(a => a.enabled).length;

  const handleCreateAlert = (alertData: Omit<Alert, 'id' | 'createdAt' | 'triggerCount'>) => {
    addAlert(alertData);
    setShowCreateForm(false);
  };

  const handleEditAlert = (alert: Alert) => {
    setEditingAlert(alert);
    // For now, just toggle - could open edit modal
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      removeAlert(id);
    }
  };

  return (
    <div className="container-main py-8 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              Alerts
            </h1>
          </div>
          <p className="text-text-secondary">
            Get notified when smart money makes moves
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-text-tertiary">
            {enabledCount}/{alerts.length} active
          </span>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Alert
          </Button>
        </div>
      </motion.div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateAlertForm
            onSubmit={handleCreateAlert}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs
          tabs={[
            { id: 'all', label: `All (${alerts.length})` },
            { id: 'whale', label: '🐋 Whale' },
            { id: 'dex', label: '📊 DEX' },
            { id: 'netflow', label: '💸 Netflow' },
            { id: 'custom', label: '⚙️ Custom' },
          ]}
          activeTab={filter}
          onChange={(id) => setFilter(id as AlertFilter)}
        />
      </motion.div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <EmptyState
              icon={<BellOff className="w-16 h-16" />}
              title={filter === 'all' ? 'No alerts yet' : `No ${filter} alerts`}
              description={
                filter === 'all'
                  ? 'Create your first alert to get notified about smart money activity'
                  : `You haven't created any ${filter} alerts yet`
              }
              action={
                <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Alert
                </Button>
              }
            />
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onToggle={toggleAlert}
                onEdit={handleEditAlert}
                onDelete={handleDeleteAlert}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tips Section */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-primary mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Set whale alerts for wallets with high win rates</li>
              <li>• Monitor netflows to spot accumulation patterns</li>
              <li>• Combine multiple alert types for comprehensive coverage</li>
              <li>• Use custom alerts for specific token movements</li>
            </ul>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
