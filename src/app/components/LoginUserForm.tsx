"use client";
import React, { useActionState, useEffect, useTransition } from "react";
import { ActionResT } from "@/actions/tickets.action";
import { logInUser } from "@/actions/auth.actions";
import { toast } from "sonner";
import Link from "next/link";
import { LoginLink } from "@/app/components/LoginLink";

export const LoginUserForm = () => {
  const initState: ActionResT = {
    success: `pending`,
    message: "",
  };

  const [state, formAction, pending] = useActionState(logInUser, initState);

  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    console.log(`handleSubmit`);
    startTransition(async () => {
      const result = await logInUser(initState, formData);

      // Toast shows immediately after server action completes
      if (result.success === "ok") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  // console.log(pending);
  // useEffect(() => {
  //   if (state.success === "pending") return;
  // if (state.success === "ok") {
  //   toast.success(`Ok ✅`);
  // }
  // if (state.success === "failed") {
  //   toast.error(`Something went wrong 🚨 ` + state.message);
  // }
  // }, [state]);

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded ">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          LogIn
        </h2>
        {state.message && state.success === "failed" && (
          <p className={`text-red-200`}>{state.message}</p>
        )}
        {state.message && state.success === "ok" && (
          <p className={`text-green-200`}>{state.message}</p>
        )}
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
          <button
            type="submit"
            className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition font-semibold"
          >
            Login
          </button>
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
