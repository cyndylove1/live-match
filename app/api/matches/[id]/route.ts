import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await fetch(`${API_BASE_URL}/api/matches/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch match details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch match details" },
      { status: 500 },
    );
  }
}
