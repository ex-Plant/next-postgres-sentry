import { getTickets } from "@/actions/tickets.action";
import { TicketsListTicket } from "@/app/components/TicketsList.Ticket";

const TicketsP = async () => {
  const data = await getTickets();
  if (!data?.tickets) return null;
  const { tickets } = data;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Tickets List
      </h2>
      <div className="flex flex-col gap-2">
        {!tickets || tickets.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            No tickets found.
          </div>
        ) : (
          tickets.map((t) => <TicketsListTicket key={t.id} t={t} />)
        )}
      </div>
    </div>
  );
};

export default TicketsP;
