"use client"
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    SortingFn,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    sortingFns,
    useReactTable
} from "@tanstack/react-table"
import * as React from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// A TanStack fork of Kent C. Dodds' match-sorter library that provides ranking information
import {
    RankingInfo,
    compareItems,
    rankItem,
} from '@tanstack/match-sorter-utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'fuzzy',
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    })

    return (
      <>
        <div className="overflow-x-auto max-w-xs sm:max-w-full">
            <div className="flex items-center justify-between	 py-4 ">
                <Input
                placeholder="Filter..."
                onChange={event => setGlobalFilter(event.target.value)}
                value={globalFilter ?? ""}
                className="max-w-sm"
                />
            </div>
            <div className="rounded-md border overflow-x-scroll" >
                <Table>
                    <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4 max-w-fit">
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
      </>
    )
}
