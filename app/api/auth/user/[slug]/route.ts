import { verifyJWTToken } from "@/utils/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { APIPathname } from "@/enums";

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  switch (req.nextUrl.pathname) {
    case APIPathname.USER_VALIDATE:
      if (token !== undefined) {
        const validateSession = await verifyJWTToken(token);
        const sessionUser = await prisma.user.findUnique({
          where: { id: validateSession.id },
        });

        return NextResponse.json({
          isValid: sessionUser?.sessionId === validateSession.sessionId,
        });
      } else {
        return NextResponse.json({ isValid: false });
      }
    default:
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
};
