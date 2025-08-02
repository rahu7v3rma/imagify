import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLoader } from "@/context/loader";
import { Loader2 } from "lucide-react";

export default function Loader() {
  const { isLoading } = useLoader();

  return (
    <Dialog open={isLoading}>
      <DialogContent className="bg-transparent border-none shadow-none max-w-none w-auto">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
