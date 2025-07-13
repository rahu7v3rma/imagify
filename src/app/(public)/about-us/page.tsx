"use client";

export default function AboutUsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-800 dark:text-zinc-200">
      <h1 className="text-3xl font-bold dark:text-white">About Us</h1>
      <p>
        <strong>imagify.pro</strong> is on a mission to make advanced image processing accessible to everyone.
        Designers, developers, photographers, and everyday creators all share the same challenge: turning raw images
        into beautiful, production-ready assets—quickly, affordably, and without running heavy desktop software.
      </p>

      <p>
        Our cloud platform bundles a growing suite of AI-powered tools under one roof:
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>🖼️ <strong>Remove Background</strong> – isolate subjects in a single click.</li>
        <li>🔍 <strong>Extract Text (OCR)</strong> – pull text from screenshots or scanned documents.</li>
        <li>🚀 <strong>Upscale</strong> – enlarge images up to 4× while preserving detail.</li>
        <li>📦 <strong>Compress</strong> – shrink file size without sacrificing quality.</li>
        <li>🖌️ <strong>Edit</strong> – smart adjustments and transformations.</li>
        <li>✨ <strong>Generate</strong> – create brand-new visuals from plain text with generative AI.</li>
      </ul>

      <p>
        Everything runs in the browser—no plugins to install, no GPUs to maintain. Simply pay for the processing
        you use via <em>cents</em>, our lightweight credit system powered by Razorpay. Behind the scenes we rely on
        trusted infrastructure from Firebase (auth & hosting) and Replicate (state-of-the-art ML models) to deliver
        fast, secure, and reliable results.
      </p>

      <p>
        We are a small, fully remote team that believes great tooling should be <em>simple</em>, <em>transparent</em>, and
        <em>respectful of your privacy</em>. Your images remain yours—we automatically delete them 24&nbsp;hours after
        processing.
      </p>

      <p>
        Whether you need to prepare a product photo, clean up a slide deck, or craft marketing visuals at scale,
        imagify.pro gives you professional-grade results in seconds. We can’t wait to see what you create. 💜
      </p>
    </div>
  );
} 