'use client';
import { addExpense, deleteExpense, getGroup, getPersonalExpenses } from '@/api/group-service';
import { Expense } from '@/api/types';
import { DataTable } from '@/components/expenses/expenses-table';
import { personalExpensesCols } from '@/components/expenses/expenses-table/columns';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-time-picker';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { CreateExpenseForm } from './components/create-expense';


export default function PersonalExpensesPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>()

    useEffect(() => {
        getPersonalExpenses().then((expenses) => {
            setExpenses(expenses);
            setFilteredExpenses(expenses);
        })
    }, []);

    useEffect(() => {
        // Filter expenses by date range
        if (dateRangeFilter) {
            const filtered = expenses.filter((expense) => {
                const date = new Date(expense.date);
                return (!dateRangeFilter.from || date >= dateRangeFilter.from) && (!dateRangeFilter.to || date <= dateRangeFilter.to);
            });
            setFilteredExpenses(filtered);
        } else {
            setFilteredExpenses(expenses);
        }
    }, [dateRangeFilter, expenses])

    const handleAddExpense = async (args) => {
        const expense = {
            group_id: params.id,
            amount: args.amount,
            description: args.description,
            date: args.date,
            type: args.type,
            participants: args.splitParts.map((part) => ({
                user_id: group?.members.find((member) => member.email === part.user)?.id,
                amount: part.amount
            }))
        }
        addExpense(expense).then(async (newExpense) => {
            setExpenseDialogOpen(false);
            setGroup(group => ({
                ...group,
                expenses: [newExpense, ...group.expenses]
            }))
            toast.success('Expense added successfully', { duration: 5000 });
        })
    }

    const handleDeleteExpense = async (id: string) => {
        deleteExpense(id).then(async () => {
            const new_group = await getGroup(params.id);
            setGroup(new_group);
            toast.success('Expense deleted successfully', { duration: 5000 });
        })
    }

    if (status === 'loading') {
        // TODO: eventually fix hydration issue on LoadingSkeleton and uncomment
        // return <LoadingSkeleton />
        return <></>
    }

    if (status === 'unauthenticated') {
        redirect('/login');
    }


  return (
    <ScrollArea className="h-full">
        <title>Personal expenses</title>
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 ">
            <Tabs defaultValue='overview' className='space-y-4'>
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='analysis'>Analysis</TabsTrigger>
                </TabsList>

                <div>
                    <DateRangePicker
                        onUpdate={(values) => setDateRangeFilter(values.range)}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                        ignoreInitial={true}
                    />
                </div>
                <TabsContent value='overview'>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
                        <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className='!text-sm'>
                                    <Icons.add />
                                    <span className='hidden sm:block'>&nbsp; Add</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add expense</DialogTitle>
                                    <DialogDescription>
                                        Add a new expense
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className='h-96'>
                                    <CreateExpenseForm user={session.user} onSubmit={handleAddExpense} className="p-4" />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div>
                        <DataTable columns={personalExpensesCols} data={filteredExpenses?.map((expense: Expense) => {return {...expense, delete: () => handleDeleteExpense(expense.id), user: session?.user}})}/>
                    </div>
                </TabsContent>

                <TabsContent value='analysis' className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
                </TabsContent>
            </Tabs>
        </div>
    </ScrollArea>
  );
}
