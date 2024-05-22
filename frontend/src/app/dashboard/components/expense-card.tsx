import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Expense } from "@/types";

interface ExpenseCardProps {
    expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
    const date = new Date(expense.createdAt);
    const nowDate = new Date();
    const diff = nowDate.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    let dateText = '';
    if (days === 0) {
        dateText = 'Today';
    } else if (days === 1) {
        dateText = 'Yesterday';
    } else {
        dateText = date.toLocaleDateString();
    }
    return (
        <div className="flex items-center">
            <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>{expense.author[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 flex-grow">
                <p className="text-sm font-medium leading-none text-left">{expense.author}</p>
                <p className="text-sm text-muted-foreground text-left">
                    {expense.description}
                </p>
            </div>
            <div className="ml-auto space-y-2 text-right">
                <p className="text-sm font-medium leading-none">{expense.amount} €</p>
                <p className="text-sm text-muted-foreground">{dateText}</p>
            </div>
        </div>
    );
}
