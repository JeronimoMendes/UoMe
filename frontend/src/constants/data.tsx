import { Expense, Group, NavItem } from '@/types';

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
    title: 'Personal Expenses',
    href: '/dashboard/personal',
    icon: 'billing',
    label: 'Personal Expenses',
    disabled: true
  },
  {
    title: 'Groups',
    href: '/dashboard/groups',
    icon: 'employee',
    label: 'Groups'
  }
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

export const expensesOverview: Expense[] = [
  {
    id: 1,
    description: 'Groceries',
    amount: 54.99,
    date: '2024-05-12',
    author: 'Silvester Stalone',
    createdAt: '2024-05-21',
    participants: [
      {
        name: 'Silvester Stalone',
        amount: -54.99
      },
      {
        name: 'John Doe',
        amount: 27.50
      }
    ]
  },
  {
    id: 2,
    description: 'Groceries',
    amount: 100,
    date: '2024-10-05',
    author: 'John Doe',
    createdAt: '2024-05-19',
    participants: [
      {
        name: 'Ann Frank',
        amount: 75
      },
      {
        name: 'John Doe',
        amount: -100
      }
    ]
  },
]
