import { useState, useEffect } from "react";

import { Calendar } from "@/components/ui/calendar"
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formatTime } from "./AvgTable"


const timeRegex = /^([0-9]{1,2}):([0-5][0-9])$/;

const FormSchema = z.object({
  timeEntry: z
    .string()
    .regex(timeRegex, {
      message: "Time must be in the format M:SS or MM:SS.",
    }),
});


export function MiniTimeForm({ supabaseClient, supabaseSession, selectedDate }) {

  const placeholderMessage = "No entry recorded for date";
  const [dateEntry, setDateEntry] = useState(placeholderMessage);
  const ISODate = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : "";

  useEffect(() => {
    supabaseClient
      .from('entries')
      .select()
      .eq('user_id', supabaseSession?.user.id)
      .eq('date', ISODate)
      .limit(1)
      .single()
      .then(
        ({ data, error }) => {
          if (!error) {
            setDateEntry(formatTime(data.time));
          } else {
            setDateEntry(placeholderMessage);
          }
        }
      );
  }, [selectedDate]
  )


  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      timeEntry: "",
    },
  })

  function onSubmit(data) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registered score</FormLabel>
              <FormControl>
                <Input placeholder={dateEntry} {...field} />
              </FormControl>
              <FormDescription>
                Recorded score for the selected date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{dateEntry === placeholderMessage ? "Submit score" : "Update score"}</Button>
      </form>
    </Form>
  )
}


export function DateTimes({ supabaseClient, supabaseSession }) {
  const [date, setDate] = useState(new Date())

  return (
    <div className="flex items-start gap-10">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={{ after: new Date() }}
        className="rounded-md border shadow"
      />
      <MiniTimeForm selectedDate={date} supabaseClient={supabaseClient} supabaseSession={supabaseSession} />
    </div>
  )
}
