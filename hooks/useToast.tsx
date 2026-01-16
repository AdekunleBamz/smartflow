// Toast context and hook
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastType } from '@/components/ui/Toast';
import { generateId } from '@/lib/utils';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, title?: string) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, type, message, title }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message: string, title?: string) => {
    addToast('success', message, title);
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast('error', message, title);
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast('warning', message, title);
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast('info', message, title);
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
