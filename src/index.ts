// import { PrismaClient } from "@prisma/client";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
// import { createAccount } from "./controllers/auth";
import { createAccount } from "./controllers/auth";

export const app = new Hono();

export const prismaInstance = new PrismaClient().$extends(withAccelerate())

app.use("/v1/*", cors())
app.use(csrf())

app.get("/", (c: Context) => {
  return c.json(
    { access: Date.now(), msg: "Welcome to Compass Services !", developer: "pratapTechnologies" },
    201
  );
});


app.post("/v1/createAccount", createAccount)

export default app;
