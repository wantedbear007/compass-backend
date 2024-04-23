import { Context } from "hono";
import { verifyUser, verifyUserResponse } from "../middleware/verifyUser";
import { databaseInstance } from "./database";
import { productModel } from "../models/productModel";
import { Prisma } from "@prisma/client";

export default async function registerProducts(c: Context) {
  const token = c.req.header("token");

  if (token === undefined) {
    return c.json({ message: "Invalid request" }, 401);
  }
  const userId: verifyUserResponse = await verifyUser(token);

  if (userId.success === false || !userId.userId)
    return c.json({ message: "Invalid token" }, 401);

  const authorId: number = userId.userId;

  // if (!userId) return c.json({ message: "Invalid token" }, 401);

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
        authorId: authorId,
      },
    });

    return c.json(
      {
        message: "Medicine added successfully.",
      },
      201
    );
  } catch (err: any) {
    console.log("error occurred ");
    console.log(err);
    return c.json(
      {
        message: "Internal server error",
      },
      500
    );
  } finally {
    databaseInstance.$disconnect;
  }
}

// to get medicines
export async function getProducts(c: Context) {
  const token = c.req.header("token");

  if (token === undefined) {
    return c.json({ message: "Invalid request" }, 401);
  }
  const userId: verifyUserResponse = await verifyUser(token);

  if (userId.success === false || !userId.userId)
    return c.json({ message: "Invalid token" }, 401);

  const authorId: number = userId.userId;

  try {
    const products = await databaseInstance.product.findMany({
      where: {
        authorId: authorId,
      },
    });

    let allProducts: productModel[];

    allProducts = products.map((x: productModel) => ({
      id: x.id,
      barCodeID: x.barCodeID,
      expireDate: x.expireDate,
      name: x.name,
      description: x.description,
      region: x.region,
      imageUrl: x.imageUrl,
      brand: x.brand,
      category: x.category,
      createdDate: x.createdDate,
    }));

    // console.log(allProducts);

    return c.json(allProducts);
  } catch (err: any) {
    console.log("error occurred");
    console.log(err);
    return c.json({ message: "Internal error occurred " }, 400);
  } finally {
    databaseInstance.$disconnect;
  }
}

export async function deleteProduct(c: Context) {
  const token = c.req.header("token");

  if (token === undefined) {
    return c.json({ message: "Invalid request" }, 401);
  }
  const userId: verifyUserResponse = await verifyUser(token);

  if (userId.success === false || !userId.userId)
    return c.json({ message: "Invalid token" }, 401);

  const authorId: number = userId.userId;

  try {
    const body = await c.req.json();

    const productID: number = body["id"];

    await databaseInstance.product.delete({
      where: {
        id: productID,
        authorId: authorId,
      },
    });

    return c.json({ message: "Medicine deleted" }, 202);
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return c.json({ message: "no products associated with this id" }, 400);
      }
    }
    console.log(err);

    return c.json({ message: "Internal server error" }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}


// to search products
export async function searchProduct(c: Context) {
  const token = c.req.header("token");

  if (token === undefined) {
    return c.json({ message: "Invalid request" }, 401);
  }
  const userId: verifyUserResponse = await verifyUser(token);

  if (userId.success === false || !userId.userId)
    return c.json({ message: "Invalid token" }, 401);

  const authorId: number = userId.userId;

  try {
    const barCodeId: string | undefined = c.req.query("q");

    // console.log(barCodeId?.slice())

    const products = await databaseInstance.product.findMany({
      where: {
        authorId: authorId,
        barCodeID: barCodeId?.slice(),
      },
    });

    return c.json(products, 200);
  } catch (err: any) {
    console.log(err);
    return c.json({ message: "internal error" }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}
