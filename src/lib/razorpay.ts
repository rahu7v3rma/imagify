import Razorpay from 'razorpay';

const isTest = process.env.RAZORPAY_ENVIRONMENT === 'test';

const keyId = isTest
  ? process.env.RAZORPAY_TEST_KEY_ID!
  : process.env.RAZORPAY_LIVE_KEY_ID!;
const keySecret = isTest
  ? process.env.RAZORPAY_TEST_KEY_SECRET!
  : process.env.RAZORPAY_LIVE_KEY_SECRET!;

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});
