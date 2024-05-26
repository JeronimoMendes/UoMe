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

export interface SignUpRequest {
    email: string;
    username: string;
    password: string;
}

export interface Group {
    id: string,
    name: string,
    description: string,
    created_at: string,
}

export interface GroupView extends Group {
    members: User[];
    expenses: Expense[];
}

export interface CreateGroupRequest {
    name: string;
    description: string;
}

export interface Expense {
    id: string;
    amount: number;
    description: string;
    date: string;
    type: string;
    participant: Participant[];
}

export interface Participant {
    user_id: string;
    amount: string;
}
