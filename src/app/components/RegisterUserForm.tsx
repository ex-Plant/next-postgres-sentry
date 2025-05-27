"use client";
import React, { useActionState, useEffect } from "react";
import { ActionResT } from "@/actions/tickets.action";
import { registerUser } from "@/actions/auth.actions";
import { toast } from "sonner";

type RegisterUserFormPropsT = {};

export const RegisterUserForm = ({}: RegisterUserFormPropsT) => {
  const initState: ActionResT = {
    success: `pending`,
    message: "",
  };

  const [state, formAction] = useActionState(registerUser, initState);

  useEffect(() => {
    if (state.success === "pending") return;
    if (state.success) {
      toast.success(`Ok`);
    }
    if (!state.success) {
      toast.error(`Something went wrong 🚨:` + state.message);
    }
  }, [state]);

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded ">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Register account
        </h2>
        {state.message && !state.success && (
          <p className={`text-red-200`}>{state.message}</p>
        )}
        {state.message && state.success && (
          <p className={`text-green-200`}>{state.message}</p>
        )}
        <form action={formAction} className="flex flex-col gap-4 text-black">
          <label className="flex flex-col gap-1">
            <span className="font-semibold">name</span>
            <input
              type="text"
              name="name"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
              // required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-semibold">surname</span>
            <input
              type="text"
              name="surname"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your surname"
              // required
            />
          </label>{" "}
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
            Register
          </button>
        </form>
      </div>
    </>
  );
};
