import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SuccessAlert({ message }: {
  message: string;
}) {
  return (
    <Alert>
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export function ErrorAlert({ message }: {
  message: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
