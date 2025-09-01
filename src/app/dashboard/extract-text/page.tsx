import ExtractTextComponent from '@/components/pages/extract-text';

export const metadata = {
  title: 'Extract Text - Imagify',
  description:
    'Extract text from images using OCR (Optical Character Recognition). Upload your image and get the text content instantly.',
};

export default function ExtractTextPage() {
  return <ExtractTextComponent />;
}
