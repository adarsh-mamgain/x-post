import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ScheduleCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Twitter Post Scheduler</CardTitle>
        <CardDescription>Schedule your tweets in advance.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Write your tweet" rows={3} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="schedule-date">Schedule Date</Label>
              <Input id="schedule-date" type="date" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="schedule-time">Schedule Time</Label>
              <Input id="schedule-time" type="time" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Image</Label>
              <Input id="image" type="file" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Schedule Tweet</Button>
      </CardFooter>
    </Card>
  );
}
