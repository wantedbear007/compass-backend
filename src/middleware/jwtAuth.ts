import { Context } from "hono";
import app from "..";
import { jwt } from "hono/jwt";
import { JWT_SECRET } from "../utils/constants";
import { verify } from "hono/jwt";

// app.use('/auth/*', (c, next) => {
//     const jwtMiddleware = jwt({
//       secret: c.env.JWT_SECRET,
//     })
//     return jwtMiddleware(c, next)
//   })