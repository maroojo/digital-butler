import { NextResponse } from "next/server";
import { login } from "@/server/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await login(body.username, body.password, body.role);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 401 },
    );
  }
}
