
import { getApiClient } from "./client";
import { CreateGroupRequest, Expense, Group, GroupView } from "./types";

export async function getMyGroups(): Promise<Group[]> {
    const client = await getApiClient('client');
    const response = await client.get('/users/me/groups');
    return response.data;
}

export async function getGroup(id: string): Promise<GroupView> {
    const client = await getApiClient('client');
    const response = await client.get(`/groups/${id}`);
    return response.data;
}

export async function createGroup(newGroup: CreateGroupRequest): Promise<Group> {
    const client = await getApiClient('client');
    const response = await client.post('/groups', newGroup);
    return response.data;
}

export async function inviteUserToGroup(groupId: string, email: string): Promise<void> {
    const client = await getApiClient('client');
    await client.post(`/groups/${groupId}/users/${email}`);
}


export async function removeUserFromGroup(groupId: string, email: string): Promise<void> {
    const client = await getApiClient('client');
    await client.delete(`/groups/${groupId}/users/${email}`);
}

export async function addExpense(expense: Expense): Promise<Expense> {
    const client = await getApiClient('client');
    const response = await client.post(`/expenses`, expense);
    return response.data
}

export async function deleteExpense(expenseId: string): Promise<void> {
    const client = await getApiClient('client');
    await client.delete(`/expenses/${expenseId}`);
}

export async function addPayment(groupId: string, payment: { amount: number, date: string, group_id: string, user_payee_id: string, user_payer_id: string }): Promise<Expense> {
    const client = await getApiClient('client');
    const response = await client.post(`/expenses/payment`, payment);
    return response.data
}

export async function getPersonalExpenses(): Promise<Expense[]> {
    const client = await getApiClient('client');
    const response = await client.get('/users/me/expenses');
    return response.data;
}
