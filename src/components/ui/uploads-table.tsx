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
import DeleteButton from "./delete-button";
import PinButton from "./pin-button";

const columns: ColumnDef<RetrievedUploadRow>[] = [
  {
    accessorKey: "upload.fileName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: "upload.visionAnalysis.title",
    header: "Title",
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
      );
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("created_at"));
      const formatted = createdAt.toLocaleString();
 
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "id",
    header: "Options",
    cell: ({row}) => {
      const {pinata_cid_private, id, is_pinned} = row.original;
      return (
        <>
          <PreviewButton pinataCid={pinata_cid_private}/>
          <PinButton id={id} isInitiallyPinned={is_pinned} />
          <DeleteButton id={id} />
        </>
      );
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
          setData((prevData) => [...prevData, payload.new as RetrievedUploadRow]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "uploads",
        },
        (payload) => {
          setData((prevData) => prevData.filter((item) => item.id !== payload.old.id));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "uploads",
        },
        (payload) => {
          setData((prevData) =>
            prevData.map((item) =>
              item.id === payload.new.id ? (payload.new as RetrievedUploadRow) : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, data]);

  return (
    <div className="rounded-md border mx-auto mt-10 ml-10 mr-10">
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
  );
}