import { frontendClient, serverClient } from "./client";
import { SignInRequest, SignUpRequest, TokenResponse } from "./types";

export async function signIn({ email, password }: SignInRequest): Promise<TokenResponse> {
    const requestBody = {
        username: email,
        password: password
    }
    const response = await serverClient.post('/token', requestBody, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data;
}

export async function signUp({ email, username, password }: SignUpRequest): Promise<TokenResponse> {
    const requestBody = {
        email: email,
        username: username,
        password: password
    }
    const response = await frontendClient.post('/register', requestBody);
    return response.data;
}
