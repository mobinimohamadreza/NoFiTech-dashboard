import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LogEntry } from '@/types';

interface LogsState {
    logs: LogEntry[];
    addLog: (action: string, details: string, page: string) => void;
    clearLogs: () => void;
}

export const useLogsStore = create<LogsState>()(
    persist(
        (set, get) => ({
            logs: [],
            addLog: (action: string, details: string, page: string) => {
                const newLog: LogEntry = {
                    id: crypto.randomUUID(),
                    action,
                    timestamp: new Date(),
                    details,
                    page,
                };
                set({ logs: [newLog, ...get().logs] });
            },
            clearLogs: () => {
                set({ logs: [] });
                localStorage.removeItem('logs-storage');
            },
        }),
        {
            name: 'logs-storage',
        }
    )
);
