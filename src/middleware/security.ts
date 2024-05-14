import { Context, Next } from "hono";
import { keys } from "../utils/constants";
import { bodyLimit } from "hono/body-limit";

// for checking api keys
export const apiKey = async (c: Context, next: Next) => {
  try {
    const key = c.req.header("apiKey");

    if (!key) {
      return c.json({ message: "API key required" }, 401);
    }

    console.log(key);

    if (keys.includes(key.trim().toString())) {
      return await next();
    }

    return c.json({ message: "Invalid API key" }, 401);
  } catch (err) {
    console.log(err);
    return c.json({ message: "Internal server error" }, 500);
  }
};

// to limit body

// const limitBodyText = async (c: Context, next: Next) => {
//   bodyLimit({
//     maxSize: 50 * 1024, // 50kb
//     onError: (c) => {
//       return c.json({ message: "Overflow to much content" }, 413);
//     },
//   });

//   await next();
// };
