import { authRouter } from "./routers/auth";
import { createTRPCRouter } from "./utils";
import { objectsRouter } from "./routers/objects";
import { streamsRouter } from "./routers/stream";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  objects: objectsRouter,
  streams: streamsRouter,
});

export type AppRouter = typeof appRouter;