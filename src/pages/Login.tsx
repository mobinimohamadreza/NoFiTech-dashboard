import {FC} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLogsStore } from '@/store/logsStore';
import { mockAuth } from '@/utils/api';
import {TextInput, Button, Notification} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: FC = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { addLog } = useLogsStore();
    const [loading, { open: startLoading, close: stopLoading }] = useDisclosure(false);
    const [showError, { open: showErrorNotification, close: hideErrorNotification }] = useDisclosure(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'user@example.com',
            password: 'password123',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        startLoading();
        try {
            const token = await mockAuth.login(data.email, data.password);
            login(token);
            addLog('LOGIN', `User logged in: ${data.email}`, 'Auth');
            navigate('/dashboard');
        } catch (error) {
            showErrorNotification();
            addLog('LOGIN_FAILED', `Failed login attempt: ${data.email}`, 'Auth');
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="min-h-screen  bg-gradient-to-br from-blue-700 to-blue-300 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-blue-100 p-4 rounded-lg">
                    Login to Dashboard
                </h1>

                {showError && (
                    <Notification
                        color="red"
                        title="Login Failed"
                        onClose={hideErrorNotification}
                        className="mb-4"
                    >
                        Invalid email or password
                    </Notification>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextInput
                        label="Email"
                        type="email"
                        placeholder="user@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <TextInput
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Button
                        type="submit"
                        loading={loading}
                        fullWidth
                        className="mt-4"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 text-center">
                        <div>Email: user@example.com</div>
                        <div>Password: password123</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
