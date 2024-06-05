import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  firebase: {
    serviceAccount: JSON.parse(process.env.SERVICE_ACCOUNT_KEY),
  },
  server: {
    port: 8080,
  },
};
