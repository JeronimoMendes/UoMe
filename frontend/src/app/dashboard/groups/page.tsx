
// import { CalendarDateRangePicker } from '@/components/date-range-picker';
// import { Overview } from '@/components/overview';
// import { RecentSales } from '@/components/recent-sales';
'use client';
import { getMyGroups } from '@/api/group-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { GroupCard } from './components/group-card';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getMyGroups().then(setGroups);
  }, []);
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
        <h2 className="text-3xl font-bold tracking-tight">
          Your Groups
        </h2>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
