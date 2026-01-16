'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X, Loader2 } from 'lucide-react';

// Snackbar types
type SnackbarType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface Snackbar {
  id: string;
  type: SnackbarType;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface SnackbarContextValue {
  show: (message: string, type?: SnackbarType) => string;
  showWithAction: (message: string, action: { label: string; onClick: () => void }, type?: SnackbarType) => string;
  dismiss: (id: string) => void;
  update: (id: string, message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const snackbarIcons: Record<SnackbarType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  loading: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
};

const snackbarStyles: Record<SnackbarType, string> = {
  success: 'border-emerald-500/30',
  error: 'border-red-500/30',
  warning: 'border-amber-500/30',
  info: 'border-blue-500/30',
  loading: 'border-blue-500/30',
};

function SnackbarItem({ 
  snackbar, 
  onDismiss 
}: { 
  snackbar: Snackbar; 
  onDismiss: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-gray-900/95 border backdrop-blur-md
        shadow-2xl ${snackbarStyles[snackbar.type]}
      `}
    >
      {snackbarIcons[snackbar.type]}
      <span className="text-sm text-white flex-1">{snackbar.message}</span>
      
      {snackbar.action && (
        <button
          onClick={snackbar.action.onClick}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          {snackbar.action.label}
        </button>
      )}
      
      {snackbar.type !== 'loading' && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </motion.div>
  );
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbars, setSnackbars] = useState<Snackbar[]>([]);

  const show = useCallback((message: string, type: SnackbarType = 'info') => {
    const id = `snackbar-${Date.now()}`;
    setSnackbars((prev) => [...prev, { id, type, message }]);
    
    if (type !== 'loading') {
      setTimeout(() => {
        setSnackbars((prev) => prev.filter((s) => s.id !== id));
      }, 4000);
    }
    
    return id;
  }, []);

  const showWithAction = useCallback((
    message: string,
    action: { label: string; onClick: () => void },
    type: SnackbarType = 'info'
  ) => {
    const id = `snackbar-${Date.now()}`;
    setSnackbars((prev) => [...prev, { id, type, message, action }]);
    
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((s) => s.id !== id));
    }, 6000);
    
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const update = useCallback((id: string, message: string, type?: SnackbarType) => {
    setSnackbars((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, message, type: type ?? s.type }
          : s
      )
    );
  }, []);

  return (
    <SnackbarContext.Provider value={{ show, showWithAction, dismiss, update }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4">
        <AnimatePresence mode="popLayout">
          {snackbars.map((snackbar) => (
            <SnackbarItem
              key={snackbar.id}
              snackbar={snackbar}
              onDismiss={() => dismiss(snackbar.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
