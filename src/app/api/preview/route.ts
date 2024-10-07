import pinata from "@lib/pinata";
import { NextResponse } from "next/server";

type PreviewRequest = {
  cid: string
};

export async function POST(request: Request) {
  // TODO: Verify the user is an authenticated user before allowing the url to be returned.
  const { cid }: PreviewRequest = await request.json();
  const url = await pinata.gateways.createSignedURL({ cid, expires: 30 });

  return NextResponse.json({url});
}