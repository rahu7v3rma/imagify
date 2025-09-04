export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_ENVIRONMENT === 'test'
    ? process.env.RAZORPAY_TEST_KEY_ID!
    : process.env.RAZORPAY_LIVE_KEY_ID!;

export const RAZORPAY_PUBLIC_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_ENVIRONMENT === 'test'
    ? process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID!
    : process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID!;
