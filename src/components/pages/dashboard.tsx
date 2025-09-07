'use client';

import PageTransition from '@/components/shared/transitions';
import { H1, Muted } from '@/components/ui/typography';
import { useUser } from '@/context/user/provider';
import Image from 'next/image';
import { Spinner } from '@/components/shared/loaders';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ExpandedPreviewImage } from '@/components/shared/modals';
import { IconButton } from '@/components/shared/buttons';
import { Expand } from 'lucide-react';

export default function DashboardPage() {
  const { userFiles, isLoading } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

  // Display all available images
  const gridImages = userFiles || [];

  return (
    <PageTransition>
      <div className="w-full">
        <div className="mb-8 flex flex-col items-start">
          <div className="flex items-center gap-4">
            <H1>Dashboard</H1>
            {isLoading && <Spinner />}
          </div>
          <Muted>
            Welcome back! Choose a tool to get started with your image
            processing needs.
          </Muted>
        </div>

        {/* Responsive Image Grid */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fit, 200px)' }}
        >
          {gridImages.length > 0 &&
            gridImages.map((userFile, index) => (
              <motion.div
                key={index}
                className="w-[200px] h-[200px] border border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setSelectedImage(userFile.base64String);
                  setSelectedFileId(userFile.fileId);
                }}
              >
                <Image
                  src={userFile.base64String}
                  alt={`User image ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconButton
                    onClick={() => {
                      setSelectedImage(userFile.base64String);
                      setSelectedFileId(userFile.fileId);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    <Expand className="h-6 w-6" />
                  </IconButton>
                </motion.div>
              </motion.div>
            ))}
        </div>
      </div>

      {selectedImage && (
        <ExpandedPreviewImage
          isOpen={!!selectedImage}
          onClose={() => {
            setSelectedImage(null);
            setSelectedFileId(null);
          }}
          src={selectedImage}
          fileId={selectedFileId}
        />
      )}
    </PageTransition>
  );
}
