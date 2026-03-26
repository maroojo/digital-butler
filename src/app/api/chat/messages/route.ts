import { NextResponse } from "next/server";
import { getRoomMessages, sendChatMessage } from "@/server/services/chat.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const role = searchParams.get("role") as "user" | "admin" | null;

    if (!roomId) {
      return NextResponse.json(
        {
          success: false,
          message: "roomId is required",
        },
        { status: 400 }
      );
    }

    const data = await getRoomMessages(roomId, role || undefined);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await sendChatMessage(body);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}