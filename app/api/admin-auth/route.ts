import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { pin } = await request.json();
  const correctPin = process.env.ADMIN_PIN || "73600";

  if (pin === correctPin) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
