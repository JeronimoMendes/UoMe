export interface SignInRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    image: string | null;
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
    balance: number;
    owed: number;
    owes: number;
    debts: Debt[];
}

export interface Payment {
    amount: number;
    date: string;
    group_id: string;
    user_payee: User;
    user_payer: User;
}

export interface Debt extends Group {
    amount: number;
    user: User
}

export interface CreateGroupRequest {
    name: string;
    description: string;
}

export interface Expense {
    id: string;
    amount: number;
    description: string;
    group_id: string;
    date: string;
    type: string;
    participants: Participant[];
}

export interface Participant {
    user: User;
    amount: string;
}
