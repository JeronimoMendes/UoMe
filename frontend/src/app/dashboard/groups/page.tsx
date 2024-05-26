'use client';
import { createGroup, getMyGroups } from '@/api/group-service';
import { Group } from '@/api/types';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreateGroupForm } from './components/create-group-form';
import { GroupCard } from './components/group-card';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroups, setNewGroups] = useState<string[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMyGroups().then(setGroups);
  }, []);

  const submitNewGroup = async ({name, description}: {name: string, description: string}) => {
    const newGroup = await createGroup({ name, description });
    setNewGroups([...newGroups, newGroup.id]);
    setGroups([...groups, newGroup]);
    setOpen(false);
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
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Your Groups
          </h2>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className='!text-sm'>
                <Icons.add /> &nbsp; Group
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create Group</SheetTitle>
                <SheetDescription>
                  Add a new group to your dashboard.
                </SheetDescription>
              </SheetHeader>
              <CreateGroupForm onSubmit={submitNewGroup}/>
            </SheetContent>
          </Sheet>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} isNew={newGroups.includes(group.id)}/>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
