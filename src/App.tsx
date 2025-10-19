import {FC, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Layout from '@/components/Layout/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import UserDetail from '@/pages/UserDetail';
import Logs from '@/pages/Logs';
import { useLogsStore } from '@/store/logsStore';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const routes = [
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/users', element: <Users /> },
    { path: '/user/:id', element: <UserDetail /> },
    { path: '/logs', element: <Logs /> },
];

const AppContent: FC = () => {
    const { addLog } = useLogsStore();

    useEffect(() => {
        addLog('PAGE_VIEW', 'Application initialized', 'App');
    }, [addLog]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <ProtectedRoute>
                                <Layout>{route.element}</Layout>
                            </ProtectedRoute>
                        }
                    />
                ))}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

const App: FC = () => (
    <QueryClientProvider client={queryClient}>
        <MantineProvider>
            <Notifications />
            <AppContent />
            <ReactQueryDevtools initialIsOpen={false} />
        </MantineProvider>
    </QueryClientProvider>
);

export default App;
