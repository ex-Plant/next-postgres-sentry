"use client";
import React, { useTransition } from "react";
import { ActionResT } from "@/actions/tickets.action";
import { logInUser } from "@/actions/auth.actions";
import { toast } from "sonner";
import { LoginLink } from "@/app/components/LoginLink";
import { useRouter } from "next/navigation";
import { SubmitBtn } from "@/app/components/SubmitBtn";

/*
 *
 * k
 * a
 * ka@gmail.com
 * test
 * */

export const LoginUserForm = () => {
  const initState: ActionResT = {
    success: `pending`,
    message: "",
  };

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    console.log(`handleSubmit`);
    startTransition(async () => {
      const result = await logInUser(initState, formData);

      // Toast shows immediately after server action completes
      if (result.success === "ok") {
        toast.success(result.message);
        router.push(`/tickets`);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded ">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          LogIn
        </h2>
        <form action={handleSubmit} className="flex flex-col gap-4 text-black">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">email</span>
            <input
              type="email"
              name="email"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              // required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">password</span>
            <input
              type="text"
              name="password"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter password"
              // required
            />
          </label>

          <SubmitBtn btnTxt={`Login`} isPending={isPending} />

          <LoginLink
            txt1={"Don`t have an account yet?"}
            txt2={"Register new account 🚀"}
            link={"/register"}
          />
        </form>
      </div>
    </>
  );
};
