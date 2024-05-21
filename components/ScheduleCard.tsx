"use client";

import { z } from "zod";

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
import prisma from "@/lib/prisma";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

const formSchema = z.object({
  tweet: z.string().min(1).max(50),
  datetime: z.date(),
  image: z.string().url(),
});

export default function ScheduleCard() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tweet: "",
      datetime: undefined,
      image: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.error("Event has been created.");
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "Pp")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()} //! Important to disable past dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
