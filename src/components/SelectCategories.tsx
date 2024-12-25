"use client";

import { createClient } from "@/lib/supabase/client";
import { Label } from "@radix-ui/react-label";
import dynamic from "next/dynamic";
import { useState } from "react";
const CreatableSelect = dynamic(() => import("react-select/async-creatable"), {
  ssr: false,
});

export default function SelectCategories() {
  const [isFocusCategory, setFocusCategory] = useState(false);

  const loadCategories = async (value: string) => {
    const sb = createClient();
    const { data } = await sb.from("categories").select("*");
    if (!data) return [];
    const options = data.map((v) => ({
      label: v.name,
      value: v.name,
    }));
    return options.filter((v) =>
      v.label.toLowerCase().includes(value.toLowerCase())
    );
  };

  return (
    <div className="space-y-3 relative">
      {isFocusCategory && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      )}
      <Label className="text-sm relative" htmlFor="categories">
        Categories
      </Label>
      <CreatableSelect
        id="categories"
        name="categories"
        unstyled
        onBlur={() => setFocusCategory(false)}
        onFocus={() => setFocusCategory(true)}
        classNames={{
          container: () => "border border-input rounded-md bg-background",
          valueContainer: () => "space-x-1",
          multiValueRemove: () => "hover:text-red-500",
          multiValue: () =>
            "bg-primary rounded-md text-primary-foreground px-2 py-0.5 space-x-2 text-sm",
          menu: () =>
            "border-2 border-primary rounded-md bg-background overflow-hidden",
          menuList: () => "text-primary",
          placeholder: () => "text-muted-foreground",
          option: () => "bg-background hover:bg-primary/20 px-4 py-2",
          control: (state) =>
            `p-2 ${
              state.isFocused
                ? "ring-2 ring-primary rounded-md ring-offset-background"
                : ""
            }`,
        }}
        isMulti
        cacheOptions
        defaultOptions
        loadOptions={loadCategories}
      />
    </div>
  );
}
