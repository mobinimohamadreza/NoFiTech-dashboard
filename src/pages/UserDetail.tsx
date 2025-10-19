import {FC, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {api} from '@/utils/api';
import {User} from '@/types';
import {useLogsStore} from '@/store/logsStore';
import {Button, Card, Group, LoadingOverlay, Text} from '@mantine/core';
import {ArrowLeft, Building, Globe, Mail, MapPin, Phone} from 'lucide-react';

const UserDetail: FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {addLog} = useLogsStore();

    const {data: user, isLoading, error} = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await api.get<User>(`/users/${id}`);
            return response.data;
        },
    });

    useEffect(() => {
            addLog('USER_VIEW', `Viewed user: ${user?.name}`, 'UserDetail');
    }, [addLog]);


    if (isLoading) {
        return <LoadingOverlay visible/>;
    }

    if (error || !user) {
        return (
            <div className="text-center py-8">
                <Text color="red">User not found</Text>
                <Button onClick={() => navigate('/users')} className="mt-4">
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6">
                <Button
                    variant="outline"
                    onClick={() => navigate('/users')}
                    leftSection={<ArrowLeft size={16}/>}
                >
                    Back to Users
                </Button>
                <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="xl" fw={500} mb="md">
                        Personal Information
                    </Text>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Name:</Text>
                        <Text>{user.name}</Text>
                    </Group>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Username:</Text>
                        <Text>@{user.username}</Text>
                    </Group>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Email:</Text>
                        <Group gap="xs">
                            <Mail size={16}/>
                            <Text>{user.email}</Text>
                        </Group>
                    </Group>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Phone:</Text>
                        <Group gap="xs">
                            <Phone size={16}/>
                            <Text>{user.phone}</Text>
                        </Group>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={500}>Website:</Text>
                        <Group gap="xs">
                            <Globe size={16}/>
                            <Text>{user.website}</Text>
                        </Group>
                    </Group>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="xl" fw={500} mb="md">
                        Address
                    </Text>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Street:</Text>
                        <Text>{user.address.street}</Text>
                    </Group>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Suite:</Text>
                        <Text>{user.address.suite}</Text>
                    </Group>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>City:</Text>
                        <Group gap="xs">
                            <MapPin size={16}/>
                            <Text>{user.address.city}</Text>
                        </Group>
                    </Group>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Zipcode:</Text>
                        <Text>{user.address.zipcode}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={500}>Coordinates:</Text>
                        <Text size="sm">
                            {user.address.geo.lat}, {user.address.geo.lng}
                        </Text>
                    </Group>
                </Card>

                <Card shadow="sm" padding="lg" radius="md" withBorder className="lg:col-span-2">
                    <Text size="xl" fw={500} mb="md">
                        Company Information
                    </Text>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Company:</Text>
                        <Group gap="xs">
                            <Building size={16}/>
                            <Text>{user.company.name}</Text>
                        </Group>
                    </Group>
                    <Group justify="space-between" mb="xs">
                        <Text fw={500}>Catch Phrase:</Text>
                        <Text>{user.company.catchPhrase}</Text>
                    </Group>
                    <Group justify="space-between">
                        <Text fw={500}>Business:</Text>
                        <Text>{user.company.bs}</Text>
                    </Group>
                </Card>
            </div>
        </div>
    );
};

export default UserDetail;
