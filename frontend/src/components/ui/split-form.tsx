import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
interface SplitFormProps {
    users: {
        value: string;
        label: string;
    }[],
    amount: number,
    onValueChange: (value: Split[]) => void;
}

type SplitType = "percentage" | "amount";

interface Split {
    user: string;
    amount: number;
}

function PercentageInput(value: number, amount: number, user: string, onValueChange: (value: string, user: string) => void) {
    function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newAmount = parseFloat(event.target.value) * 0.01 * amount;
        onValueChange(newAmount.toFixed(2), user);
    }
    return (
        <div className="flex items-center">
            <Input onChange={(event) => handleValueChange(event)} type="number" value={amount > 0 ? (value / amount * 100).toFixed(2) : "0"} max="100" min="0" step="0.01" className="w-min text-right"/>
            <span className="select-unit pl-2">%</span>
        </div>
    )
}

function AmountInput(value: number, user: string, onValueChange: (value: string, user: string) => void) {
    function handleValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        onValueChange(event.target.value, user);
    }
    return (
        <div className="flex items-center">
            <Input onChange={(event) => handleValueChange(event)} type="number" value={value.toString() || "0"} min="0" step="0.01"/>
            <span className="select-unit pl-2">$</span>
        </div>
    )
}


export default function SplitForm({
    users,
    amount,
    onValueChange
} : SplitFormProps) {
    const [splitType, setSplitType] = useState<string>("percentage")
    const splitsRef = useRef<Split[]>(users.map(user => ({
        user: user.value,
        amount: amount / users.length
    })));
    const [splits, setSplits] = useState<Split[]>(splitsRef.current);


    useEffect(() => {
        const defaultAmount = users.length > 0 ? amount / users.length : 0;
        splitsRef.current  = users.map((user) => {
            return {
                user: user.value,
                amount: Number(defaultAmount.toFixed(2))
            }
        })
        setSplits(Array.from(splitsRef.current));
        console.log("inside handleValueChange", splitsRef.current)
        onValueChange(Array.from(splitsRef.current));
    }, [amount, users])

    const handleValueChange = (value: string, user: string) => {
        splitsRef.current = splitsRef.current.map((split) => {
            if (split.user === user) {
                return {
                    user,
                    amount: parseFloat(value)
                }
            }
            return split;
        })
        setSplits(Array.from(splitsRef.current));
        console.log("inside handleValueChange", splitsRef.current)
        onValueChange(Array.from(splitsRef.current));
    }

    return (
        <div className="max-w-sm">
            <div className="flex items-center py-1 justify-between w-min">
                <Select defaultValue="percentage" onValueChange={setSplitType}>
                    <SelectTrigger>
                        <SelectValue placeholder="%"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="amount">1.23...</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {users.map((user) => {
                const split = splits.find((split) => split.user === user.value);
                return (
                    <div className="flex items-center py-1 justify-between" key={user.value}>
                        <p className="text-sm">{user.label}</p>
                        {splitType === "percentage" ? PercentageInput(split?.amount, amount, user.value, handleValueChange) : AmountInput(split?.amount, user.value, handleValueChange)}
                    </div>
                )
            })}
        </div>
    )
}
