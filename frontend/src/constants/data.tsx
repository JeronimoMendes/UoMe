import { Group, NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Members',
    href: '/dashboard/employee',
    icon: 'user',
    label: 'employee'
  },
];

export const groups: Group[] = [
  {
    name: 'Overview',
    description: 'General expenses'
  },
  {
    name: 'Solo',
    description: 'My solo group'
  },
  {
    name: 'Roadtrip Costa Vicentina',
    description: 'Expenses from our roadtrip in Portugal'
  }
];
