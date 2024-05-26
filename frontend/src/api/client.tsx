import axios, { AxiosError } from 'axios';
import { getSession } from 'next-auth/react';
const SERVER_BASE_URL = process.env.NEXT_PUBLIC__SERVER_API_BASE_URL || 'http://host.docker.internal:8000';
const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL || 'http://localhost:8000';

export const serverClient = axios.create({
    baseURL: SERVER_BASE_URL, // Replace with your API base URL
    timeout: 5000, // Set a timeout value if needed
    headers: {
        'Content-Type': 'application/json', // Set the desired content type
        // Add any additional headers if required
    },
});


export const frontendClient = axios.create({
    baseURL: CLIENT_BASE_URL, // Replace with your API base URL
    timeout: 5000, // Set a timeout value if needed
    headers: {
        'Content-Type': 'application/json', // Set the desired content type
        // Add any additional headers if required
    },
});

export async function getApiClient(side: 'server' | 'client') {
    const client =  side === 'server' ? serverClient : frontendClient;

    if (side === 'client') {
        const session = await getSession();
        if (session && session.user) {
            client.defaults.headers.common['Authorization'] = `Bearer ${session.user.token}`;
        }
    }

    return client;
}

export async function setAuthToken(token: string) {
    serverClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    frontendClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const errorInterceptor = (error: AxiosError) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
    }
    console.log(error.config);

    if (error.status === 401) {
        window.location.replace('/login');
    }
    return Promise.reject(error);
}

serverClient.interceptors.response.use(undefined, errorInterceptor);
