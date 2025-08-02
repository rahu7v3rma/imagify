import Link from "next/link";
import { tools } from "@/constants/public/home";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Image Processing Tools</h1>
        <p className="text-lg">
          Powerful AI-driven tools for all your image processing needs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map(({ icon: Icon, href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center space-y-3 rounded-md border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <Icon className="h-6 w-6 text-gray-700" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
