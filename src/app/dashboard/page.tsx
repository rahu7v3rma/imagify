"use client";

import Link from "next/link";
import {
  PhotoIcon,
  PencilIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArchiveBoxArrowDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useSearch } from "@/context/search";
import { useState, useEffect } from "react";

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
  const { searchTerm, setSearchTerm } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState("");

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

  // Filter features based on search term (use global search term if local is empty)
  const effectiveSearchTerm = localSearchTerm || searchTerm;
  const filteredFeatures = features.filter((feature) =>
    feature.title.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
  );

  // Update global search term with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, setSearchTerm]);

  // Sync with global search term when it changes from sidebar
  useEffect(() => {
    if (searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm);
    }
  }, [searchTerm]);

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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:border-zinc-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Results */}
      {effectiveSearchTerm && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredFeatures.length} service{filteredFeatures.length !== 1 ? 's' : ''} found for "{effectiveSearchTerm}"
          </p>
        </div>
      )}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.length > 0 ? (
          filteredFeatures.map((feature) => (
            <FeatureCard
              key={feature.href}
              href={feature.href}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              cost={feature.cost}
            />
          ))
        ) : (
          effectiveSearchTerm && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No services found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search term or browse all available services.
              </p>
              <button
                onClick={() => {
                  setLocalSearchTerm("");
                  setSearchTerm("");
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Clear search
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
