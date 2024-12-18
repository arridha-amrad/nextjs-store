"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";

type Props = {
  label: string;
  isChecked: boolean;
  setCheck: Dispatch<SetStateAction<boolean>>;
};

export default function MyCheckBox({ isChecked, label, setCheck }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        name="terms"
        checked={isChecked}
        onCheckedChange={(e: boolean) => {
          setCheck(e);
        }}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
