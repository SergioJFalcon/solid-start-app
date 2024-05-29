import { wrap } from "@typeschema/valibot";
import { object, string } from "valibot";
import { createTRPCRouter, publicProcedure } from "../utils";

export const streamsRouter = createTRPCRouter({
  hello: publicProcedure
    .query(_ => { // Explicitly type the 'input' parameter as a string
        return `Hello!`;
    }),
  getStream: publicProcedure
    .query(async _ => {
      "user server";
      // TODO: Have to figure out how to consume a continuous SSE Stream API
      const response = await fetch(`${process.env.VITE_JC_HOSTNAME}/streams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.VITE_REFRESH_TOKEN}`,
          'Accept': 'text/event-stream',
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

      //TODO: start receiving events from the stream
      // match the event type and call the appropriate function
      // if the first message of event type "hello", grab the subscriptionId

      // TODO: Subscribe object attribute events to the stream (temp, humidity, pressure senors)

      return data;
    }),
});