import { Group } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
interface GroupProps {
    group: Group,
    isNew: boolean
}

export function GroupCard({group, isNew}: GroupProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-smfont-medium">{group.name}</CardTitle>
                {isNew && <Badge className="ml-auto">New</Badge>}
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-sm text-muted-foreground">{group.description}</CardDescription>
            </CardContent>
        </Card>
    )
}
