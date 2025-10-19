import {FC, useEffect} from 'react';
import { useLogsStore } from '@/store/logsStore';
import { Card, Text, Group, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    FileText,
    Activity,
    Eye,
    ArrowRight
} from 'lucide-react';

const Dashboard: FC = () => {
    const { logs, addLog } = useLogsStore();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('mobini');
        addLog('PAGE_VIEW', 'Viewed dashboard', 'Dashboard');
    }, [addLog]);

    const stats = [
        {
            title: 'Total Logs',
            value: logs.length.toString(),
            icon: FileText,
            color: 'blue',
        },
        {
            title: 'User Actions',
            value: logs.filter(log => log.page === 'Users').length.toString(),
            icon: Users,
            color: 'green',
        },
        {
            title: 'Page Views',
            value: logs.filter(log => log.action === 'PAGE_VIEW').length.toString(),
            icon: Eye,
            color: 'orange',
        },
        {
            title: 'Recent Activity',
            value: logs.slice(0, 5).length.toString(),
            icon: Activity,
            color: 'purple',
        },
    ];

    const COlOR: Record<string, string> = {
        purple: 'text-purple-600',
        orange: 'text-orange-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} shadow="sm" padding="lg" radius="md" withBorder>
                            <Group justify="space-between">
                                <div>
                                    <Text size="sm" color={stat.color}>
                                        {stat.title}
                                    </Text>
                                    <Text size="xl" fw={500} className={COlOR[stat.color]}>
                                        {stat.value}
                                    </Text>
                                </div>
                                <Icon size={24} className={COlOR[stat.color]} />
                            </Group>
                        </Card>
                    );
                })}
            </div>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="flex justify-between items-center mb-4">
                    <Text size="xl" fw={500}>
                        Recent Activity
                    </Text>
                    <Button
                        variant="outline"
                        size="sm"
                        rightSection={<ArrowRight size={16} />}
                        onClick={() => navigate('/logs')}
                    >
                        View All
                    </Button>
                </div>
                <div className="space-y-3">
                    {logs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                                <Text size="sm" fw={500}>
                                    {log.action}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {log.details} • {log.page}
                                </Text>
                            </div>
                            <Text size="xs" c="dimmed">
                                {log.timestamp.toLocaleString()}
                            </Text>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <Text size="sm" c="dimmed" className="text-center py-4">
                            No activity yet
                        </Text>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
