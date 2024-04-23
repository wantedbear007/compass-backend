import { Context } from "hono";
import { prismaInstance } from "..";
import { verifyUser } from "../middleware/verifyUser";

export default async function registerProducts(c: Context) {
  const verifyLogin = verifyUser(c);

  if (!verifyLogin) return c.json({ message: "Invalid token" }, 401);

  try {
    const body = await c.req.json();

    const expireDate: string = body["expire"];
    const barCodeId: string = body["barcode"];
    const name: string = body["string"];
    const description: string = body["description"];
    const region: string = body["region"];
    const imageUrl: string = body["image"];
    const brand: string = body["brand"];
    const category: string = body["category"];
    if (
      !(
        expireDate ||
        barCodeId ||
        name ||
        description ||
        region ||
        imageUrl ||
        brand ||
        category
      )
    ) {
      return c.json(
        {
          message: "All fields required",
        },
        203
      );
    }

    return c.json(
      {
        message: "Authorized",
      },
      200
    );
  } catch (err: any) {
    console.log(err)
    console.log("error happened !")
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  } finally {
    prismaInstance.$disconnect;
  }
}
