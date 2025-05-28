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
        <div>{txt1}</div>
        <Link href={link} className={`w-full text-blue-500`}>
          {txt2}
        </Link>
      </div>
    </>
  );
};
