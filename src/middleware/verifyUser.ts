import { Context } from "hono";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../utils/constants";

export async function verifyUser(c: Context) {
  try {
    const token = c.req.header("token");
    if (!token) return c.json({ message: "unauthorized" }, 401);
    const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);
    return decoded === null ? false : true;
  } catch (err: any) {
    return false;
  }
}
