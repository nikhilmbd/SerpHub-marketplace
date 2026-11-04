
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$connect();

    const result = await prisma.$queryRaw`SELECT NOW() AS current_time`;

    return NextResponse.json({
      success: true,
      message: "SerpHub database connection successful!",
      database: result,
    });
  } catch (error) {
    console.error("Database test failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
