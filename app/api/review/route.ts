import { NextRequest, NextResponse } from "next/server";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ESLint } from "eslint";

interface ReviewRequest {
  diff: string;
}

interface OllamaResponse {
  response: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ReviewRequest;
    const { diff } = body;

    if (!diff) {
      return NextResponse.json(
        { error: "Missing diff in request body" },
        { status: 400 },
      );
    }

    const issues: string[] = [];

    // Step 1: Parse diff with Babel and detect inline functions in JSX
    let ast;
    try {
      ast = parser.parse(diff, {
        sourceType: "module",
        plugins: [
          "jsx",
          "typescript",
          ["decorators", { decoratorsBeforeExport: false }],
        ],
        allowImportExportEverywhere: true,
        allowSuperOutsideMethod: true,
      });
    } catch (error) {
      issues.push(
        `Babel parse error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Step 2: Traverse AST to detect inline functions in JSX (onClick, onChange, etc.)
    if (ast) {
      traverse(ast, {
        JSXAttribute(path: NodePath<t.JSXAttribute>) {
          const { node } = path;

          // Get attribute name
          const attrName = t.isJSXIdentifier(node.name)
            ? node.name.name
            : t.isJSXNamespacedName(node.name)
              ? `${node.name.namespace.name}:${node.name.name.name}`
              : "";

          // Check if it's an event handler attribute
          const eventHandlers = [
            "onClick",
            "onChange",
            "onSubmit",
            "onBlur",
            "onFocus",
            "onMouseEnter",
            "onMouseLeave",
            "onKeyDown",
            "onKeyUp",
          ];

          if (eventHandlers.some((handler) => attrName.includes(handler))) {
            // Check if the value is an inline function
            if (
              node.value &&
              t.isJSXExpressionContainer(node.value) &&
              (t.isArrowFunctionExpression(node.value.expression) ||
                t.isFunctionExpression(node.value.expression) ||
                t.isCallExpression(node.value.expression))
            ) {
              issues.push(
                `⚠️ Inline function (possible bind issue) detected in JSX attribute: ${attrName}`,
              );
            }
          }
        },
      });
    }

    // Step 3: Use ESLint programmatically
    try {
      const eslint = new ESLint({
        baseConfig: {
          rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-no-bind": "warn",
            "react/prop-types": "off",
          },
        },
        ignorePatterns: [".next/**", "node_modules/**"],
      });

      const results = await eslint.lintText(diff);

      results.forEach((result) => {
        result.messages.forEach((message) => {
          const severity =
            message.severity === 2
              ? "[ERROR]"
              : message.severity === 1
                ? "[WARN]"
                : "[INFO]";
          issues.push(
            `${severity} ${message.ruleId || "unknown"}: ${message.message} (line ${message.line}, col ${message.column})`,
          );
        });
      });
    } catch (error) {
      issues.push(
        `ESLint error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    // Step 4: Prepare prompt with detected issues
    const issuesSummary =
      issues.length > 0
        ? `Detected issues:\n${issues.join("\n")}`
        : "No issues detected";

    const prompt = `You are a senior React engineer. Review the following code diff and provide constructive feedback.

${issuesSummary}

Code Diff to Review:
\`\`\`
${diff}
\`\`\`

Provide a concise but thorough review focusing on:
1. Code quality and React best practices
2. Potential performance issues
3. Maintainability concerns
4. Any issues mentioned above
Keep the review concise and actionable.`;

    // Step 5: Send to Ollama for AI review
    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3:8b",
        prompt,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(
        `Ollama request failed with status ${ollamaResponse.status}: ${ollamaResponse.statusText}`,
      );
    }

    const ollamaData = (await ollamaResponse.json()) as OllamaResponse;

    // Step 6: Return the review to frontend
    return NextResponse.json({
      review: ollamaData.response,
      detectedIssues: issues,
    });
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
