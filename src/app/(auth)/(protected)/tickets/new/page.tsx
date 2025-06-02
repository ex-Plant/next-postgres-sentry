import NewTicketForm from "@/app/components/NewTicketForm";
import NewTicketV2 from "@/app/components/NewTicketV2";

type PagePropsT = {};

const NewTicketP = ({}: PagePropsT) => {
  return (
    <>
      <NewTicketForm />;
      <NewTicketV2 />
    </>
  );
};

export default NewTicketP;
