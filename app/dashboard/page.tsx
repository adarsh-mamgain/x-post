"use client";
import ScheduleCard from "@/components/ScheduleCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-row justify-center space-x-16 py-16 px-60">
      <div className="flex flex-col space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card className="sm:col-span-2" key={i}>
            <CardHeader className="pb-3">
              <CardTitle>Your Orders</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our Dynamic Orders Dashboard for Seamless Management
                and Insightful Analysis.
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <ScheduleCard />
    </main>
  );
}
