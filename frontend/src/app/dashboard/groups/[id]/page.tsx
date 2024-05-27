'use client';
import { getGroup, inviteUserToGroup, removeUserFromGroup } from '@/api/group-service';
import { GroupView } from '@/api/types';
import { DataTable } from '@/components/expenses/expenses-table';
import { columns as expenseTableCols } from '@/components/expenses/expenses-table/columns';
import { Icons } from '@/components/icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { InviteUserForm } from './components/invite-user';

export default function GroupPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const [group, setGroup] = useState<GroupView>();

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
    console.log('removing user', email)
    removeUserFromGroup(params.id, email).then(async () => {
        const new_group = await getGroup(params.id);
        setGroup(new_group);
        toast.success('User removed successfully', { duration: 5000 });
    })}

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
                                <div className="text-2xl font-bold text-primary">26 €</div>
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
                                <div className="text-2xl font-bold">50 €</div>
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
                                <div className="text-2xl font-bold">24 €</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle>Transactions to clear debt</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col">
                                    <p>
                                        <span className='font-medium'>John Doe</span> pays you <span className='font-medium'>30 €</span>
                                    </p>
                                    <p>
                                        <span className='font-medium'>You</span> pay Ronaldo <span className='font-medium'>30 €</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value='expenses'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle>Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={expenseTableCols} data={group?.expenses} />
                        </CardContent>
                    </Card>
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
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                            <AvatarFallback>{member.username.slice(0, 2)}</AvatarFallback>
                                        </Avatar>
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
