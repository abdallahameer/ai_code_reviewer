import { NextResponse } from "next/server";

interface File {
  path: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const files: File[] = body.files;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const combinedCode = files
      .map(
        (file) =>
          `File: ${file.path}\n\n${file.content}\n\n----------------------\n`,
      )
      .join("\n");

    const prompt = `
You are a senior JavaScript/TypeScript engineer.

Your task is to improve the code style and modernize syntax, but without changing the overall logic or architecture.

Rules:
- Do NOT rewrite the entire code.
- Do NOT refactor structure or rename variables unless necessary.
- Do NOT suggest large architectural changes.
- Only suggest small, safe, modern syntax improvements.

Focus on:
1. Converting .then() chains to async/await when appropriate.
2. Improving readability.
3. Removing unnecessary code.
4. Improving variable declarations (const/let usage).
5. Minor clean modern JavaScript/TypeScript improvements.
6. Small formatting or clarity improvements.

If the code is already clean and modern, do NOT force improvements.
Only suggest changes if they clearly improve readability or modern syntax.

When suggesting a change:
- Show the original snippet.
- Then show the improved version.
- Keep explanations short and technical.

Code:

${combinedCode}
`;

    // 🔥 Call Groq API with streaming
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // fast and free
          messages: [{ role: "user", content: prompt }],
          stream: true,
        }),
      },
    );

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return NextResponse.json({ error: errText }, { status: groqRes.status });
    }

    // Stream Groq response back to the browser token by token
    // Groq streams in SSE format: lines starting with "data: "
    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqRes.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const raw = decoder.decode(value);
            const lines = raw.split("\n").filter((l) => l.trim() !== "");

            for (const line of lines) {
              // Groq SSE lines look like: data: {"choices":[{"delta":{"content":"hello"}}]}
              if (!line.startsWith("data: ")) continue;

              const jsonStr = line.replace("data: ", "");

              // last chunk is "data: [DONE]"
              if (jsonStr === "[DONE]") break;

              try {
                const parsed = JSON.parse(jsonStr);
                const token = parsed.choices?.[0]?.delta?.content;
                if (token) {
                  controller.enqueue(new TextEncoder().encode(token));
                }
              } catch {
                // skip malformed lines
              }
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("AI Review Error:", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
