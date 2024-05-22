export interface SignInRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}
