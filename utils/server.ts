import "server-only";
import { cookies } from "next/headers";

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
  // const session = await encrypt({ text, expiresAt });
  const session = cookies().set(`${sessionName}`, text, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: true,
    path: "/",
  });
  return session;
}

export async function getSession(sessionName: string): Promise<any> {
  const session = cookies().get(sessionName)?.value;
  return session;
  // if (!session) { // return null; // } // return decrypt(session); }
}

export async function deleteSession(): Promise<boolean> {
  cookies().delete("session");
  return true;
}
