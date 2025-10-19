import {FC, useEffect} from 'react';
import { useLogsStore } from '@/store/logsStore';
import { Card, Text, Group } from '@mantine/core';
import {
    Users,
    FileText,
    Activity,
    Eye,
} from 'lucide-react';

const Dashboard: FC = () => {
    const { logs, addLog } = useLogsStore();

    useEffect(() => {
        console.log('mobini');
        addLog('PAGE_VIEW', 'Viewed dashboard', 'Dashboard');
    }, []);

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
                                    <Text size="sm" c={stat.color}>
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

        </div>
    );
};

export default Dashboard;
