import { authRouter } from "./routers/auth";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
  auth: authRouter
});

export type AppRouter = typeof appRouter;
