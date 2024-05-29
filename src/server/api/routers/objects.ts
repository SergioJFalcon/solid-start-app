import { wrap } from "@typeschema/valibot";
import { object, string } from "valibot";
import { createTRPCRouter, publicProcedure } from "../utils";

export const objectsRouter = createTRPCRouter({
  hello: publicProcedure
    .query(_ => { // Explicitly type the 'input' parameter as a string
        return `Hello!`;
    }),
  getObject: publicProcedure
    .input(wrap(string()))
    .query(async (input) => {
      "user server";
      const response = await fetch(`${process.env.VITE_JC_HOSTNAME}/objects/${input.input}`, {
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
      return data;
    }),
  getObjectAttributeList: publicProcedure
    .input(wrap(string()))
    .query(async (input) => {
      "user server";
      const response = await fetch(`${process.env.VITE_JC_HOSTNAME}/objects/${input.input}/attributes`, {
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
      return data;
    }),
  getObjectAttribute: publicProcedure
    .input(wrap(object({ object: string(), attribute: string() })))
    .query(async (input) => {
      "user server";
      const response = await fetch(`${process.env.VITE_JC_HOSTNAME}/objects/${input.input.object}/attributes/${input.input.attribute}`, {
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
      return data;
    }),
});