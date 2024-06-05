"use client"
import { GroupView, User } from "@/api/types";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    amount: z.coerce.number().positive(),
    date: z.date().min(new Date("1900-01-01")),
    paidBy: z.string().min(1),
    paidTo: z.string().min(1).refine((value) => value !== formSchema.shape.paidBy, { message: "Paid by and paid to cannot be the same user" })
});

interface InviteUserFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onSubmit: SubmitHandler<{
        amount: number;
        date: string;
        paidBy: string;
        paidtTo: string;
    }>,
    group: GroupView,
    user: User,
}

function CreatePaymentForm({ className, group, user, onSubmit, ...props }: InviteUserFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            date: new Date(),
            paidBy: user?.email,
        },
    });

    function handleSubmit(data: z.infer<typeof formSchema>) {
        const userID = group.members.filter((member) => member.email === user.email)[0].id;
        if (data.paidBy !== userID && data.paidTo !== userID) {
            toast.error("You must be either the payer or the payee");
            return;
        } else {
         onSubmit(data);
        }
    }

    return (
        <div className={className}>
            <Form {...form}>
                <form id="expense-form" className="grid gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 dark:text-gray-400">€</span>
                                    </div>
                                    <Input className="pl-7" id="amount" min="0" placeholder="0.00" step="0.01" type="number" {...field}/>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="paidBy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paid by</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user"/>
                                        </SelectTrigger>
                                    <SelectContent>
                                        {group.members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.email === user.email ? "You" : member.username}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="paidTo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paid to</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user"/>
                                        </SelectTrigger>
                                    <SelectContent>
                                        {group.members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.email === user.email ? "You" : member.username}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='!text-sm w-min'>Create</Button>
                </form>
            </Form>
        </div>
    )
}

export { CreatePaymentForm };
