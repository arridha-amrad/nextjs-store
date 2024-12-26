import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  setValue: Dispatch<SetStateAction<number>>;
};

export default function AddStock({ setValue }: Props) {
  const [v2, setV2] = useState(0);

  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const [open, setOpen] = useState(false);

  const addStock = () => {
    setValue((val) => {
      return operation === "add" ? val + v2 : val - v2;
    });
    setV2(0);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update Stock</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Increase Product&apos;s Stock</DialogTitle>
          <DialogDescription>
            Make changes to product&apos;s stock
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="total">How much</Label>
          <Input
            id="total"
            type="number"
            min={0}
            step={1}
            value={v2}
            onChange={(e) => setV2(parseInt(e.target.value))}
          />
          <RadioGroup
            onValueChange={(e) => setOperation(e as "add" | "subtract")}
            defaultValue={operation}
          >
            <p>Choose operation : </p>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add">Add</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="subtract" id="subtract" />
              <Label htmlFor="subtract">Subtract</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button disabled={v2 === 0} onClick={addStock}>
            Add Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
