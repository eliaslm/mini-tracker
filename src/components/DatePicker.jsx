import { useState, useEffect } from "react";

import { Calendar } from "@/components/ui/calendar"
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner"
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


function timeStringToSeconds(timeString) {
  const parts = timeString.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid time format. Expected (M)M:SS");
  }

  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);

  if (isNaN(minutes) || isNaN(seconds) || seconds < 0 || seconds >= 60) {
    throw new Error("Invalid time values.");
  }

  return minutes * 60 + seconds;
}


export function MiniTimeForm({ supabaseClient, supabaseSession, selectedDate }) {
  const placeholderMessage = "No entry for selected date";
  const [dateEntry, setDateEntry] = useState(placeholderMessage);
  const ISODate = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : "";
  const [isEditing, setIsEditing] = useState(false);

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

  async function onSubmit(formData) {
    const timeInSeconds = timeStringToSeconds(formData["timeEntry"]);
    supabaseClient
      .from('entries')
      .upsert({ user_id: supabaseSession.user.id, date: ISODate, time: timeInSeconds, created_at: new Date().toISOString() })
      .then(
        ({ data, error }) => {
          if (!error) {
            toast.success(
              "🎉 Score registered successfully!", {
              description: `Time ${formData["timeEntry"]} registered for ${ISODate}.` ,
            }
            )
          } else {
            toast.error(
              "😭 Error registering score", {
                description: "Please try again."
              }
            )
          }
        }
      )
    setIsEditing(false);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="timeEntry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registered score</FormLabel>
              <FormControl>
                <Input disabled={!isEditing} placeholder={dateEntry} {...field} />
              </FormControl>
              <FormDescription>
                Recorded score for the selected date
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {
          !isEditing ? (
            <Button type="button" onClick={() => { setIsEditing(true) }}>{dateEntry === placeholderMessage ? "Enter score" : "Edit score"}</Button>
          ) :
            (
              <div className="flex gap-4">
                <Button type="submit">{dateEntry === placeholderMessage ? "Submit score" : "Update score"}</Button>
                <Button type="button" variant="outline" onClick={() => { setIsEditing(false) }}>Cancel</Button>
              </div>
            )
        }
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
        required={true}
        className="rounded-md border shadow"
      />
      <MiniTimeForm selectedDate={date} supabaseClient={supabaseClient} supabaseSession={supabaseSession} />
    </div>
  )
}
