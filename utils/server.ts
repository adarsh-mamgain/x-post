import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
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
export async function validateUserSession(sessionToken: string) {
  const validateSession = await verifyJWTToken(sessionToken);
  const sessionUser = await prisma.user.findUnique({
    where: { id: validateSession.id },
  });

  return sessionUser?.sessionId === validateSession.sessionId;
}

/**
 ** Sign and Verify JWT Token
 */
export async function signJWTToken(
  payload: any,
  expiresIn: string = "2h"
): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}
export async function verifyJWTToken(token: string): Promise<any> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
