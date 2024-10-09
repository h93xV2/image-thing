import pinata from "@lib/pinata";
import { PreviewRequest } from "@lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO: Verify the user is an authenticated user before allowing the url to be returned.
  const { pinataCid }: PreviewRequest = await request.json();
  
  console.log(`Preview Pinata CID: ${pinataCid}`);

  const url = await pinata.gateways.createSignedURL({ cid: pinataCid, expires: 30 });

  return NextResponse.json({url});
}