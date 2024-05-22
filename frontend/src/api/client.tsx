import axios, { AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://host.docker.internal:8000';

const client = axios.create({
    baseURL: BASE_URL, // Replace with your API base URL
    timeout: 5000, // Set a timeout value if needed
    headers: {
        'Content-Type': 'application/json', // Set the desired content type
        // Add any additional headers if required
    },
});

client.interceptors.response.use(undefined, (error: AxiosError) => {
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
    return Promise.reject(error);
});

export default client;
