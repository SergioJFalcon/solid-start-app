import { wrap } from "@typeschema/valibot";
import { object, string } from "valibot";
import { createTRPCRouter, publicProcedure } from "../utils";

export const authRouter = createTRPCRouter({
    hello: publicProcedure
        .query(_ => { // Explicitly type the 'input' parameter as a string
            return `Hello!`;
        }),
    getFakeData: publicProcedure
        .query(async _ => {
            const response = await fetch("https://fake-json-api.mock.beeceptor.com/users",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();
            return data;
        }),
    login: publicProcedure
    .query(async _ => {
      "user server";
      const response = await fetch(`${process.env.VITE_JC_HOSTNAME}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            username: process.env.VITE_USERNAME,
            password: process.env.VITE_PASSWORD,
          }
        ),
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      const data = await response.json();
      // console.log("LOGIN data: ", data)
      return data;
    }),
    refreshToken: publicProcedure
      .query(async _ => {
        "user server";
        // TODO: Implement refresh token logic in a context
        const response = await fetch(`${process.env.VITE_JC_HOSTNAME}/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.VITE_REFRESH_TOKEN}`,
          },
          body: JSON.stringify(
            {
              username: process.env.VITE_USERNAME,
              password: process.env.VITE_PASSWORD,
            }
          ),
        });
        if (!response.ok) {
          throw new Error("Failed to login");
        }
        const data = await response.json();
        // console.log("data: ", data)
        return data;
      }),
});
