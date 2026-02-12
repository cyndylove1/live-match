import { NextResponse } from "next/server";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/matches/live`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch live matches" },
      { status: 500 },
    );
  }
}
