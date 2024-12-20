"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { FormEventHandler, useRef, useState, useTransition } from "react";

export default function FormCategories() {
  const ref = useRef<HTMLInputElement | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const sb = createClient();
  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const cats = ref.current?.value;
      if (!cats) return;
      const catsToInsert = cats.split(", ");
      try {
        // check if the categories has been registered
        const { data: registeredCategories, error } = await sb
          .from("categories")
          .select("name")
          .in("name", [catsToInsert]);

        if (error) throw error;
        if (registeredCategories === null) return;

        // make sure we insert unregistered categories
        // because every categories is unique by name
        const filterData = registeredCategories.map((v) => v.name);
        const result: string[] = [];
        for (const v of catsToInsert) {
          if (!filterData.includes(v)) {
            result.push(v);
          }
        }

        const { error: err } = await sb
          .from("categories")
          .insert(result.map((v) => ({ name: v })));
        if (err) throw err;

        setMessage("New categories added");
        // @ts-ignore
        ref.current!.value = "";
      } catch (err) {
        console.log(err);
      }
    });
  };

  return (
    <fieldset disabled={pending}>
      <form
        onSubmit={onSubmit}
        className="space-y-2 mt-6 border border-slate-700 p-10 rounded-lg"
      >
        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <Label htmlFor="categories">Categories</Label>
            {!!message && (
              <p className="text-sm text-green-500">New categories added</p>
            )}
          </div>
          <Input ref={ref} name="categories" type="text" id="categories" />
        </div>
        <Button type="submit">
          {pending && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      </form>
    </fieldset>
  );
}
