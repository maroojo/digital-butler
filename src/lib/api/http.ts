export async function parseJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const rawText = await res.text();

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but received ${contentType || "unknown content-type"}.\n` +
        `Response preview: ${rawText.slice(0, 180)}`
    );
  }

  try {
    return JSON.parse(rawText) as T;
  } catch {
    throw new Error(`Invalid JSON response: ${rawText.slice(0, 180)}`);
  }
}