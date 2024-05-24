import { Group } from "@/api/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function GroupCard({ group }: { group: Group }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-smfont-medium">{group.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-sm text-muted-foreground">{group.description}</CardDescription>
            </CardContent>
        </Card>
    )
}
