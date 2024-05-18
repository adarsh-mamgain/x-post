"use client";
import ScheduleCard from "@/components/ScheduleCard";
import axios from "axios";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [authorised, setAuthorised] = useState(false);
  useEffect(() => {
    axios.get("/api/user/validate").then((res) => {
      console.log("useEffect", res);
      setAuthorised(res.data);
    });
  }, []);

  if (!authorised) return redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ScheduleCard />
    </main>
  );
}
