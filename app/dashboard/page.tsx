"use client";
import ScheduleCard from "@/components/ScheduleCard";
import axios from "axios";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [authorised, setAuthorised] = useState(false);
  useEffect(() => {
    console.log("Checking if user is authorised");
    axios.get("/api/user/validate").then((res) => {
      setAuthorised(res.data);
    });
  }, []);
  useEffect(() => {
    console.log(authorised);
  }, [authorised]);

  console.log("before", authorised);
  // if (!authorised) return redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ScheduleCard />
    </main>
  );
}
