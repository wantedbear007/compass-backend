import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { createAccount, getUserDetails, login } from "./controllers/auth";
import registerProducts, {
  allProducts,
  betaDeleteProduct,
  deleteProduct,
  expiredProducts,
  filter,
  getProducts,
  searchProduct,
} from "./controllers/products";
import { bodyLimit } from "hono/body-limit";
import { keys } from "./utils/constants";
import { apiKey, tokenVerification } from "./middleware/security";
// import { rateLimiter } from "hono-rate-limiter";

// 1krf3w61D2BeU6CAt5P6



export const app = new Hono<{ Bindings: Bindings }>();

type Bindings = {
  JWT_SECRET: string;
};

app.use("/v1/*", apiKey);
app.use("/v1/products/*", tokenVerification)
app.use("/v1/auth/getUserDetails*", tokenVerification)

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
app.get("/v1/products/expiredProducts", expiredProducts);

app.get("/v1/products/expiringIn/:timeline", filter);
app.get("/v1/products/deleteBeta/:id", betaDeleteProduct);
export default app;

// Todo
// implement routes
// add middleware for auth
// add protected endpoints
