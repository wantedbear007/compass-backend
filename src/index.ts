// import { PrismaClient } from "@prisma/client";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
// import { createAccount } from "./controllers/auth";
import { createAccount, login } from "./controllers/auth";
import registerProducts, {
  deleteProduct,
  getProducts,
  searchProduct,
} from "./controllers/products";

type Bindings = {
  JWT_SECRET: string;
};
export const app = new Hono<{ Bindings: Bindings }>();

app.use("/v1/*", cors());
app.use(csrf());

app.get("/", (c: Context) => {
  return c.json(
    {
      access: Date.now(),
      msg: "Welcome to Compass Services !",
      developer: "pratapTechnologies",
    },
    200
  );
});

// auth services
app.post("/v1/createAccount", createAccount);
app.post("/v1/login", login);
// for debug
// app.post("/v1/verify", getDetails);

// products services
app.post("/v1/products/register", registerProducts);
app.get("/v1/products/getProducts", getProducts);
app.post("/v1/products/delete", deleteProduct);
app.get("/v1/products/search", searchProduct);

export default app;
