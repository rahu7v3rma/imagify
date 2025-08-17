import ResizeImageComponent from "@/components/pages/resize-image";

export const metadata = {
  title: "Resize Image - Imagify",
  description:
    "Resize your images to specific dimensions in pixels. Upload your image and set custom width and height.",
};

export default function ResizeImagePage() {
  return <ResizeImageComponent />;
}