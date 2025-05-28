import Link from "next/link";
import React from "react";

type LoginLinkPropsT = {
  txt1: string;
  txt2: string;
  link: string;
};

export const LoginLink = ({ link, txt1, txt2 }: LoginLinkPropsT) => {
  return (
    <>
      <div className={`text-nowrap`}>
        <div>Don`t have an account yet?</div>
        <Link href={`/register`} className={`w-full text-blue-500`}>
          Register new account 🚀
        </Link>
      </div>
    </>
  );
};
