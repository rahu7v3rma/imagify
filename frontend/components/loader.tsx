import { Spinner } from "@heroui/react";
import { useLoader } from "../context/loader";

export default function Loader() {
  const { isLoading } = useLoader();
  if (!isLoading) return null;
  return (
    <div className="flex justify-center items-center absolute w-full h-full bg-gray-100 top-0 opacity-50">
      <Spinner size="lg" />
    </div>
  );
}
