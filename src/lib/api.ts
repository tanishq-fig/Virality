/**
 * API utility for calling the FastAPI ML backend
 */

const ML_BACKEND_URL = process.env.NEXT_PUBLIC_ML_BACKEND_URL || "http://localhost:8000";

export interface MLBackendRequest {
  text: string;
  num_comments?: number;
}

export interface MLBackendResponse {
  virality_probability: number;
  verdict: "High" | "Medium" | "Low";
}

export class MLBackendError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "MLBackendError";
  }
}

/**
 * Analyzes a post using the FastAPI ML backend
 * @param text - The content text to analyze
 * @param numComments - Optional number of comments (defaults to 0)
 * @returns Virality probability and verdict
 */
export async function analyzePost(
  text: string,
  numComments: number = 0
): Promise<MLBackendResponse> {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        num_comments: numComments,
      } as MLBackendRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new MLBackendError(
        `Backend returned ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data: MLBackendResponse = await response.json();
    
    // Validate response structure
    if (typeof data.virality_probability !== "number" || !data.verdict) {
      throw new MLBackendError("Invalid response format from ML backend");
    }

    return data;
  } catch (error) {
    if (error instanceof MLBackendError) {
      throw error;
    }

    // Network or other errors
    if (error instanceof Error) {
      throw new MLBackendError(
        `Failed to connect to ML backend: ${error.message}`,
        undefined,
        error
      );
    }

    throw new MLBackendError("Unknown error occurred while analyzing post");
  }
}

/**
 * Check if the ML backend is available
 */
export async function checkMLBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${ML_BACKEND_URL}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}
