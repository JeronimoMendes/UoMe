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
    href: '/dashboard/personal-expenses',
    icon: 'billing',
    label: 'Personal Expenses',
  },
  {
    title: 'Groups',
    href: '/dashboard/groups',
    icon: 'employee',
    label: 'Groups'
  }
];

export const ExpenseTypes = [
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
    { label: "Sports", value: "Sports" },
    { label: "Other", value: "Other" },
]

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
