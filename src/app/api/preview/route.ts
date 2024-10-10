import pinata from "@lib/pinata";
import { createClient } from "@lib/supabase/server";
import { PreviewRequest } from "@lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error || !userResponse.data?.user) {
    return NextResponse.json({ message: 'User is not signed in' }, { status: 401 });
  }

  const { pinataCid }: PreviewRequest = await request.json();
  
  console.log(`Preview Pinata CID: ${pinataCid}`);

  const url = await pinata.gateways.createSignedURL({ cid: pinataCid, expires: 30 });

  return NextResponse.json({url});
}