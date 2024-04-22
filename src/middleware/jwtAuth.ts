import { Context } from "hono";
import app from "..";
import { jwt } from "hono/jwt";

app.use("/v1/auth/*", (c: Context, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  });

  return jwtMiddleware(c, next);
});
