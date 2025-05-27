"use client";
import React, { useActionState, useEffect } from "react";
import { ActionResT } from "@/actions/tickets.action";
import { logInUser, registerUser } from "@/actions/auth.actions";
import { toast } from "sonner";

type LoginUserFormPropsT = {};

export const LoginUserForm = ({}: LoginUserFormPropsT) => {
  const initState: ActionResT = {
    success: `pending`,
    message: "",
  };

  const [state, formAction] = useActionState(logInUser, initState);

  useEffect(() => {
    if (state.success === "pending") return;
    if (state.success === "ok") toast.success(`Ok ✅`);
    toast.error(`Something went wrong 🚨 ` + state.message);
  }, [state]);

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded ">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Log in
        </h2>
        {state.message && state.success === "failed" && (
          <p className={`text-red-200`}>{state.message}</p>
        )}
        {state.message && state.success === "ok" && (
          <p className={`text-green-200`}>{state.message}</p>
        )}
        <form action={formAction} className="flex flex-col gap-4 text-black">
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
        </form>
      </div>
    </>
  );
};
