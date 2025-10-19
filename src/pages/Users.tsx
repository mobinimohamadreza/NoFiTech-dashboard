import {useState, useMemo, FC, useEffect} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable, getFilteredRowModel, ColumnDef } from '@tanstack/react-table';
import { api } from '@/utils/api';
import { User } from '@/types';
import { useLogsStore } from '@/store/logsStore';
import { TextInput, ActionIcon, Text, Notification, Button } from '@mantine/core';
import { Search, Edit, Trash2, Eye, Check, X } from 'lucide-react';
import { useDebouncedValue } from '@mantine/hooks';
import { Link } from 'react-router-dom';

const Users: FC = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 300);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<User>>({});
    const { addLog } = useLogsStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        addLog('PAGE_VIEW', 'Viewed users page', 'Users');
    }, [addLog]);

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get<User[]>('/users');
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/users/${id}`);
        },
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });
            const previousUsers = queryClient.getQueryData<User[]>(['users']);

            queryClient.setQueryData(['users'], (old: User[] | undefined) =>
                old?.filter(user => user.id !== id) || []
            );

            addLog('USER_DELETE', `Deleted user ID: ${id}`, 'Users');
            return { previousUsers };
        },
        onError: (_err, id, context) => {
            queryClient.setQueryData(['users'], context?.previousUsers);
            addLog('USER_DELETE_FAILED', `Failed to delete user ID: ${id}`, 'Users');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
            const response = await api.patch<User>(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            setEditingId(null);
            setEditData({});
            addLog('USER_UPDATE', `Updated user: ${data.name}`, 'Users');
        },
        onError: (_error, variables) => {
            addLog('USER_UPDATE_FAILED', `Failed to update user ID: ${variables.id}`, 'Users');
        },
    });

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        if (!debouncedSearch) return users;

        return users.filter(user =>
            user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [users, debouncedSearch]);

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => {
                    const user = row.original;
                    if (editingId === user.id) {
                        return (
                            <TextInput
                                value={editData.name || user.name}
                                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                size="xs"
                            />
                        );
                    }
                    return <Text>{user.name}</Text>;
                },
            },
            {
                accessorKey: 'username',
                header: 'Username',
                cell: ({ row }) => {
                    const user = row.original;
                    if (editingId === user.id) {
                        return (
                            <TextInput
                                value={editData.username || user.username}
                                onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                                size="xs"
                            />
                        );
                    }
                    return <Text>{user.username}</Text>;
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }) => {
                    const user = row.original;
                    if (editingId === user.id) {
                        return (
                            <TextInput
                                value={editData.email || user.email}
                                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                                size="xs"
                            />
                        );
                    }
                    return <Text>{user.email}</Text>;
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const user = row.original;
                    const isEditing = editingId === user.id;

                    if (isEditing) {
                        return (
                            <div className="flex space-x-2">
                                <ActionIcon
                                    color="green"
                                    onClick={() => updateMutation.mutate({ id: user.id, data: editData })}
                                    loading={updateMutation.isPending}
                                >
                                    <Check size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    color="red"
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditData({});
                                    }}
                                >
                                    <X size={16} />
                                </ActionIcon>
                            </div>
                        );
                    }

                    return (
                        <div className="flex space-x-2">
                            <Link to={`/user/${user.id}`}>
                                <ActionIcon color="blue">
                                    <Eye size={16} />
                                </ActionIcon>
                            </Link>
                            <ActionIcon
                                color="orange"
                                onClick={() => {
                                    setEditingId(user.id);
                                    setEditData(user);
                                }}
                            >
                                <Edit size={16} />
                            </ActionIcon>
                            <ActionIcon
                                color="red"
                                onClick={() => deleteMutation.mutate(user.id)}
                                loading={deleteMutation.isPending}
                            >
                                <Trash2 size={16} />
                            </ActionIcon>
                        </div>
                    );
                },
            },
        ],
        [editingId, editData, updateMutation, deleteMutation]
    );

    const table = useReactTable({
        data: filteredUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (error) {
        return (
            <div className="p-8 text-center">
                <Notification color="red" title="Error" className="mb-4">
                    Failed to load users. Please try again later.
                </Notification>
                <Button onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Users</h1>
            </div>

            <div className="mb-6">
                <TextInput
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftSection={<Search size={16} />}
                    className="max-w-md"
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <Text>Loading users...</Text>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {!isLoading && filteredUsers.length === 0 && (
                    <div className="p-8 text-center">
                        <Text c="dimmed">No users found</Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
