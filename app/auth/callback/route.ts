import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(requestUrl.origin);
}