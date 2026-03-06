import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ owner: string; repo: string; number: string }> },
) {
  try {
    const { owner, repo, number } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("github_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const githubResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3.diff", // 🔹 هذا يعطيك الـ diff
        },
      },
    );

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      return NextResponse.json(
        { error: errorText },
        { status: githubResponse.status },
      );
    }

    const diffText = await githubResponse.text();

    return NextResponse.json({ diff: diffText });
  } catch (error) {
    console.error("PR Diff API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
