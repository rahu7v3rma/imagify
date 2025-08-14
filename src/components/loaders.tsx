import { Loader2 } from "lucide-react";
import { P } from "@/components/ui/typography";

export const WithLoader = ({
  text,
  isLoading,
}: {
  text: string;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <P>Loading...</P>
    </div>
  ) : (
    <P>{text}</P>
  );
};

export const WithLoaderNode = ({
  content,
  isLoading,
}: {
  content: React.ReactNode;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <P>Loading...</P>
    </div>
  ) : (
    <>{content}</>
  );
};