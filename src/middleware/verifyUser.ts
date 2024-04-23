import { verify } from "hono/jwt";
import { JWT_SECRET } from "../utils/constants";

export interface verifyUserResponse {
  success: boolean;
  userId?: number;
}

export async function verifyUser(token: string): Promise<verifyUserResponse> {
  let res: verifyUserResponse = {
    success: false,
  };

  try {
    const decoded = await verify(token.slice(1, token.length - 1), JWT_SECRET);

    if (decoded) {
      res.success = true;
      res.userId = decoded["id"];
      return res;
    } else {
      res.success = false;
      return res;
    }
  } catch (err: any) {
    return res;
  }
}
