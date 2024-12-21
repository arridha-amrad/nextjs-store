"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

function DeletePhotoFromStorage() {
  const [pending, startTransition] = useTransition();
  const deleteFromStorage = async () => {
    const supabase = createClient();
    startTransition(async () => {
      const result = await supabase.storage
        .from("products")
        .remove(["troll/1708969830468.png"]);
      console.log(result);
    });
  };
  return (
    <div className="p-6">
      <Button variant="destructive" onClick={deleteFromStorage}>
        {pending && <Loader2 className="animate-spin" />}
        Delete From Storage
      </Button>
    </div>
  );
}

export default DeletePhotoFromStorage;
