import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string | unknown;
      username?: string | unknown;
      token?: string | unknown;
    } & DefaultSession["user"];
  }
}
