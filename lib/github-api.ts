import type { RepoMeta } from "./types";

const API_BASE = "https://api.github.com";
const CACHE_PREFIX = "gh_cache_";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/* ── Cache Helpers ───────────────────────────────────────────── */

function getCached<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    /* quota exceeded — ignore */
  }
}

/* ── Fetch Repo Metadata ─────────────────────────────────────── */

export async function fetchRepoMeta(
  owner: string,
  repo: string
): Promise<RepoMeta | null> {
  const cacheKey = `meta_${owner}_${repo}`;
  const cached = getCached<RepoMeta>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meta: RepoMeta = {
      stars: data.stargazers_count ?? 0,
      language: data.language ?? null,
      lastUpdate: data.pushed_at ?? data.updated_at ?? "",
      description: data.description ?? null,
      openIssues: data.open_issues_count ?? 0,
    };
    setCache(cacheKey, meta);
    return meta;
  } catch {
    return null;
  }
}

/* ── Fetch README ────────────────────────────────────────────── */

export async function fetchReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  const cacheKey = `readme_${owner}_${repo}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/repos/${owner}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const decoded = decodeURIComponent(
      atob(data.content)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    setCache(cacheKey, decoded);
    return decoded;
  } catch {
    return null;
  }
}

/* ── Fetch Recent Commits ────────────────────────────────────── */

export interface CommitSummary {
  sha: string;
  message: string;
  date: string;
}

export async function fetchRecentCommits(
  owner: string,
  repo: string,
  count = 5
): Promise<CommitSummary[]> {
  const cacheKey = `commits_${owner}_${repo}`;
  const cached = getCached<CommitSummary[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${API_BASE}/repos/${owner}/${repo}/commits?per_page=${count}`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const commits: CommitSummary[] = data.map(
      (c: { sha: string; commit: { message: string; author: { date: string } } }) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
        date: c.commit.author.date,
      })
    );
    setCache(cacheKey, commits);
    return commits;
  } catch {
    return [];
  }
}
