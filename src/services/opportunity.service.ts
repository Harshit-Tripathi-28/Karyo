import { apiRequest } from "./api";
import type {
  OpportunityQueryFilters,
  OpportunityResponse,
  MatchedOpportunity,
} from "../types/opportunity";

export const getOpportunities = (
  token: string,
  filters: OpportunityQueryFilters = {}
): Promise<OpportunityResponse> => {
  const params = new URLSearchParams();
  if (filters.query?.trim()) params.set("query", filters.query.trim());
  if (filters.location?.trim()) params.set("location", filters.location.trim());
  if (filters.remoteOnly) params.set("remoteOnly", "true");
  if (filters.minScore && filters.minScore > 0) params.set("minScore", String(filters.minScore));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);

  const queryString = params.toString();
  const endpoint = queryString ? `/opportunities?${queryString}` : "/opportunities";

  return apiRequest<OpportunityResponse>(endpoint, {
    token,
  });
};

export const getOpportunityById = (
  token: string,
  id: string
): Promise<{ success: boolean; opportunity: MatchedOpportunity }> => {
  return apiRequest<{ success: boolean; opportunity: MatchedOpportunity }>(
    `/opportunities/${encodeURIComponent(id)}`,
    {
      token,
    }
  );
};
