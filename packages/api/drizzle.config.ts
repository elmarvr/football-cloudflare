import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({
  path: ".dev.vars",
});

export default {
  schema: "./src/db/schema/*.ts",
  out: "./.migrations",
  verbose: false,
  strict: true,
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
