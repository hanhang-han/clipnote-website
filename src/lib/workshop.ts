export const WORKSHOP_ORIGIN = (
  (
    import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    }
  ).env?.VITE_WORKSHOP_API_ORIGIN || "https://api.cliperx.com"
).replace(/\/$/, "");
export const WORKSHOP_API = `${WORKSHOP_ORIGIN}/api/workshop`;

export type WidgetCategory =
  | "clipboard"
  | "ai"
  | "productivity"
  | "system"
  | "other";
export interface WidgetMetadata {
  category: WidgetCategory;
  tags: string[];
  screenshots: string[];
  readme: string;
  changelog: string;
  minAppVersion?: string;
  feedbackURL?: string;
}
export interface WidgetManifest {
  id: string;
  name: string;
  version: string;
  apiVersion: number;
  author: string;
  description: string;
  license: string;
  permissions: Record<string, boolean | string[]>;
  task?: {
    input: { types: ("text" | "image")[]; minItems: number; maxItems: number };
    parameters: {
      key: string;
      title: string;
      default: string;
      required?: boolean;
    }[];
    prompt: string;
    output: { format: "markdown" };
  };
  [key: string]: unknown;
}
export interface WorkshopEntry {
  manifest: WidgetManifest;
  packageURL: string;
  sha256: string;
  sourceURL: string;
  metadata?: WidgetMetadata;
  publishedAt?: string;
}
export interface WorkshopVersion {
  version: string;
  sha256: string;
  publishedAt: string;
  revokedAt?: string;
  reason?: string;
  entry: WorkshopEntry;
}
export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "changes_requested"
  | "rejected"
  | "published"
  | "withdrawn";
export interface WorkshopSubmission {
  id: string;
  ownerId: string;
  widgetId: string;
  version: string;
  revision: number;
  status: SubmissionStatus;
  manifest: WidgetManifest | null;
  sha256: string | null;
  sourceURL: string;
  metadata: WidgetMetadata;
  createdAt: string;
  updatedAt: string;
  reviewNote: string;
  checks: { valid: boolean; messages: string[] };
}
export interface WorkshopReview {
  decision: string;
  note: string;
  revision: number;
  sha256: string;
  createdAt: string;
}
export interface SubmissionDetail {
  submission: WorkshopSubmission;
  reviews: WorkshopReview[];
  previous: WorkshopEntry | null;
}
export interface WorkshopAccount {
  user: { userId: string; name: string };
  admin: boolean;
}
export class WorkshopRequestError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function adminHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Basic ${btoa(`admin:${token}`)}` } : {};
}

export async function workshopRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  for (const [name, value] of Object.entries(adminHeaders(token)))
    headers.set(name, value);
  const response = await fetch(`${WORKSHOP_API}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new WorkshopRequestError(
      response.status,
      body.error || "request_failed",
      body.message || `HTTP ${response.status}`,
    );
  }
  return body as T;
}

export function workshopJSON<T>(
  path: string,
  body: unknown,
  method = "POST",
  token?: string,
) {
  return workshopRequest<T>(
    path,
    {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    token,
  );
}

export function workshopLoginURL(returnTo: string) {
  return `${WORKSHOP_ORIGIN}/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
}

export function safeWebURL(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value, WORKSHOP_ORIGIN);
    if (url.username || url.password) return undefined;
    if (
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    )
      return url.href;
  } catch {
    /* Invalid external links are omitted. */
  }
  return undefined;
}

export function installWidgetURL(id: string, version: string) {
  return `cliperx://workshop/install?${new URLSearchParams({ id, version })}`;
}

export function emptyMetadata(): WidgetMetadata {
  return {
    category: "clipboard",
    tags: [],
    screenshots: [],
    readme: "",
    changelog: "",
  };
}

export function canEditSubmission(status: SubmissionStatus) {
  return ["draft", "changes_requested", "rejected", "withdrawn"].includes(
    status,
  );
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function permissionLabels(
  permissions: WidgetManifest["permissions"] | undefined,
  zh: boolean,
) {
  const names: Record<string, [string, string]> = {
    openURL: ["点击后打开网页", "Open websites after a click"],
    clipboardWrite: [
      "点击后写入剪贴板",
      "Write to the clipboard after a click",
    ],
    systemMetrics: ["读取系统性能", "Read system metrics"],
    contextPreparation: ["使用原生上下文选材", "Use native context selection"],
    textProcessing: ["使用原生文本处理", "Use native text processing"],
    aiUsage: ["读取本机 AI 用量", "Read local AI usage"],
    collectionBasket: ["使用收集篮", "Use the collection basket"],
    musicControl: ["查看和控制音乐播放", "Read and control music playback"],
    agentConversations: ["使用 Agent 对话工作区", "Use the Agent workspace"],
    providerConfiguration: [
      "管理本机服务商配置",
      "Manage local provider configuration",
    ],
    powerManagement: ["保持唤醒与电源管理", "Keep awake and manage power"],
    aiTask: ["使用自定义 AI 任务", "Run custom AI tasks"],
  };
  const result: string[] = [];
  for (const [key, value] of Object.entries(permissions || {})) {
    if (key === "network" && Array.isArray(value)) {
      result.push(...value.map((host) => `${zh ? "访问" : "Access"} ${host}`));
    } else if (value === true) result.push(names[key]?.[zh ? 0 : 1] || key);
  }
  return result;
}
