import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  firebase: {
    service_account: process.env.FIREBASE_CONFIG,
    project_id: process.env.GOOGLE_CLOUD_PROJECT,
  },
  server: {
    port: 8080,
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  },
};
