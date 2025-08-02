import Link from "next/link";
import { FEATURES } from "@/constants/dashboard/home";

export default function DashboardPage() {
  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Choose a tool to get started with your image processing
          needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map(({ icon: Icon, href, title, description, cost }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <Icon className="h-6 w-6 text-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {description}
              </p>
              <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                💳 {cost}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
