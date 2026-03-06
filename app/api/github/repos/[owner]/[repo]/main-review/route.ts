import { cookies } from "next/headers";
import { Buffer } from "buffer";

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

    // 1️⃣ نجيب معلومات الريبو
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text();
      return Response.json(
        { error: errorText },
        { status: repoResponse.status },
      );
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch;

    // 2️⃣ نجيب tree كامل
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    if (!treeResponse.ok) {
      const errorText = await treeResponse.text();
      return Response.json(
        { error: errorText },
        { status: treeResponse.status },
      );
    }

    const treeData = await treeResponse.json();

    // فلترة الملفات
    const allowedExtensions = [".ts", ".tsx", ".js", ".jsx"];
    const ignoredFolders = ["node_modules", "dist", "build", ".next", ".git"];

    const filteredFiles = treeData.tree.filter((item: any) => {
      if (item.type !== "blob") return false;

      const isIgnored = ignoredFolders.some((folder) =>
        item.path.startsWith(folder),
      );
      if (isIgnored) return false;

      const hasValidExtension = allowedExtensions.some((ext) =>
        item.path.endsWith(ext),
      );

      return hasValidExtension;
    });

    // نجيب أول 5 ملفات فقط
    // const filesToFetch = filteredFiles.slice(0, 1);
    const filesWithContent = [];

    for (const file of filteredFiles) {
      const contentResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${defaultBranch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        },
      );

      if (!contentResponse.ok) continue;

      const contentData = await contentResponse.json();

      if (contentData.encoding === "base64") {
        const decodedContent = Buffer.from(
          contentData.content,
          "base64",
        ).toString("utf-8");

        filesWithContent.push({
          path: file.path,
          content: decodedContent,
        });
      }
    }

    return Response.json({
      branch: defaultBranch,
      total_files: filesWithContent.length,
      files: filesWithContent,
    });
  } catch (error) {
    console.error("Main Review Error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
