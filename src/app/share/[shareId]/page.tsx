import { prisma } from '@/lib/prisma';
import { decodeShareId } from '@/utils/jwt';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  try {
    const { shareId } = await params;
    const decoded = decodeShareId({ token: shareId });

    const { userId, fileId } = decoded;

    const userFile = await prisma.userFile.findFirst({
      where: { fileId: Number(fileId), userId: Number(userId) },
      include: {
        file: true,
      },
    });

    if (!userFile) {
      throw new Error('User file not found');
    }

    return (
      <Image
        src={userFile.file.base64String}
        alt="Share Image"
        layout="responsive"
        width={0}
        height={0}
      />
    );
  } catch {
    return notFound();
  }
}
