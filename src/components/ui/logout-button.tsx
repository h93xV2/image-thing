"use client";

import { LogOut } from "lucide-react";
import { Button } from "./button";
import { createClient } from "@lib/supabase/client";

export default function LogOutButton() {
  const clickHandler = () => {
    const supabase = createClient();

    supabase.auth.signOut().then(() => {
      window.location.reload();
    });
  };

  return (
    <Button onClick={clickHandler} className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
      <LogOut className="w-5 h-5 mr-2" />
      Logout
    </Button>
  );
}