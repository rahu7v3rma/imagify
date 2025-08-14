import {
  Client,
  Environment,
  OrdersController,
} from "@paypal/paypal-server-sdk";

const environment = process.env.PAYPAL_ENVIRONMENT as Environment;

const credentials = {
  oAuthClientId:
    environment === "Sandbox"
      ? process.env.PAYPAL_SANDBOX_CLIENT_ID!
      : process.env.PAYPAL_LIVE_CLIENT_ID!,
  oAuthClientSecret:
    environment === "Sandbox"
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
