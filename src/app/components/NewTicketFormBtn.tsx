import React, { useOptimistic } from "react";
import { useFormStatus } from "react-dom";

type PropsT = {};

function NewTicketFormBtn({}: PropsT) {
  // const {} = useOptimistic()
  const { pending, data } = useFormStatus();

  console.log(data, "🚀");
  return (
    <>
      <button
        disabled={pending}
        type="submit"
        className="bg-yellow-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
      >
        {pending ? "..." : "Submit Ticket "}
      </button>
    </>
  );
}

export default NewTicketFormBtn;
