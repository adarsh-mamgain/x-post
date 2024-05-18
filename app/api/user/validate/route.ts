import { getSession, validateUserSession } from "@/utils/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getSession("jwt");
  if (!session) return NextResponse.json(false);
  const validate = await validateUserSession(session);
  return NextResponse.json(validate);
};
