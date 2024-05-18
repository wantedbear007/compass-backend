import { Context } from "hono";
import { v4 as uuidv4 } from "uuid";
import { Hashing } from "../utils/hashing";

import { databaseInstance } from "./database";
// import { prismaInstance } from "..";
import { HASH } from "../utils/constants";
import { jwt } from "hono/jwt";
import { decode, sign, verify } from "hono/jwt";
import { env } from "hono/adapter";
import { JWT_SECRET } from "../utils/constants";
import {
  verifyUser as verify0,
  verifyUserResponse,
} from "../middleware/verifyUser";

// create account
export async function createAccount(c: Context) {
  try {
    const body = await c.req.json();
    const username: string = body["username"];
    const password: string = body["password"];
    const email: string = body["email"];
    // const unique: string = body["unique"];
    const name: string = body["name"];
    const profile: string = body["profile"];

    if (!(username && password && email && name)) {
      return c.json({ message: "All fields required " }, 203);
    }

    // console.log(username, password, email, name, profile);

    // const hashedPassword: string = Hashing.encrypt(password, HASH);
    // console.log(hashedPassword)

    await databaseInstance.user.create({
      data: {
        username,
        password,
        email,
        name,
        profile,
        // unique: uuidv4(),
      },
    });

    return c.json(
      {
        status: "account created successfully.",
      },
      201
    );
  } catch (err) {
    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //   console.log("hello from bhanu")
    // }
    return c.json({ message: "Internal error" }, 500);

    // console.log(err);

    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (err.code == "P2002") {
    //     return c.json({ message: "Email address already taken" }, 409);
    //   } else {
    //     return c.json({ message: "Internal server error try later" }, 500);
    //   }
    // } else {
    //   return c.json({ message: "Internal error" }, 500);
    // }
  } finally {
    databaseInstance.$disconnect;
  }
}

// login
export async function login(c: Context) {
  try {
    const body = await c.req.json();
    const username: string = body["username"];
    const password: string = body["password"];

    if (!(username || password))
      return c.json({ msg: "all fields required" }, 203);

    const user = await databaseInstance.user.findUnique({
      where: {
        username,
        password,
      },
    });

    if (user === null) {
      return c.json({ msg: "Not authenticated." }, 400);
    }

    // payload
    const payload = {
      id: user["userId"],
      username: username,
      // email: user["email"],
      // name: user["name"],
      // login: Date.now(),
      // profile: user["profile"],
    };

    const activitiesPromise = databaseInstance.activities.create({
      data: {
        authorId: user["userId"],
        title: "New login detected",
        category: "Authentication",
        description: "Account accessed on another device.",
        type: 4
      }
    })

    const tokenCreation = sign(payload, JWT_SECRET)

    const [token, activities] = await Promise.all([tokenCreation, activitiesPromise ]);



    // await databaseInstance.activities.create({
    //   data: {
    //     authorId: user["userId"],
    //     title: "New login detected",
    //     category: "Uncategorized",
    //     description: "Account accessed on another device.",
    //   },
    // });

    // signing jwt
    // const token = await sign(payload, JWT_SECRET);

    return c.json({ status: "success", token: token }, 200);
  } catch (err: any) {
    console.log(err.code);
    console.log(err);
    return c.json({ msg: "failed with error" }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}

// export async function getDetails(c: Context) {
//   const bhanu = await c.req.json();
//   // console.log(bhanu["token"]);

//   const lol = bhanu["token"];
//   const del = await verifyUser(lol);
//   // console.log(del);

//   return c.json({ msg: bhanu["token"] });
// }

// get user details
export async function getUserDetails(c: Context) {
  try {
    const token: string | undefined = c.req.query("token");

    if (token === undefined) {
      return c.json({ message: "Token required" }, 401);
    }

    // console.log(token);

    const userId: verifyUserResponse = await verify0(token);

    // console.log(userId);

    if (userId.success === false || !userId.userId) {
      return c.json({ message: "Invalid token" }, 401);
    }

    const authorId: number = userId.userId;

    const user = await databaseInstance.user.findUnique({
      where: {
        userId: authorId,
      },
    });

    return c.json(
      {
        userId: user?.userId,
        email: user?.email,
        username: user?.username,
        name: user?.name,
        totalProducts: user?.totalProducts,
        profile: user?.profile,
      },
      200
    );
  } catch (err) {
    return c.json({ message: "Internal error" }, 500);
  } finally {
    databaseInstance.$disconnect;
  }
}

export async function verifyUser(token: string): Promise<boolean> {
  try {
    const res = await verify(token, JWT_SECRET);
    console.log(res);
    return res === null ? false : true;
  } catch (err: any) {
    console.log(err);
    return false;
  }
}
