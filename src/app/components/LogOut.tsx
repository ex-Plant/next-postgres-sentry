"use client";
import React, { useActionState, useEffect } from "react";
import { ActionResT } from "@/actions/tickets.action";
import { logOutUser } from "@/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LogOut = ({}) => {
  const initState: ActionResT = {
    success: `pending`,
    message: "",
  };

  const [state, formAction] = useActionState(logOutUser, initState);

  const router = useRouter();
  useEffect(() => {
    if (state.success === "pending") return;
    if (state.success === "ok") {
      toast.success(`You are now logged out ✅`);
      router.push("/login");
      return;
    }
    toast.error(`Something went wrong 🚨 ` + state.message);
  }, [state, router]);

  return (
    <form action={formAction}>
      <div>asdfas</div>
      <button>Log out 👋</button>
    </form>
  );
};
