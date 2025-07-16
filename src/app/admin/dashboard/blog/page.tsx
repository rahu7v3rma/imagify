export default function AdminBlogPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Management</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-900">
          <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage blog posts, create new articles, edit existing content, and control publication status.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-900">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your blog content with categories and tags.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md dark:bg-zinc-900">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View blog performance metrics and reader engagement statistics.
          </p>
        </div>
      </div>
    </div>
  );
} 