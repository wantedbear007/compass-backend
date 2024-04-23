import { Context } from "hono";
import { prismaInstance } from "..";
import { verifyUser } from "../middleware/verifyUser";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { databaseInstance } from "./database";

export default async function registerProducts(c: Context) {
  const userId = await verifyUser(c);

  if (!userId) return c.json({ message: "Invalid token" }, 401);

  try {
    const body = await c.req.json();

    const expireDate: string = body["expireDate"];
    const barCodeId: string = body["barCodeId"];
    const name: string = body["name"];
    const description: string = body["description"];
    const region: string = body["region"];
    const imageUrl: string = body["imageUrl"];
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

    await databaseInstance.product.create({
      data: {
        barCodeID: barCodeId,
        brand: brand,
        expireDate: expireDate,
        name: name,
        category: category,
        description: description,
        imageUrl: imageUrl,
        region: region,
        authorId: userId,
      },
    });

    return c.json(
      {
        message: "Medicine added successfully.",
      },
      201
    );
  } catch (err: any) {
    console.log(err);
    console.log(err.code);
    console.log("error happened !");
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
