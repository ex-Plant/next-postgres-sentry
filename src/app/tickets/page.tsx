import { getTickets } from "@/actions/tickets.action";
import Link from "next/link";

type PagePropsT = {};

const TicketsP = async ({}: PagePropsT) => {
  const tickets = (await getTickets()) ?? [];

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">
        Tickets List
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Priority</th>
              <th className="py-2 px-4 border-b">Created</th>
              <th className="py-2 px-4 border-b">Updated</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <Link className={`w-full`} href={`tickets/${t.id}`}>
                  <tr key={t.id} className="hover:bg-blue-50 transition">
                    <td className="py-2 px-4 border-b text-center">{t.id}</td>
                    <td className="py-2 px-4 border-b">{t.subject}</td>
                    <td
                      className="py-2 px-4 border-b max-w-xs truncate"
                      title={t.description}
                    >
                      {t.description}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${t.priority === "High" ? "bg-red-200 text-red-800" : t.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                </Link>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsP;
