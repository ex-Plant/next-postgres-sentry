"use client";
import React, { useTransition } from "react";
import { ActionResT } from "@/actions/tickets.action";
import { registerUser } from "@/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/*
 *
 * k
 * a
 * ka@gmail.com
 * test
 * */

export const RegisterUserForm = () => {
  const initState: ActionResT = {
    success: `pending`,
    message: "",
  };
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleRegister(formData: FormData) {
    startTransition(async () => {
      const res = await registerUser(initState, formData);
      console.log(res, "res");

      if (res.success === "ok") {
        toast.success(`User registered 🚀`);
        router.push(`/tickets`);
      }
      if (res.success === "failed") {
        toast.error(`Something went wrong 🚨:` + res.message);
      }
    });
  }

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded ">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Register account
        </h2>
        <form
          action={handleRegister}
          className="flex flex-col gap-4 text-black"
        >
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
            {isPending ? "..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
};
