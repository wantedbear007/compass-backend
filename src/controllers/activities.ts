import { Context } from "hono";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../utils/constants";
import { databaseInstance } from "./database";


// to get all the activities
export async function getActivities(c: Context) {
    try {
      const token = c.req.header("token")!;
      const decoded = await verify(token?.slice(1, token.length - 1), JWT_SECRET);
  
      const authorId: number = decoded["id"];
  
      const response = await databaseInstance.activities.findMany({
        orderBy: {
          createdDate: "desc"
        },
        where: {
          authorId: authorId
        }
      })
  
      return c.json(response, 200);
  
    } catch (err: any) {
      return c.json({message: err.toString()}, 500)
    } finally {
      databaseInstance.$disconnect;
    }
  }
  

