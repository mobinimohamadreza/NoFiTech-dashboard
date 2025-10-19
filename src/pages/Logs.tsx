import {FC, useEffect, useMemo, useState} from 'react';
import { useLogsStore } from '@/store/logsStore';
import { Card, Text, Button, Group, Pagination } from '@mantine/core';
import { Trash2 } from 'lucide-react';

const Logs: FC = () => {
    const { logs, clearLogs, addLog } = useLogsStore();
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;
    console.log(logs)
    useEffect(() => {
        addLog('PAGE_VIEW', 'Viewed logs page', 'Logs');
    }, [addLog]);

    const { currentLogs, totalPages } = useMemo(() => {
        const totalPagesCalc = Math.ceil(logs.length / logsPerPage) || 1;
        const startIndex = (currentPage - 1) * logsPerPage;
        const endIndex = startIndex + logsPerPage;
        return {
            currentLogs: logs.slice(startIndex, endIndex),
            totalPages: totalPagesCalc,
        };
    }, [logs, currentPage]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <h1 className="text-3xl font-bold text-gray-800">Activity Logs</h1>
                </div>
                <Button
                    color="red"
                    leftSection={<Trash2 size={16} />}
                    onClick={clearLogs}
                    disabled={logs.length === 0}
                >
                    Clear All Logs
                </Button>
            </div>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <div className="space-y-3">
                    {currentLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-1">
                                    <Text size="sm" fw={500} className="capitalize">
                                        {log.action.replace(/_/g, ' ').toLowerCase()}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {log.page}
                                    </Text>
                                </div>
                                <Text size="sm" c="dimmed">
                                    {log.details}
                                </Text>
                            </div>
                            <Text size="xs" c="dimmed" className="whitespace-nowrap ml-4">
                                {log.timestamp.toLocaleString()}
                            </Text>
                        </div>
                    ))}

                    {logs.length === 0 && (
                        <Text size="sm" c="dimmed" className="text-center py-8">
                            No activity logs yet
                        </Text>
                    )}
                </div>

                {totalPages > 1 && (
                    <Group justify="center" mt="xl">
                        <Pagination
                            value={currentPage}
                            onChange={setCurrentPage}
                            total={totalPages}
                        />
                    </Group>
                )}
            </Card>
        </div>
    );
};

export default Logs;
