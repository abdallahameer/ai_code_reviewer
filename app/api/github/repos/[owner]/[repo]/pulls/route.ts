import { cookies } from "next/headers";

export async function GET(
  req: Request,
  context: { params: Promise<{ owner: string; repo: string }> },
) {
  try {
    const { owner, repo } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("github_token")?.value;

    if (!token) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const githubResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=open`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      return Response.json(
        { error: errorText },
        { status: githubResponse.status },
      );
    }

    const pulls = await githubResponse.json();

    const formattedPulls = pulls.map((pr: any) => ({
      id: pr.id,
      number: pr.number,
      title: pr.title,
      state: pr.state,
      user: pr.user?.login,
      created_at: pr.created_at,
    }));

    return Response.json({ pulls: formattedPulls });
  } catch (error) {
    console.error("Pulls API Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
