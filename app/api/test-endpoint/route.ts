import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Process the data
    console.log("Received data:", body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// If you need GET functionality too
export async function GET() {
  return NextResponse.json(
    { message: "Test endpoint working" },
    { status: 200 }
  );
}

// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   return NextResponse.json({
//     success: true,
//     message: "Test POST endpoint works",
//   });
// }

// export async function GET() {
//   return NextResponse.json({ message: "Test GET endpoint works" });
// }
