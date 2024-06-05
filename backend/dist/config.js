import * as dotenv from "dotenv";
dotenv.config();
export const config = {
    firebase: {
        serviceAccount: JSON.parse(process.env.SERVICE_ACCOUNT),
    },
    server: {
        port: 4000,
    },
};
