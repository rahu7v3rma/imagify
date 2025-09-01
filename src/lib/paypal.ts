import {
  Client,
  Environment,
  OrdersController,
} from '@paypal/paypal-server-sdk';
import axios from 'axios';
import { SUBSCRIPTION_STANDARD_PLAN_ID } from '@/constants/credits';

const environment = process.env.PAYPAL_ENVIRONMENT as Environment;

const credentials = {
  oAuthClientId:
    environment === 'Sandbox'
      ? process.env.PAYPAL_SANDBOX_CLIENT_ID!
      : process.env.PAYPAL_LIVE_CLIENT_ID!,
  oAuthClientSecret:
    environment === 'Sandbox'
      ? process.env.PAYPAL_SANDBOX_CLIENT_SECRET!
      : process.env.PAYPAL_LIVE_CLIENT_SECRET!,
};

export const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: credentials.oAuthClientId,
    oAuthClientSecret: credentials.oAuthClientSecret,
  },
  environment,
});

export const paypalOrdersController = new OrdersController(paypalClient);

const isSandbox = environment === 'Sandbox';

const paypalBaseUrl = isSandbox
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

const getPaypalAxiosClient = async () => {
  const accessTokenEndpoint = `${paypalBaseUrl}/v1/oauth2/token`;

  const accessTokenAuthSecrets = Buffer.from(
    `${credentials.oAuthClientId}:${credentials.oAuthClientSecret}`,
  ).toString('base64');

  const getAccessToken = await axios.post(
    accessTokenEndpoint,
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${accessTokenAuthSecrets}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const accessToken = getAccessToken.data.access_token;

  return axios.create({
    baseURL: paypalBaseUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createStandardPlanSubscription = async ({
  customId,
}: {
  customId: string;
}) => {
  const paypalAxiosClient = await getPaypalAxiosClient();

  const endpoint = `${paypalBaseUrl}/v1/billing/subscriptions`;
  const response = await paypalAxiosClient.post(endpoint, {
    plan_id: SUBSCRIPTION_STANDARD_PLAN_ID,
    application_context: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/capture-subscription-order`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?buy_subscription_failure=1`,
    },
    custom_id: customId,
  });

  const subscription = response.data;

  const approvalUrl = subscription.links?.find(
    (link: any) => link.rel === 'approve',
  )?.href;

  return {
    approvalUrl,
  };
};

export const getSubscription = async ({
  subscriptionId,
}: {
  subscriptionId: string;
}) => {
  const paypalAxiosClient = await getPaypalAxiosClient();

  const endpoint = `${paypalBaseUrl}/v1/billing/subscriptions/${subscriptionId}`;
  const response = await paypalAxiosClient.get(endpoint);

  return response.data;
};
