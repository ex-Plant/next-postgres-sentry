"use client";

import React, { useOptimistic } from "react";
import { createTicketAction } from "@/actions/tickets.action";
import NewTicketFormBtn from "@/app/components/NewTicketFormBtn";
import { Ticket } from "@/generated/prisma";

type OptimisticTicket = Partial<Ticket> & {
  subject: string;
  description: string;
  priority: string;
};

const NewTicketV2 = () => {
  const [optimisticTickets, addOptimisticTicket] = useOptimistic<
    OptimisticTicket[],
    OptimisticTicket
  >([], (state, newTicket) => [...state, newTicket]);

  console.log(optimisticTickets);

  async function formAction(formData: FormData) {
    const newTicket: OptimisticTicket = {
      subject: formData.get("subject") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as string,
    };

    addOptimisticTicket(newTicket);
    await createTicketAction(formData);
  }

  async function addTicket(formDAta: FormData) {
    await formAction(formDAta);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded ">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Submit a New Ticket version2
      </h2>
      {/*{state.message && !state.success && (*/}
      {/*  <p className={`text-red-200`}>{state.message}</p>*/}
      {/*)}*/}
      {/*{state.message && state.success && (*/}
      {/*  <p className={`text-green-200`}>{state.message}</p>*/}
      {/*)}*/}
      <form action={addTicket} className="flex flex-col gap-4 text-black">
        {/*<form action={formAction} className="flex flex-col gap-4 text-black">*/}
        <label className="flex flex-col gap-1">
          <span className="font-semibold">subject</span>
          <input
            type="text"
            name="subject"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter ticket subject"
            // required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold">description</span>
          <input
            type="text"
            name="description"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter ticket description"
            // required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold">priority</span>
          <textarea
            name="priority"
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Priority"
            rows={4}
            // required
          />
        </label>
        <NewTicketFormBtn />
      </form>
      {/* optimistic ticket will be added during form submission and than will be swapped after
       successful form submission*/}
      <div>
        {optimisticTickets.map((t) => (
          <>{t.description}</>
        ))}
      </div>
      ;
    </div>
  );
};

export default NewTicketV2;
