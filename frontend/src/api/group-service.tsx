
import { getApiClient } from "./client";

export async function getMyGroups() {
    const client = await getApiClient('client');
    const response = await client.get('/users/me/groups');
    return response.data;
}
