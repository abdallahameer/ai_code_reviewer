import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    },
  );

  const data = await tokenResponse.json();

  const accessToken = data.access_token;

  if (!accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 400 });
  }

  const response = NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  );

  response.cookies.set("github_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
