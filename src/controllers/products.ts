import { Context } from "hono";
import { verifyUser, verifyUserResponse } from "../middleware/verifyUser";
import { databaseInstance } from "./database";
import { productModel } from "../models/productModel";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../utils/constants";

export default async function registerProducts(c: Context) {
  const token = c.req.header("token")!;

  const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);

  const authorId: number = decoded["id"];

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

    // for updating product count
    const incrementProductCount = databaseInstance.user.update({
      where: {
        userId: authorId,
      },
      data: {
        totalProducts: {
          increment: 1,
        },
      },
    });

    // for registering activities
    const activityRecorder = databaseInstance.activities.create({
      data: {
        authorId,
        title: "New product registered",
        category: "Inventory Management",
        description: `Registered ${name}`,
        type: 2,
      },
    });

    await Promise.all([incrementProductCount, activityRecorder]);

    // await databaseInstance.user.update({
    //   where: {
    //     userId: authorId,
    //   },
    //   data: {
    //     totalProducts: {
    //       increment: 1,
    //     },
    //   },
    // });

    // // to register products in activities
    // await databaseInstance.activities.create({
    //   data: {
    //     authorId: authorId,
    //     title: "New Medicine registered",
    //     category: "create",
    //     description: name,
    //   }
    // })

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
  const token = c.req.header("token")!;

  const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);

  const authorId: number = decoded["id"];

  try {
    const products = await databaseInstance.product.findMany({
      where: {
        authorId: authorId,
      },
      orderBy: {
        createdDate: "desc",
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
  const token = c.req.header("token")!;
  const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);

  const authorId: number = decoded["id"];

  try {
    // const productID: number = body["id"];
    const productID = c.req.query("product");
    if (productID == undefined) {
      return c.json({ message: "Product id required !" }, 400);
    }

    await databaseInstance.product.delete({
      where: {
        id: parseInt(productID),
        authorId: authorId,
      },
    });

    const decrementProduct = databaseInstance.user.update({
      where: {
        userId: authorId,
      },
      data: {
        totalProducts: {
          decrement: 1,
        },
      },
    });

    const recordActivity = databaseInstance.activities.create({
      data: {
        authorId: authorId,
        title: "Medicine deleted",
        category: "Inventory Management",
        description: productID,
        type: 3,
      },
    });

    await Promise.all([decrementProduct, recordActivity]);

    return c.json({ message: "Medicine deleted" }, 202);
  } catch (err: any) {
    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (err.code === "P2025") {
    //     return c.json({ message: "no products associated with this id" }, 400);
    //   }
    // }
    console.log(err);

    return c.json({ message: err.toString() }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}

// to search products
export async function searchProduct(c: Context) {
  const token = c.req.header("token")!;

  const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);

  const authorId: number = decoded["id"];

  try {
    const barCodeId: string | undefined = c.req.query("q");

    // console.log(barCodeId?.slice())

    const products = await databaseInstance.product.findMany({
      orderBy: {
        expireDate: "desc",
      },
      where: {
        authorId: authorId,
        barCodeID: {
          startsWith: barCodeId?.slice(),
        },
        // barCodeID: barCodeId?.slice(),
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

// get all products
export async function allProducts(c: Context) {
  try {
    const products = await databaseInstance.product.findMany();

    return c.json(products, 200);
  } catch (err) {
    return c.json({ msg: "Internal error occurred" }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}

export async function filter(c: Context) {
  try {
    // const token = c.req.header("token");

    // if (token === undefined) {
    //   return c.json({ message: "Invalid request" }, 401);
    // }
    // const userId: verifyUserResponse = await verifyUser(token);

    // if (userId.success === false || !userId.userId)
    //   return c.json({ message: "Invalid token" }, 401);

    // const authorId: number = userId.userId;
    const timeline = c.req.param("timeline");
    const today: Date = new Date();
    console.log("below is the timeline");
    console.log(timeline);

    let products = await databaseInstance.product.findMany({
      orderBy: {
        expireDate: "desc",
      },
    });

    products = products.filter((e) => {
      if (
        differenceInMonths(new Date(), new Date(e.expireDate)) <=
        parseInt(timeline)
      ) {
        return true;
      } else return false;
    });

    return c.json(products, 200);
  } catch (err) {
    return c.json({ message: "Something wrong" }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}

// get difference in months
function differenceInMonths(startDate: Date, endDate: Date): number {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  );
}

function checkDifference(
  startDate: Date,
  endDate: Date,
  difference: number = 2
): boolean {
  Date;

  if (differenceInMonths(startDate, endDate) < difference) {
    return true;
  } else return false;
}

// delete product endpoint
export async function betaDeleteProduct(c: Context) {
  try {
    // const
    const productId = c.req.param("id");

    await databaseInstance.product.delete({
      where: {
        id: parseInt(productId),
      },
    });

    return c.json({ msg: "Product deleted successfully" }, 201);
  } catch (err) {
    return c.json({ msg: "Internal server error" }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}

// get expired products
export async function expiredProducts(c: Context) {
  try {
    const token = c.req.header("token")!;
    const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);

    const authorId: number = decoded["id"];

    const today = new Date().toISOString().split("T")[0];
    const response = await databaseInstance.product.findMany({
      orderBy: {
        createdDate: "desc",
      },
      where: {
        authorId: authorId,
        expireDate: {
          lt: today,
        },
      },
    });

    return c.json(response, 200);
  } catch (err) {
    return c.json({ msg: err }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}

// scheduled delete
export async function scheduledDelete(c: Context) {
  const sixHoursAgo = new Date();
  sixHoursAgo.setHours(sixHoursAgo.getHours() - 12);

  try {
    await databaseInstance.activities.deleteMany({
      where: {
        createdDate: {
          lt: sixHoursAgo,
        },
      },
    });

    return c.json({ message: "Schedule deletion successful" }, 202);
  } catch (err) {
    return c.json({ message: "Server error " + err }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}
