import { Navbar } from "@/app/components/Navbar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const headersList = headers();
  // const pathname = headersList.get("x-pathname") || "";
  // const isLoginPage = pathname === "/login";

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
