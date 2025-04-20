export default function HomePage() {
  return (
    <div className="p-10">
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <span className="text-4xl font-bold">
            {process.env.NEXT_PUBLIC_WEBSITE_NAME}
          </span>
        </div>
      </div>
    </div>
  );
}
