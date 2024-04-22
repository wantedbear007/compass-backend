import { Context } from "hono";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { CaesarCipher } from "../utils/hashing";
// import { prismaInstance } from "..";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { databaseInstance } from "./database";
// create account
export async function createAccount(c: Context) {

  const body = await c.req.json();

  try {
    const username: string = body["username"];
    const password: string = body["password"];
    const email: string = body["email"];
    // const unique: string = body["unique"];
    const name: string = body["name"];
    const profile: string = body["profile"];

    if (!(username || password || email || name)) {
      return c.json({message: "All fields required "}, 203);
    }

    console.log(username, password, email, name, profile);

    // databaseInstance.$connect;

    const hashedPassword: string = CaesarCipher.encrypt(password, 10);

    await databaseInstance.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email,
        name: name,
        profile: profile,
        unique: uuidv4(),
      },
    });

    return c.json({
      status: "account created successfully.",
    }, 201);
  } catch (err: any) {
    // if (err instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (err.code === "P2002") {
    //     return c.status(406);
    //   } else return c.status(500);
    // } else {
        //     return c.json({message: "Internal error"}, 500)
        // }
            console.log(err);
        return c.json({message: "Internal error"}, 500)

  } finally {
    // databaseInstance.$disconnect;
  }
}

// login
// export async function loginAccount(c: Context) {
//   const body = await c.req.json();

//   try {
//   } catch (err: any) {
//   } finally {
//   }
// }
