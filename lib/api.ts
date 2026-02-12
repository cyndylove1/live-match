import { Match, MatchDetail } from "./types";


const API_BASE_URL = "";

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
      );
    }

    const responseData = await response.json();

    if (!responseData.success) {
      throw new ApiError(responseData.message || "API request failed");
    }

    return responseData.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
    );
  }
}


export const api = {
  health: () => fetchApi<{ status: string }>("/health"),

  getMatches: () =>
    fetchApi<{ matches: Match[]; total: number }>("/api/matches"),

  getLiveMatches: () =>
    fetchApi<{ matches: Match[]; total: number }>("/api/matches/live"),

  getMatchDetail: (id: string) => fetchApi<MatchDetail>(`/api/matches/${id}`),
};
