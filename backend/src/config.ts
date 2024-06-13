import * as dotenv from "dotenv";
dotenv.config();

export const isCloudRun =
  process.env.K_SERVICE &&
  process.env.K_REVISION &&
  process.env.K_CONFIGURATION;

export const config = {
  firebase: {
    project_id: "tech-induction-training-2024",
  },
  server: {
    port: process.env.PORT || "8080",
  },
  db: isCloudRun
  ? {
    socketPath: "/cloudsql/" + process.env.DB_INSTANCE_CONNECTION_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
  : {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
};
