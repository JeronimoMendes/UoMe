"use client"

import { Expense, Participant } from "@/api/types"
import { UserAvatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { formatCurrency } from "@/lib/utils"
import { HoverCard } from "@radix-ui/react-hover-card"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"


export const columns: ColumnDef<Expense>[] = [
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
    }
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
]
