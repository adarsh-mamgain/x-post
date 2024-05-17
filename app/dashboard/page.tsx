import ScheduleCard from "@/components/ScheduleCard";
import { getSession, validateUserSession } from "@/utils/server";

export async function getServerSideProps() {
  const session = await getSession("jwt");
  const validatedSession = await validateUserSession(session);

  if (!(session && validatedSession)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ScheduleCard />
    </main>
  );
}
