"use client";

import SelectCategories from "@/components/SelectCategories";
import { useActionState } from "react";
import { actionCategoriesWithCreatableSelect } from "./action";
import { Button } from "@/components/ui/button";

export default function FormCategoriesWithCreatableSelect() {
  const [state, action, pending] = useActionState(
    actionCategoriesWithCreatableSelect,
    undefined
  );
  return (
    <fieldset disabled={pending}>
      <form className="space-y-4 p-4 border rounded-sm" action={action}>
        <SelectCategories />
        <Button type="submit">Submit Categories</Button>
      </form>
    </fieldset>
  );
}
