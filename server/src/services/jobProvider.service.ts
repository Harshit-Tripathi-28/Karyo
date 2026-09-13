import { env } from "../config/env";
import type { RawJob, JobQueryOptions } from "../types/opportunity";

interface CacheEntry {
  timestamp: number;
  data: RawJob[];
}

const cache = new Map<string, CacheEntry>();

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Fetch jobs from Jobicy API
 */
async function fetchJobicyJobs(options: JobQueryOptions): Promise<RawJob[]> {
  const url = new URL("https://jobicy.com/api/v2/remote-jobs");
  url.searchParams.set("count", String(options.limit ?? 30));

  if (options.query) {
    // Jobicy supports tag filtering
    const cleanTag = options.query.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (cleanTag && cleanTag.length > 2) {
      url.searchParams.set("tag", cleanTag);
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "KARYO-Career-OS/1.0",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Jobicy API responded with ${response.status}`);
  }

  const data = (await response.json()) as {
    jobs?: Array<{
      id: number | string;
      url: string;
      jobSlug: string;
      jobTitle: string;
      companyName: string;
      companyLogo?: string;
      jobIndustry?: string[];
      jobType?: string[];
      jobGeo?: string;
      jobLevel?: string;
      jobExcerpt?: string;
      jobDescription?: string;
      pubDate?: string;
      salaryMin?: number;
      salaryMax?: number;
      salaryCurrency?: string;
      salaryPeriod?: string;
    }>;
  };

  if (!Array.isArray(data.jobs)) {
    return [];
  }

  return data.jobs.map((j) => {
    const rawDesc = j.jobDescription || j.jobExcerpt || "";
    const cleanDesc = stripHtml(rawDesc);
    const tags = Array.isArray(j.jobIndustry) ? [...j.jobIndustry] : [];

    return {
      id: String(j.id || j.jobSlug),
      title: j.jobTitle || "Untitled Opportunity",
      company: j.companyName || "Confidential",
      companyLogo: j.companyLogo || undefined,
      location: j.jobGeo || "Remote",
      remote: true,
      jobType: j.jobType?.[0] || "Full-Time",
      url: j.url,
      description: cleanDesc,
      tags,
      salary:
        j.salaryMin || j.salaryMax
          ? {
              min: j.salaryMin,
              max: j.salaryMax,
              currency: j.salaryCurrency || "USD",
              period: j.salaryPeriod || "yearly",
            }
          : undefined,
      postedAt: j.pubDate,
    };
  });
}

/**
 * Fetch jobs from Arbeitnow API as fallback / complementary provider
 */
async function fetchArbeitnowJobs(): Promise<RawJob[]> {
  const url = "https://www.arbeitnow.com/api/job-board-api";

  const response = await fetch(url, {
    headers: {
      "User-Agent": "KARYO-Career-OS/1.0",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Arbeitnow API responded with ${response.status}`);
  }

  const data = (await response.json()) as {
    data?: Array<{
      slug: string;
      company_name: string;
      title: string;
      description?: string;
      remote: boolean;
      url: string;
      tags?: string[];
      job_types?: string[];
      location?: string;
      created_at?: number;
    }>;
  };

  if (!Array.isArray(data.data)) {
    return [];
  }

  return data.data.map((j) => {
    const cleanTags = (j.tags || []).map((t) => t.replace(/^@/, "").trim()).filter(Boolean);
    const cleanDesc = stripHtml(j.description || "");

    return {
      id: j.slug,
      title: j.title || "Untitled Opportunity",
      company: j.company_name || "Confidential",
      location: j.location || (j.remote ? "Remote" : "Global"),
      remote: Boolean(j.remote),
      jobType: j.job_types?.[0] || "Full-Time",
      url: j.url,
      description: cleanDesc,
      tags: cleanTags,
      postedAt: j.created_at ? new Date(j.created_at * 1000).toISOString() : undefined,
    };
  });
}

export const fetchRealJobs = async (options: JobQueryOptions = {}): Promise<RawJob[]> => {
  const cacheKey = `${options.query || "all"}_${options.location || "any"}_${Boolean(options.remoteOnly)}`;
  const now = Date.now();
  const ttlMs = env.jobCacheTtlMinutes * 60 * 1000;

  const cached = cache.get(cacheKey);
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data;
  }

  let jobs: RawJob[] = [];

  // Attempt Primary Provider: Jobicy
  try {
    const jobicyResults = await fetchJobicyJobs(options);
    if (jobicyResults.length > 0) {
      jobs = jobicyResults;
    }
  } catch (err) {
    console.warn("[KARYO JOBS] Jobicy provider notice:", err instanceof Error ? err.message : err);
  }

  // If Jobicy returned few or no results, query Arbeitnow
  if (jobs.length < 5) {
    try {
      const arbeitnowResults = await fetchArbeitnowJobs();
      if (arbeitnowResults.length > 0) {
        for (const aj of arbeitnowResults) {
          jobs.push(aj);
        }
      }
    } catch (err) {
      console.warn("[KARYO JOBS] Arbeitnow provider notice:", err instanceof Error ? err.message : err);
    }
  }

  // Multi-key deduplication: unique by URL and unique by normalized company+title
  const seenUrls = new Set<string>();
  const seenTitleCompany = new Set<string>();
  const deduplicatedJobs: RawJob[] = [];

  for (const job of jobs) {
    const normKey = `${job.company.toLowerCase().trim()}_${job.title.toLowerCase().trim()}`;
    if (!seenUrls.has(job.url) && !seenTitleCompany.has(normKey)) {
      seenUrls.add(job.url);
      seenTitleCompany.add(normKey);
      deduplicatedJobs.push(job);
    }
  }
  jobs = deduplicatedJobs;

  // Filter if remoteOnly is requested
  if (options.remoteOnly) {
    jobs = jobs.filter((j) => j.remote || /remote/i.test(j.location));
  }

  // Filter if location is provided
  if (options.location && options.location.trim()) {
    const locRegex = new RegExp(options.location.trim(), "i");
    jobs = jobs.filter((j) => locRegex.test(j.location));
  }

  // If query is provided, score-filter or rank jobs that match query keywords
  if (options.query && options.query.trim()) {
    const keywords = options.query
      .toLowerCase()
      .split(/\s+/)
      .filter((k) => k.length > 2);

    if (keywords.length > 0) {
      jobs.sort((a, b) => {
        const aText = `${a.title} ${a.tags.join(" ")} ${a.company}`.toLowerCase();
        const bText = `${b.title} ${b.tags.join(" ")} ${b.company}`.toLowerCase();

        const aMatches = keywords.filter((k) => aText.includes(k)).length;
        const bMatches = keywords.filter((k) => bText.includes(k)).length;

        return bMatches - aMatches;
      });
    }
  }

  if (options.limit && options.limit > 0) {
    jobs = jobs.slice(0, options.limit);
  }

  // Cache final results
  if (jobs.length > 0) {
    cache.set(cacheKey, {
      timestamp: now,
      data: jobs,
    });
  }

  return jobs;
};
