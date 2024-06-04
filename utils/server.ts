import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

/**
 ** Encrypt and decrypt session data
 */
export async function encrypt(data: any): Promise<string> {
  return JSON.stringify(data);
}
export async function decrypt(data: string): Promise<any> {
  return JSON.parse(data);
}

/**
 ** Create, get, and delete session
 */
export async function createSession(
  sessionName: string,
  text: string,
  expiresAt: Date
): Promise<any> {
  const session = cookies().set(`${sessionName}`, text, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: true,
    path: "/",
  });
  return session;
}
export async function getSession(sessionName: string): Promise<string> {
  try {
    const session = cookies().get(sessionName)?.value as string;
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
}
export async function deleteSession(sessionName: string): Promise<boolean> {
  cookies().delete(sessionName);
  return true;
}

/**
 ** Sign and Verify JWT Token
 */
export async function signJWTToken(
  payload: any,
  expiresIn?: EpochTimeStamp
): Promise<string> {
  const secret = process.env.JWT_SECRET ?? "";
  const token = jwt.sign(payload, secret, { expiresIn: expiresIn ?? "2h" });
  return JSON.stringify(token);
}
export async function verifyJWTToken(token: string): Promise<any> {
  const secret = process.env.JWT_SECRET ?? "";
  const data = JSON.parse(token);
  return jwt.verify(data, secret);
}
