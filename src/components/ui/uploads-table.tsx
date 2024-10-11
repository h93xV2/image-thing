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
import { useState } from "react";
import { Button } from "./button";
import { ArrowUpDown } from "lucide-react";
import PreviewButton from "./preview-button";
import DeleteButton from "./delete-button";
import PinButton from "./pin-button";
import CopyImageTagButton from "./copy-button";

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
      const {pinata_cid_private, pinata_cid_public, id, is_pinned} = row.original;
      const url = `https://gateway.pinata.cloud/ipfs/${pinata_cid_public}`;
      return (
        <>
          { !is_pinned && <PreviewButton pinataCid={pinata_cid_private}/> }
          { is_pinned && <CopyImageTagButton url={url} altText={row.original.upload.visionAnalysis.altText} /> }
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
  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border mx-auto">
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