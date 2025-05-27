"use client";

import Link from "next/link";
import { Ticket } from "@/generated/prisma";
import { deleteTicket } from "@/actions/tickets.action";
import { useRef } from "react";

type TicketsListPropsT = {
  t: Ticket;
};

export const TicketsListTicket = ({ t }: TicketsListPropsT) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  async function handleDelete(e: React.MouseEvent, id: string | number) {
    e.stopPropagation();
    await deleteTicket(Number(id));
    dialogRef.current?.close();
  }

  const openDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    dialogRef.current?.showModal();
  };

  const closeDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    dialogRef.current?.close();
  };

  return (
    <div className={`flex items-center w-full px-4 border border-gray-200`}>
      <Link
        href={`/tickets/${t.id}`}
        className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center py-3 rounded hover:bg-blue-50 transition w-full"
      >
        <div className="font-mono text-xs text-gray-500 w-10 shrink-0">
          #{t.id}
        </div>
        <div className="font-semibold flex-1">{t.subject}</div>
        <div className="text-gray-600 flex-1 truncate" title={t.description}>
          {t.description}
        </div>
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            t.priority === "High"
              ? "bg-red-200 text-red-800"
              : t.priority === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {t.priority}
        </span>
        <div className="text-xs text-gray-400">
          {new Date(t.createdAt).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-400">
          {new Date(t.updatedAt).toLocaleDateString()}
        </div>
      </Link>

      <button onClick={openDialog} className="ml-auto px-4">
        🚯
      </button>

      <dialog
        ref={dialogRef}
        className="p-8 rounded-lg shadow-xl backdrop:bg-black/50 mx-auto my-auto"
      >
        <div className="mb-4 text-gray-800 text-lg">
          Are you sure you want to delete this ticket?
        </div>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
            onClick={async (e) => {
              await handleDelete(e, t.id);
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={closeDialog}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
};
