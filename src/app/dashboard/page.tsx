"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PhotoIcon,
  PencilIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArchiveBoxArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface FeatureCardProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  cost: string;
}

const FeatureCard = ({
  href,
  icon: Icon,
  title,
  description,
  cost,
}: FeatureCardProps) => {
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
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      href: "/dashboard/generate-image",
      icon: SparklesIcon,
      title: "Generate Image",
      description: "Create stunning images from text using AI",
      cost: "2-10 credits",
    },
    {
      href: "/dashboard/remove-background",
      icon: PhotoIcon,
      title: "Remove Background",
      description: "Remove backgrounds from images instantly",
      cost: "2-4 credits",
    },
    {
      href: "/dashboard/extract-text",
      icon: DocumentTextIcon,
      title: "Extract Text",
      description: "Extract text from images using OCR",
      cost: "2 credits",
    },
    {
      href: "/dashboard/upscale",
      icon: ArrowUpIcon,
      title: "Upscale Image",
      description: "Enhance and upscale your images",
      cost: "2-3 credits",
    },
    {
      href: "/dashboard/compress-image",
      icon: ArchiveBoxArrowDownIcon,
      title: "Compress Image",
      description: "Reduce image file size without losing quality",
      cost: "3 credits",
    },
    {
      href: "/dashboard/edit-image",
      icon: PencilIcon,
      title: "Edit Image",
      description: "Professional image editing tools",
      cost: "2-10 credits",
    },
  ];

  // Filter features based on search query
  const filteredFeatures = features.filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Choose a tool to get started with your image processing
            needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="ml-8 w-80">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Search Results Count */}
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {filteredFeatures.length} tool{filteredFeatures.length !== 1 ? 's' : ''} found
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
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

      {/* No results message */}
      {searchQuery && filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No tools found for "{searchQuery}"</p>
            <p className="text-sm mt-2">Try searching for "generate", "remove", "extract", "upscale", "compress", or "edit"</p>
          </div>
        </div>
      )}
    </div>
  );
}
