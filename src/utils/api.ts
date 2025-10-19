import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
});

export const mockAuth = {
    login: (email: string, password: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'user@example.com' && password === 'password123') {
                    resolve('user@example.com/password123');
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    },
};
