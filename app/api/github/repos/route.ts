import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("github_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const githubResponse = await fetch(
      "https://api.github.com/user/repos?per_page=100",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!githubResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repositories" },
        { status: githubResponse.status },
      );
    }

    const repos = await githubResponse.json();

    // نرجع فقط بيانات مهمة (MVP clean)
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
    }));

    return NextResponse.json({ repos: formattedRepos });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
