import Link from "next/link";
import {
  PhotoIcon,
  PencilIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArchiveBoxArrowDownIcon,
} from "@heroicons/react/24/outline";

interface FeatureCardProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  cost: string;
}

const FeatureCard = ({ href, icon: Icon, title, description, cost }: FeatureCardProps) => {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105 dark:border-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-700 dark:group-hover:bg-gray-600 transition-colors">
        <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
        <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          💳 {cost}
        </div>
      </div>
    </Link>
  );
};

export default function DashboardPage() {
  const features = [
    {
      href: "/dashboard/generate-image",
      icon: SparklesIcon,
      title: "Generate Image",
      description: "Create stunning images from text using AI",
      cost: "2-10 cents",
    },
    {
      href: "/dashboard/remove-background",
      icon: PhotoIcon,
      title: "Remove Background",
      description: "Remove backgrounds from images instantly",
      cost: "2-4 cents",
    },
    {
      href: "/dashboard/extract-text",
      icon: DocumentTextIcon,
      title: "Extract Text",
      description: "Extract text from images using OCR",
      cost: "2 cents",
    },
    {
      href: "/dashboard/upscale",
      icon: ArrowUpIcon,
      title: "Upscale Image",
      description: "Enhance and upscale your images",
      cost: "2-3 cents",
    },
    {
      href: "/dashboard/compress-image",
      icon: ArchiveBoxArrowDownIcon,
      title: "Compress Image",
      description: "Reduce image file size without losing quality",
      cost: "3 cents",
    },
    {
      href: "/dashboard/edit-image",
      icon: PencilIcon,
      title: "Edit Image",
      description: "Professional image editing tools",
      cost: "2-10 cents",
    },
  ];

  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Choose a tool to get started with your image processing needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard
            key={feature.href}
            href={feature.href}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            cost={feature.cost}
          />
        ))}
      </div>
    </div>
  );
}
