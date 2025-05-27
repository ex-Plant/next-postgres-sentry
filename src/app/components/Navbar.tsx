import Link from "next/link";
import { getUser } from "@/actions/users.actions";
import { LogOut } from "@/app/components/LogOut";

export const Navbar = async () => {
  const user = await getUser();
  console.log(user);

  const isLoggedIn = user.data;

  return (
    <>
      <nav className={`flex gap-4 p-4`}>
        {isLoggedIn && <Link href={`/tickets`}>tickets list</Link>}
        {isLoggedIn && <Link href={`/tickets/new`}>new ticket</Link>}
        {!isLoggedIn && <Link href={`/register`}>Register</Link>}
        {!isLoggedIn && <Link href={`/login`}>Login</Link>}
        {isLoggedIn && <LogOut />}
      </nav>
    </>
  );
};
