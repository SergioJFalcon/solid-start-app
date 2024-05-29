import { wrap } from "@typeschema/valibot";
import { string } from "valibot";
import { createTRPCRouter, publicProcedure } from "../utils";

export const exampleRouter = createTRPCRouter({
    hello: publicProcedure
        .input(wrap(string()))
        .query(({ input }: { input: string }) => { // Explicitly type the 'input' parameter as a string
            return `Hello ${input}!`;
        })
});
