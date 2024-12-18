import { Alert, AlertDescription } from "./ui/alert";

export default function MyAlert({
  message,
  variant,
}: {
  message: string;
  variant: "default" | "destructive";
}) {
  return (
    <Alert variant={variant}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
