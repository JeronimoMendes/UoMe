
import { getApiClient } from "./client";
import { CreateGroupRequest, Group } from "./types";

export async function getMyGroups(): Promise<Group[]> {
    const client = await getApiClient('client');
    const response = await client.get('/users/me/groups');
    return response.data;
}

export async function createGroup(newGroup: CreateGroupRequest): Promise<Group> {
    console.log("newGroup", newGroup);
    const client = await getApiClient('client');
    const response = await client.post('/groups', newGroup);
    return response.data;
}
