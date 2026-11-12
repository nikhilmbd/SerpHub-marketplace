import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, passwordMatches } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.password !== "string" || !passwordMatches(body.password)) {
      return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });
    }
    const session = createAdminSession();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, session.value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: session.maxAge });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
