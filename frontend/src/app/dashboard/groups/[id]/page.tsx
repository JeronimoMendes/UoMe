'use client';
import { addExpense, addPayment, deleteExpense, getGroup, inviteUserToGroup, removeUserFromGroup } from '@/api/group-service';
import { GroupView } from '@/api/types';
import { DataTable } from '@/components/expenses/expenses-table';
import { expenseTableCols, paymentTableCols } from '@/components/expenses/expenses-table/columns';
import { Icons } from '@/components/icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserAvatar } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CreateExpenseForm } from './components/create-expense';
import { CreatePaymentForm } from './components/create-payment';
import { InviteUserForm } from './components/invite-user';

export default function GroupPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const [group, setGroup] = useState<GroupView>();
    const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

    useEffect(() => {
        getGroup(params.id).then(setGroup);
    }, [params.id]);

    const handleInviteUser = async (args) => {
        inviteUserToGroup(params.id, args.email).then(async () => {
            const new_group = await getGroup(params.id);
            setGroup(new_group);
            toast.success('User invited successfully', { duration: 5000 });
    })}

    const handleRemoveUser = async (email: string) => {
        removeUserFromGroup(params.id, email).then(async () => {
            const new_group = await getGroup(params.id);
            setGroup(new_group);
            toast.success('User removed successfully', { duration: 5000 });
    })}

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

    const handleAddPayment = async (args) => {
        addPayment(group?.id, {
            amount: args.amount,
            date: args.date,
            group_id: group?.id,
            user_payee_id: args.paidTo,
            user_payer_id: args.paidBy
        }).then(async (newExpense) => {
            toast.success('Payment added successfully', { duration: 5000 });
            const updatedGroup = await getGroup(params.id);
            setGroup(updatedGroup);
            setPaymentDialogOpen(false);
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
        <title>{group?.name}</title>
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-left">
                    <h2 className="text-3xl font-bold tracking-tight">
                        {group?.name}
                    </h2>
                    <h3 className="text-lg font-medium text-muted-foreground">
                        {group?.description}
                    </h3>
                </div>
                <Button className='!text-sm' variant="destructive">
                    <Icons.trash />
                    <span className='hidden sm:block'>&nbsp; Delete</span>
                </Button>
            </div>
            <Tabs defaultValue='overview'>
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='expenses'>Expenses</TabsTrigger>
                    <TabsTrigger value='members'>Members</TabsTrigger>
                    <TabsTrigger value='settings'>Settings</TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='grid gap-4'>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Balance
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                {
                                    group?.balance < 0 ? (
                                        <div className="text-2xl font-bold text-destructive">{formatCurrency(-group?.balance)}</div>
                                    ) : (
                                        <div className="text-2xl font-bold text-primary">{formatCurrency(group?.balance)}</div>
                                    )
                                }
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    You are owed
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(Math.abs(group?.owed))}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">You are owing</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(Math.abs(group?.owes))}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle>Payments to clear debt</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col">
                                    {group?.debts.map((debt) => (
                                        debt.amount > 0 ? (
                                            <div key={debt.user.email} className="flex items-center my-2">
                                                <UserAvatar user={debt.user} className="h-9 w-9" />
                                                <div className="ml-4 space-y-1 flex-grow">
                                                    <p className="text-sm font-medium leading-none text-left">{debt.user.username}</p>
                                                    <p className="text-sm text-muted-foreground text-left">
                                                        Needs to pay you {formatCurrency(debt.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={debt.user.email} className="flex items-center my-2">
                                                <UserAvatar user={debt.user} className="h-9 w-9" />
                                                <div className="ml-4 space-y-1 flex-grow">
                                                    <p className="text-sm font-medium leading-none text-left">{debt.user.username}</p>
                                                    <p className="text-sm text-muted-foreground text-left">
                                                        You need to pay {formatCurrency(-debt.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className='!text-sm'>
                                            <Icons.add />
                                            <span className='hidden sm:block'>&nbsp; Register payment</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Register payment</DialogTitle>
                                            <DialogDescription>
                                                Create new payment to clear debt
                                            </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className='h-96'>
                                            <CreatePaymentForm group={group} user={session.user} onSubmit={handleAddPayment} className="p-4" />
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value='expenses'>
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
                                        Add a new expense to the group
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className='h-96'>
                                    <CreateExpenseForm group={group} user={session.user} onSubmit={handleAddExpense} className="p-4" />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div>
                        <DataTable columns={expenseTableCols} data={group?.expenses.map((expense: Expense) => {return {...expense, delete: () => handleDeleteExpense(expense.id)}})}/>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
                    <div>
                        <DataTable columns={paymentTableCols} data={group?.payments}/>
                    </div>
                </TabsContent>

                <TabsContent value='members' className='grid gap-4 md:grid-cols-1 lg:grid-cols-2'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle>Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {group?.members.map((member) => (
                                    <div key={member.id} className="flex items-center">
                                        <UserAvatar user={member} className="h-9 w-9" />
                                        <div className="ml-4 space-y-1 flex-grow">
                                            <p className="text-sm font-medium leading-none text-left">{member.username}</p>
                                            <p className="text-sm text-muted-foreground text-left">
                                                {member.email}
                                            </p>
                                        </div>
                                        {member.id !== session?.user?.id && (
                                            <div className='ml-auto'>
                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        <Button className="!text-sm ml-auto" variant="destructive">
                                                            <Icons.trash />
                                                            <span className="hidden sm:block">&nbsp; Remove</span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Do you really want to remove <span className='font-bold'>{member.username}</span> from the group?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={() => handleRemoveUser(member.email)}>
                                                                        <Icons.trash />
                                                                        <span >&nbsp; Remove</span>
                                                                </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='h-min'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle>
                                Add member
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InviteUserForm onSubmit={(email) => handleInviteUser(email)} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </ScrollArea>
  );
}
