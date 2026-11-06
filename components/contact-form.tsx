"use client";

import { FormEvent, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || "Website visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        "",
        form.message,
      ].join("\n")
    );

    window.location.href = `mailto:rigvedmb2@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-zinc-950/70">
      <CardHeader className="border-b border-white/10 pb-5">
        <CardTitle>Start a conversation</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-200" htmlFor="message">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell Rig what you're building, what stage you're at, or where you need help."
              required
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({ ...current, message: event.target.value }))
              }
            />
          </div>

          <Button className="w-full sm:w-auto" type="submit">
            <SendHorizontal className="mr-2 h-4 w-4" />
            Open email draft
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
