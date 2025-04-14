import { Group } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteGroup } from "@/api/group-service";
import { useState } from "react";

interface GroupProps {
    group: Group,
    isNew: boolean
}

export function GroupCard({ group, isNew }: GroupProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation
        setIsDeleting(true);
        try {
            await deleteGroup(group.id);
            router.refresh(); // Refresh the page to update the group list
        } catch (error) {
            console.error("Failed to delete group", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="transition hover:scale-105 ease-in-out delay-150 cursor-pointer" onClick={() => router.push(`/dashboard/groups/${group.id}`)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{group.name}</CardTitle>
                {isNew && <Badge className="ml-auto">New</Badge>}
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-sm text-muted-foreground">{group.description}</CardDescription>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </CardContent>
        </Card>
    );
}
