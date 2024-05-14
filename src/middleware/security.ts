import { Context, Next } from "hono";
import { JWT_SECRET, keys } from "../utils/constants";
import { bodyLimit } from "hono/body-limit";
import { verify } from "hono/jwt";
import { JwtTokenInvalid } from "hono/utils/jwt/types";

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

export const tokenVerification = async (c: Context, next: Next) => {
  try {

    const token = c.req.header("token");

    if (token == undefined) {
      return c.json({message: "Token required"}, 401)
    }

    const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);

    if (decoded) {
      await next();
    } else {
      return c.json({message: "Not authenticated"}, 401)
      
    }


  } catch (err) {

    if (err instanceof JwtTokenInvalid) {
      return c.json({message: "Invalid token"}, 401)
    }

    return c.json({message: "Internal server error. "}, 500)


  }
}

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
