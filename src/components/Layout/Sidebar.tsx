import {FC} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLogsStore } from '@/store/logsStore';
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut
} from 'lucide-react';
import {Button} from "@mantine/core";

const Sidebar: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const { addLog } = useLogsStore();

    const handleLogout = () => {
        logout();
        addLog('LOGOUT', 'User logged out', 'Auth');
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/users', icon: Users, label: 'Users' },
        { path: '/logs', icon: FileText, label: 'Logs' },
    ];

    return (
        <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <div className="mb-8">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
                <Button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 w-full"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
