import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { LISTING_BY_LISTING_ID_QUERY } from "@/sanity/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Query Sanity for listing data
    const listingData = await client.fetch(LISTING_BY_LISTING_ID_QUERY, {
      listingId,
    });

    if (!listingData) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    console.log("LISTING DATA:", listingData);
    return NextResponse.json(listingData);
  } catch (error) {
    console.error("Error fetching listing data:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing data" },
      { status: 500 }
    );
  }
}
