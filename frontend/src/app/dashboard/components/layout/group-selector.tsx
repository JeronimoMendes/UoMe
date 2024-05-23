'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Group } from "@/types";

type GroupSelectorProps = {
    groups: Group[];
    selected: string;
    setSelected: (name: string) => void;
};

export function GroupSelector({ groups, selected, setSelected }: GroupSelectorProps) {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={selected} />
            </SelectTrigger>
            <SelectContent>
                {groups.map((group) => {
                    return <SelectItem key={group.name} value={group.name} onSelect={() => setSelected(group.name)}>
                        {group.name}
                    </SelectItem>
                })}
            </SelectContent>
        </Select>
    );
}
