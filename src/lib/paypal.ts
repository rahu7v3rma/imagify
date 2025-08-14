import {
  Client,
  Environment,
  OrdersController,
} from "@paypal/paypal-server-sdk";

export const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_SANDBOX_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_SANDBOX_CLIENT_SECRET!,
  },
  environment: process.env.PAYPAL_ENVIRONMENT as Environment,
});

export const paypalOrdersController = new OrdersController(paypalClient);