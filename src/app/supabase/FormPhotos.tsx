"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { FormEventHandler, useRef, useState, useTransition } from "react";
import { v4 } from "uuid";

function FormPhotos() {
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const files = ref.current?.files;
    if (!files || files.length === 0) return;
    startTransition(async () => {
      const supabase = createClient();
      try {
        for (const file of files) {
          const id = v4();
          const { error } = await supabase.storage
            .from("products")
            .upload(`test/${id}.${file.type.split("/")[1]}`, file);
          if (error) throw error;
        }
        setMessage("New photos stored. (check storage(product bucket)");
        // setFiles(null);
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
            <Label htmlFor="categories">Photos</Label>
            {!!message && <p className="text-sm text-green-500">{message}</p>}
          </div>
          <Input ref={ref} multiple accept="image/*" type="file" />
        </div>
        <Button type="submit">
          {pending && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      </form>
    </fieldset>
  );
}

export default FormPhotos;
