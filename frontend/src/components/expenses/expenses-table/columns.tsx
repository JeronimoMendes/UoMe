"use client"

import { Expense, Participant } from "@/api/types"
import { Icons } from "@/components/icons"
import { UserAvatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { formatCurrency } from "@/lib/utils"
import { HoverCard } from "@radix-ui/react-hover-card"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"


export const expenseTableCols: ColumnDef<Expense>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <div>{formatCurrency(amount)}</div>
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stringDate: string = row.getValue("date")
      const date = new Date(stringDate)
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }) => {
      const participants = row.getValue("participants") as Participant[]
      return (
        <div className="flex items-center -space-x-4">
          {participants.map((participant) => (
            <HoverCard key={participant.user.id}>
              <HoverCardTrigger asChild>
                <UserAvatar user={participant.user} className="h-8 w-8" />
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={participant.user} className="h-8 w-8" />
                  <div>
                    <div>{participant.user.username}</div>
                    <div>
                      {participant.amount < 0 ? (
                        <>
                          <span className="text-muted-foreground">Paid: </span>{formatCurrency(-participant.amount)}
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground">Owes: </span> {formatCurrency(participant.amount)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Icons.horizontalDots className="h-4 w-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => row.original.delete()}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Edit</DropdownMenuItem>
              <DropdownMenuItem disabled>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]

export const personalExpensesCols: ColumnDef<Expense>[] = [
  expenseTableCols[0],
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original.user
      const participation = row.getValue("participants").filter((p: Participant) => p.user.email === user.email)[0]
      let amount = parseFloat(participation.amount)
      if (amount < 0) {
        amount = -amount
        row.getValue("participants").forEach((p: Participant) => {
          if (p.user.email !== user.email)
            amount -= parseFloat(p.amount)
        })
      }
      return <div>{formatCurrency(amount)}</div>
    }
  },
  expenseTableCols[1],
  expenseTableCols[4],
  {
    accessorKey: "group",
    header: "Group",
    cell: ({ row }) => {
      const group = row.getValue("group")
      return <div><a href={`/dashboard/groups/${group?.id}`}>{group?.name}</a></div>
    }
  },
  expenseTableCols[3],
  expenseTableCols[5]
]

export const paymentTableCols: ColumnDef<Expense>[] = [
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return <div>{formatCurrency(amount)}</div>
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const stringDate: string = row.getValue("date")
      const date = new Date(stringDate)
      return <div>{date.toLocaleDateString()}</div>
    }
  },
  {
    accessorKey: "user_payer",
    header: "Payer",
    cell: ({ row }) => {
      const payer = row.getValue("user_payer")
      return (
        <>
          <div className="flex items-center -space-x-4">
              <HoverCard key={payer.id}>
                <HoverCardTrigger asChild>
                  <UserAvatar user={payer} className="h-8 w-8" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex items-center space-x-2">
                    <UserAvatar user={payer} className="h-8 w-8" />
                    <div>
                      <div>{payer.username}</div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
          </div>
        </>
      )
    }
  },
  {
    accessorKey: "user_payee",
    header: "Payee",
    cell: ({ row }) => {
      const payee = row.getValue("user_payee")
      return (
        <div className="flex items-center -space-x-4">
            <HoverCard key={payee.id}>
              <HoverCardTrigger asChild>
                <UserAvatar user={payee} className="h-8 w-8" />
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={payee} className="h-8 w-8" />
                  <div>
                    <div>{payee.username}</div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
        </div>
      )
    }
  },
]
