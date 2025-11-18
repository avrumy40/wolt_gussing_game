import { startGameRequestSchema } from "../../schema";
import { storage } from "../../storage";

interface NetlifyEvent {
  httpMethod: string;
  path: string;
  body: string | null;
}

interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

function normalizePath(path: string): string {
  return path
    .replace(/^\/\.netlify\/functions\/api/, "")
    .replace(/^\/api/, "");
}

function ok(body: unknown): NetlifyResponse {
  return {
    statusCode: 200,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  };
}

function error(statusCode: number, message: string): NetlifyResponse {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify({ error: message }),
  };
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  const route = normalizePath(event.path);

  try {
    if (event.httpMethod === "GET" && route === "/categories") {
      const categories = await storage.getCategories();
      return ok(categories);
    }

    if (event.httpMethod === "POST" && route === "/game/start") {
      const parsedBody = event.body ? JSON.parse(event.body) : {};
      const validatedData = startGameRequestSchema.parse(parsedBody);
      const gameState = await storage.generateQuiz(validatedData.category);
      return ok(gameState);
    }

    return error(404, "Not Found");
  } catch (err) {
    console.error("API handler error:", err);

    if (err instanceof Error) {
      return error(400, err.message);
    }

    return error(500, "Internal Server Error");
  }
}
