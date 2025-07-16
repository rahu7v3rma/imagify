export default function FooterComponent() {
  return (
    <footer className="backdrop-blur-sm border-t border-divider mt-auto">
      <div className="flex justify-center items-center p-4">
        {/* Copyright */}
        <div className="text-sm text-default-500">
          © {new Date().getFullYear()} imagify.pro Admin Panel
        </div>
      </div>
    </footer>
  );
} 