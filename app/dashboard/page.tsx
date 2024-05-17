import ScheduleCard from "@/components/ScheduleCard";
import { getSession, validateUserSession } from "@/utils/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession("jwt");
  const validatedSession = validateUserSession(session);

  if (!(session && validatedSession)) return redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ScheduleCard />
    </main>
  );
}
