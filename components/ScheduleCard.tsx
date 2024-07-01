"use client";

import { z } from "zod";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { DateTimePicker } from "./ui/datetime";

const formSchema = z.object({
  tweet: z.string().min(1).max(50),
  datetime: z.date(),
  image: z.string().optional(),
});

export default function ScheduleCard() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tweet: "",
      datetime: undefined,
      image: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.error(`Event ${values} been created.`);
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Twitter Post Scheduler</CardTitle>
        <CardDescription>Schedule your tweets in advance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full items-center gap-4"
          >
            <FormField
              control={form.control}
              name="tweet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tweet</FormLabel>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Write your tweet"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datetime</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      granularity="minute"
                      jsDate={field.value}
                      onJsDateChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Schedule Tweet
            </Button>
          </form>
        </Form>
      </CardContent>
      <Toaster />
    </Card>
  );
}
