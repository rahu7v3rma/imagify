import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertProps } from "@/types/components/alerts";

export function SuccessAlert({ message }: AlertProps) {
  return (
    <Alert>
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function ErrorAlert({ message }: AlertProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
