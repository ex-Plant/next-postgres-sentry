"use client";

import React, { useActionState } from "react";
import { createTicket } from "@/actions/tickets.action";

const NewTicketForm = () => {
  const [state, formAction] = useActionState(createTicket, {
    message: "Init message",
    success: false,
  });

  //
  // useEffect(() => {
  //   console.log(state, "state");
  //   if (state.success) {
  //     toast.success(`😎`);
  //     router.push(`/tickets`);
  //   }
  //   console.log(state, `🍆`);
  // }, [state]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded ">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Submit a New Ticket
      </h2>
      {state.message && !state.success && (
        <p className={`text-red-200`}>{state.message}</p>
      )}
      {state.message && state.success && (
        <p className={`text-green-200`}>{state.message}</p>
      )}
      <form action={formAction} className="flex flex-col gap-4 text-black">
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
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default NewTicketForm;
