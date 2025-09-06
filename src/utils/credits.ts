import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

export const verifyCredits = (user: User, requiredCredits: number) => {
  const credits = user.credits || 0;
  const subscriptionCredits = user.subscriptionCredits || 0;
  const totalCredits = credits + subscriptionCredits;
  if (totalCredits < requiredCredits) {
    throw new Error('You do not have enough credits.');
  }
};

export const deductCredits = async (user: User, requiredCredits: number) => {
  const subscriptionCredits = user.subscriptionCredits || 0;

  let creditsToDeductFromSubscription = 0;
  if (subscriptionCredits >= requiredCredits) {
    creditsToDeductFromSubscription = requiredCredits;
  }
  if (subscriptionCredits > 0 && subscriptionCredits < requiredCredits) {
    creditsToDeductFromSubscription = subscriptionCredits;
  }

  let creditsToDeductFromCredits = 0;
  if (creditsToDeductFromSubscription < requiredCredits) {
    creditsToDeductFromCredits =
      requiredCredits - creditsToDeductFromSubscription;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      credits: {
        decrement: creditsToDeductFromCredits,
      },
      subscriptionCredits: {
        decrement: creditsToDeductFromSubscription,
      },
    },
  });
};
