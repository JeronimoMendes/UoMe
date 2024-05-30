"use client"
import { GroupView, User } from "@/api/types";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultiSelectFormField from "@/components/ui/multi-select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SplitForm, { Split } from "@/components/ui/split-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    description: z.string().min(1),
    amount: z.coerce.number().positive(),
    date: z.date().min(new Date("1900-01-01")),
    paidBy: z.string().min(1),
    splitBetween: z.array(z.string()).min(1),
    type: z.string().min(1),
    splitParts: z.array(z.object({
        user: z.string().min(1),
        amount: z.number(),
    })).min(1),
});

interface InviteUserFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onSubmit: SubmitHandler<{
        description: string;
        amount: number;
        date: string;
        paidBy: string;
        type: string;
        splitBetween: string[];
        splitParts: {
            amount: number;
            user: string;
        }[];
    }>,
    group: GroupView,
    user: User,
}

const typeOptions = [
    { label: "Food", value: "Food" },
    { label: "Rent", value: "Rent" },
    { label: "Water", value: "Water" },
    { label: "Electricity", value: "Electricity" },
    { label: "Internet", value: "Internet" },
    { label: "Laundry", value: "Laundry" },
    { label: "Groceries", value: "Groceries" },
    { label: "Transport", value: "Transport" },
    { label: "Health", value: "Health" },
    { label: "Household", value: "Household"},
    { label: "Pets", value: "Pets" },
    { label: "Clothing", value: "Clothing" },
    { label: "Gifts", value: "Gifts" },
    { label: "Education", value: "Education" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Loan", value: "Loan" },
    { label: "Payment", value: "Payment" },
    { label: "Savings", value: "Savings" },
    { label: "Technology", value: "Technology" },
    { label: "Other", value: "Other" },
]

function CreateExpenseForm({ className, group, user, onSubmit, ...props }: InviteUserFormProps) {
    const defaultSplitBetween = group?.members.map((member) => member.email) ?? [user?.email];
    const splitsRef = useRef<Split[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            amount: 0,
            date: new Date(),
            paidBy: user?.email,
            splitBetween: defaultSplitBetween,
            type: "",
            splitParts: [
                {
                    user: user?.email,
                    amount: 0,
                },
            ],
        },
    });

    function handleSubmit(data: z.infer<typeof formSchema>) {
        console.log("inside handlesbimitqwtw", data)
        const splitParts = splitsRef.current.map((split) => {
            return {
                user: split.user,
                amount: split.user === data.paidBy ? -data.amount : split.amount,
            }
        });
        form.trigger().then((isValid) => {
            console.log("after trigger", isValid)
            if (!isValid) {
                form.setValue("splitParts", splitParts);
                return;
            }
            onSubmit({ ...data, splitParts });
        });
    }

    return (
        <div className={className}>
            <Form {...form}>
                <form id="expense-form" className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input id="description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value
                                                ? typeOptions.find(
                                                    (type) => type.value === field.value
                                                )?.label
                                                : "Select type"}
                                            <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search type..." />
                                            <CommandEmpty>No language found.</CommandEmpty>
                                            <CommandList>
                                                <CommandGroup>
                                                {typeOptions.map((type) => (
                                                    <CommandItem
                                                    value={type.label}
                                                    key={type.value}
                                                    onSelect={() => {
                                                        form.setValue("type", type.value)
                                                    }}
                                                    >
                                                    <Icons.check
                                                        className={cn(
                                                        "mr-2 h-4 w-4",
                                                        type.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                    />
                                                    {type.label}
                                                    </CommandItem>
                                                ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
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
                                            <SelectItem key={member.id} value={member.email}>
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
                        name="splitBetween"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Split between</FormLabel>
                                    <FormControl>
                                        <MultiSelectFormField
                                            options={group.members.map((member) => {
                                                return {
                                                    label: member.email === user.email ? "You" : member.username,
                                                    value: member.email,
                                                };
                                            })}
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select users to split between"
                                            variant="inverted"
                                        />
                                    </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
                <FormField
                    control={form.control}
                    name="splitParts"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Split parts</FormLabel>
                            <SplitForm users={form.getValues().splitBetween.map((userEmail) => {
                                const member = group.members.find((member) => member.email === userEmail);
                                return {
                                    value: member?.email,
                                    label: member?.email === user.email ? "You" : member?.username,
                                }
                            })} amount={form.getValues().amount} onValueChange={(newSplits: Split[]) => (splitsRef.current = newSplits)} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='!text-sm w-min' onClick={() => handleSubmit(form.getValues())}>Add</Button>
            </Form>
        </div>
    )
}

export { CreateExpenseForm };
