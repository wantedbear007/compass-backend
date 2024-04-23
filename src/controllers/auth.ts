import { Context } from "hono";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { Hashing } from "../utils/hashing";

import { databaseInstance } from "./database";
import { prismaInstance } from "..";
import { HASH } from "../utils/constants";
import { jwt } from "hono/jwt";
import { decode, sign, verify } from "hono/jwt";
import { env } from "hono/adapter";
import { JWT_SECRET } from "../utils/constants";

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

    if (!(username || password || email || name)) {
      return c.json({ message: "All fields required " }, 203);
    }

    // console.log(username, password, email, name, profile);

    const hashedPassword: string = Hashing.encrypt(password, HASH);
    // console.log(hashedPassword)

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

    return c.json(
      {
        status: "account created successfully.",
      },
      201
    );
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return c.status(406);
      } else return c.status(500);
    } else {
      return c.json({ message: "Internal error" }, 500);
    }
  } finally {
    databaseInstance.$disconnect;
  }
}

// login
export async function login(c: Context) {
  const body = await c.req.json();
  try {
    const username: string = body["username"];
    const password: string = body["password"];

    if (!(username || password))
      return c.json({ msg: "all fields required" }, 203);

    const user = await prismaInstance.user.findUnique({
      where: {
        username: username,
        password: Hashing.decrypt(password, HASH),
      },
    });

    if (user === null) {
      return c.json({ msg: "Not authenticated." }, 400);
    }

    // env;
    // const lol = await c.env.JWT_SECRET;
    // console.log(c.env.jwtMiddleware)

    // console.log("something")
    // console.log(lol)

    // const token = jwt1.sign({username: username}, JWT_SECRET)
    //   console.log(token)

    // payload
    const payload = {
      username: username,
      email: user["email"],
      name: user["name"],
      login: Date.now(),
      profile: user["profile"],
    };

    // signing jwt
    const token = await sign(payload, JWT_SECRET);

    return c.json({ status: "success", token: token }, 200);
  } catch (err: any) {
    console.log(err.code);
    console.log(err);
    return c.json({ msg: "failed with error" }, 500);
  } finally {
    prismaInstance.$disconnect;
  }
}

export async function getDetails(c: Context) {
    const bhanu= await c.req.json()
    console.log(bhanu["token"])

    const lol = bhanu["token"]
    const del = await verifyUser(lol)
    console.log(del)

    return c.json({"msg": bhanu["token"]})
}

export async function verifyUser(token: string): Promise<boolean> {
    try {
        const res = await verify(token, JWT_SECRET)
        console.log(res)
        return res === null ? false : true
    } catch(err: any) {
        console.log(err)
        return false

    }
}
