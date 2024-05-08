import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { createAccount, getUserDetails, login } from "./controllers/auth";
import registerProducts, {
  allProducts,
  betaDeleteProduct,
  deleteProduct,
  filter,
  getProducts,
  searchProduct,
} from "./controllers/products";
import { bodyLimit } from "hono/body-limit";
// import { rateLimiter } from "hono-rate-limiter";


// const loginRateLimiter = rateLimiter({
//   windowMs: 5 * 60 * 1000, // 15 minutes
//   limit: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   keyGenerator: (c) => "9907224577", // Method to generate custom identifiers for clients.
//   // store: ... , // Redis, MemoryStore, etc. See below.
// });



export const app = new Hono<{ Bindings: Bindings }>();

type Bindings = {
  JWT_SECRET: string;
};

app.use("/v1/*", cors());
app.use(csrf());

const middle = async (_: Context, next: Next) => {
  console.log("from middle ware");
  await next();
};

app.get("/", middle, (c: Context) => {
  // console.log(c.req)
  // console.log(c.req.raw.headers.get("CF-Connecting-IP"))
  return c.json(
    {
      access: Date.now(),
      msg: "Welcome to Compass Services !",
      developer: "pratapTechnologies",
    },
    200
  );
});

app.post(
  "/v1/auth/createAccount",
  bodyLimit({
    maxSize: 50 * 1024, // 50kb
    onError: (c) => {
      return c.json({ message: "Overflow to much content" }, 413);
    },
  }),
  // loginRateLimiter,
  createAccount
);
app.post(
  "/v1/auth/login",
  bodyLimit({
    maxSize: 50 * 1024, // 50kb
    onError: (c) => {
      return c.json({ message: "Overflow to much content" }, 413);
    },
  }),
  login
);
app.get("v1/auth/getUserDetails", getUserDetails);
// for debug
// app.post("/v1/verify", getDetails);

// products services
app.post("/v1/products/register", registerProducts);
app.get("/v1/products/getProducts", getProducts);
app.post("/v1/products/delete", deleteProduct);
app.get("/v1/products/search", searchProduct);
app.get("/v1/products/getAll", allProducts);
app.get("/v1/products/expiringIn/:timeline", filter);
app.get("/v1/products/deleteBeta/:id", betaDeleteProduct);
export default app;

// Todo
// implement routes
// add middleware for auth
// add protected endpoints
