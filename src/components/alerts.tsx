import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface AlertProps {
  message: string;
}

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
