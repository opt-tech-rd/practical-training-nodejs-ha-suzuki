import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  firebase: {
    serviceAccount: JSON.parse(process.env.GCLOUD_SERVICE_KEY),
  },
  server: {
    port: 8080,
  },
};
