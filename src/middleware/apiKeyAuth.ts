
import { Context, Next } from "hono";
import { keys } from "../utils/constants";


export const apiKey = async (c: Context, next: Next) => {  
    try {
      const key = c.req.header("apiKey");
  
      if (!key) {
        return c.json({message: "API key required"}, 401)
      }
  
      console.log(key)
  
      if (keys.includes(key.trim().toString())) {
  
        return await next();
  
      }
  
  
      return c.json({message: "Invalid API key"}, 401)
  
      
    } catch (err) {
      console.log(err)
      return c.json({message: "Internal server error"}, 500)
    }
  }