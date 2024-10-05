"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import { RetrievedUploadRow } from "@lib/types";
import {
  ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { ArrowUpDown } from "lucide-react";
import PreviewButton from "./preview-button";
import { createClient } from "@lib/supabase/client";

const columns: ColumnDef<RetrievedUploadRow>[] = [
  {
    accessorKey: "upload.visionAnalysis.title",
    header: "Title",
  },
  {
    accessorKey: "upload.visionAnalysis.altText",
    header: "Alt Text"
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("created_at"));
      const formatted = createdAt.toLocaleString();
 
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "upload.pinataCid",
    header: "Preview",
    cell: ({row}) => {
      return <PreviewButton cid={row.original.upload.pinataCid} />
    }
  }
];

type Props = {
  data: RetrievedUploadRow[]
};

export default function UploadsTable(props: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState(props.data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const supabase = createClient(); // TODO: Check the user is logged in like on the home page.

  useEffect(() => {
    const channel = supabase
      .channel("realtime uploads")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "uploads"
        },
        (payload) => {
          setData([...data, payload.new as RetrievedUploadRow]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, data]);

  return (
    <div className="rounded-md border max-w-7xl mx-auto mt-10">
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
              {/* TODO: Make a loading thing first before no results */}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}