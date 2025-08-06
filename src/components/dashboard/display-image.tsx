import clsx from "clsx";
import Image from "next/image";

export default function DisplayImage({
  imageSrc,
  className,
}: {
  imageSrc: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex-1 max-w-md", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Processed image
      </label>
      <p className="text-xs text-gray-500 mb-3">
        ℹ️ Download link will be available until midnight UTC
      </p>
      <div className="w-full h-80 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
        <Image
          src={imageSrc}
          alt="Processed image"
          fill
          className="object-contain"
        />
        <a
          href={imageSrc}
          className="absolute top-2 right-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200 z-10"
        >
          Download
        </a>
      </div>
    </div>
  );
}
