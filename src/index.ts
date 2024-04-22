// import { PrismaClient } from "@prisma/client";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
// import { createAccount } from "./controllers/auth";
import { createAccount, getDetails, login, verifyUser } from "./controllers/auth";
import { jwt } from "hono/jwt";
import { JWT_SECRET } from "./utils/constants";

type Bindings = {
  JWT_SECRET: string;
};
export const app = new Hono<{ Bindings: Bindings }>();

export const prismaInstance = new PrismaClient().$extends(withAccelerate());

app.use("/v1/*", cors());
app.use(csrf());

app.get('/auth/page', (c) => {
  // const payload = c.get('jwtPayload')
  // 
  return c.json({"hello": "bhanu"}) // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
})



app.get("/", (c: Context) => {
  return c.json(
    {
      access: Date.now(),
      msg: "Welcome to Compass Services !",
      developer: "pratapTechnologies",
    },
    201
  );
});

app.get("/v1/auth/products", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(payload); // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
});

app.post("/v1/createAccount", createAccount);
app.post("/v1/login", login);
app.post("/v1/verify", getDetails)


export default app;
