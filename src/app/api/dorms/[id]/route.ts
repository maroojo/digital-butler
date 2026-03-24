import { NextResponse } from "next/server";
import { getDormByIdOrSlug } from "@/server/services/dorms.service";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  const { id } = await context.params;

  const dorm = await getDormByIdOrSlug(id);

  if (!dorm) {
    return NextResponse.json(
      {
        success: false,
        message: "Dorm not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: dorm,
  });
}