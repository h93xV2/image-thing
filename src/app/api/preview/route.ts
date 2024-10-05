import pinata from "@lib/pinata";
import { NextResponse } from "next/server";

type PreviewRequest = {
  cid: string
};

export async function POST(request: Request) {
  const { cid }: PreviewRequest = await request.json();
  const url = await pinata.gateways.createSignedURL({ cid, expires: 30 });

  return NextResponse.json({url});
}