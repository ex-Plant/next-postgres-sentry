import { getTicketById } from "@/actions/tickets.action";
import type { Ticket } from "@/generated/prisma";

type PagePropsT = {
  params: Promise<{ ticket: string }>;
};

const TicketDetailPage = ({ ticketData }: { ticketData: Ticket }) => {
  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4">Ticket #{ticketData.id}</h2>
      <div className="mb-4">
        <span className="font-semibold">Subject:</span> {ticketData.subject}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Description:</span>{" "}
        {ticketData.description}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Priority:</span>{" "}
        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
          {ticketData.priority.trim()}
        </span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Status:</span> {ticketData.status}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Created At:</span>{" "}
        {new Date(ticketData.createdAt).toLocaleString()}
      </div>
      <div>
        <span className="font-semibold">Updated At:</span>{" "}
        {new Date(ticketData.updatedAt).toLocaleString()}
      </div>
    </div>
  );
};

const Page = async (props: PagePropsT) => {
  const params = await props.params;
  const ticketData = await getTicketById(params.ticket);

  if (!ticketData) return <>😭</>;

  return <TicketDetailPage ticketData={ticketData} />;
};
export default Page;
