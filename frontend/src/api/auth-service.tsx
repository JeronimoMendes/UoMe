import client from "./client";
import { SignInRequest, TokenResponse } from "./types";

export async function signIn({ email, password }: SignInRequest): Promise<TokenResponse> {
    const requestBody = {
        username: email,
        password: password
    }
    const response = await client.post('/token', requestBody, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data;
}
